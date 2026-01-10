import { useEffect, useState } from "react";
import axios from "axios";
import { Edit, Trash2, Eye, Search, Plus } from "lucide-react";

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/blogs/list.php");
      setBlogs(res.data);
    } catch {
      alert("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this blog?")) return;

    try {
      await axios.delete(`/blogs/delete.php?id=${id}`);
      setBlogs(prev => prev.filter(b => b.id !== id));
    } catch {
      alert("Delete failed");
    }
  };

 const filteredBlogs = Array.isArray(blogs)
  ? blogs.filter(blog =>
      blog.title?.toLowerCase().includes(search.toLowerCase())
    )
  : [];


  const statusClasses = {
    published: "bg-green-100 text-green-700",
    draft: "bg-yellow-100 text-yellow-700",
    archived: "bg-red-100 text-red-700"
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Blogs</h1>
          <p className="text-sm text-gray-500">
            Total Blogs: {blogs.length}
          </p>
        </div>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus size={16} />
          Add Blog
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 flex items-center gap-2 bg-white p-3 rounded-lg shadow">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search blogs..."
          className="w-full outline-none text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading blogs...
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No blogs found
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-gray-600">Title</th>
                <th className="px-6 py-3 text-left text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-gray-600">Created</th>
                <th className="px-6 py-3 text-center text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredBlogs.map(blog => (
                <tr key={blog.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">
                      {blog.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      /{blog.slug}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-medium ${
                        statusClasses[blog.status]
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        className="p-2 rounded hover:bg-gray-100 text-blue-600"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        className="p-2 rounded hover:bg-gray-100 text-yellow-600"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 rounded hover:bg-gray-100 text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
