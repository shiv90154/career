import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get("/blogs/public_list.php").then(res => setBlogs(res.data));
  }, []);

  return (
    <div className="blog-grid">
      {blogs.map(blog => (
        <div key={blog.slug} className="blog-card">
          <h2>{blog.title}</h2>
          <p>{blog.excerpt}</p>
          <Link to={`/blogs/${blog.slug}`}>Read More</Link>
        </div>
      ))}
    </div>
  );
}
