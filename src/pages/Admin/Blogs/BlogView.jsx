import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BlogView() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios.get(`/blogs/view.php?slug=${slug}`)
      .then(res => setBlog(res.data));
  }, [slug]);

  if (!blog) return <p>Loading...</p>;

  return (
    <article className="blog-content">
      <h1>{blog.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  );
}
