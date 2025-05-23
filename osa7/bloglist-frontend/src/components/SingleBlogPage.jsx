import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { updateBlog, removeBlog, addComment } from "../reducers/blogReducer";
import { useState } from "react";

const SingleBlogPage = ({ currentUser }) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const blog = useSelector((state) =>
    state.blog.find((item) => item.id === id)
  );

  const deleteBlog = (id) => {
    dispatch(removeBlog(id));
    navigate("/");
  };

  const newComment = (id, comment) => {
    dispatch(addComment(id, comment));
    setComment("");
  };

  if (!blog) {
    return null;
  }
  return (
    <div className="p-4 border rounded bg-light mt-5">
      <h2>{blog.title}</h2>
      <a href="#" className="text-decoration-none">
        {blog.url}
      </a>

      <div className="mt-3">
        {blog.likes} likes{" "}
        <button
          className="btn btn-outline-primary btn-sm ms-2"
          onClick={() => dispatch(updateBlog(blog.id))}
        >
          Like
        </button>
      </div>

      <div className="mt-2 text-muted">Added by {blog.user.name}</div>

      {currentUser.name === blog.user.name && (
        <button
          className="btn btn-danger btn-sm mt-2"
          onClick={() => deleteBlog(blog.id)}
        >
          Delete blog
        </button>
      )}

      <h3 className="mt-4">Comments</h3>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
          placeholder="Write a comment"
        />
        <button
          className="btn btn-success"
          onClick={() => newComment(blog.id, { comments: comment })}
        >
          Add comment
        </button>
      </div>

      {blog.comments.length > 0 && (
        <ul className="list-group">
          {blog.comments.map((item) => (
            <li key={item} className="list-group-item">
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SingleBlogPage;
