import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import { setNotification } from "./notificationReducer";
import { initializeUsers } from "./userReducer";

const blogSlice = createSlice({
  name: "blog",
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    addBlog(state, action) {
      state.push(action.payload);
    },
    updateBlogLikes(state, action) {
      const updatedBlog = action.payload;
      return state
        .map((item) => (item.id !== updatedBlog.id ? item : updatedBlog))
        .sort((a, b) => b.likes - a.likes);
    },
    addBlogComments(state, action) {
      const updateBlog = action.payload;
      return state.map((item) =>
        item.id !== updateBlog.id ? item : updateBlog
      );
    },
    deleteBlog(state, action) {
      const blogId = action.payload;
      return state.filter((item) => item.id !== blogId);
    },
  },
});

export const {
  setBlogs,
  addBlog,
  updateBlogLikes,
  addBlogComments,
  deleteBlog,
} = blogSlice.actions;

export const initializeBlog = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);

    dispatch(setBlogs(sortedBlogs));
  };
};

export const createBlog = (objectData) => {
  return async (dispatch, getState) => {
    try {
      const newBlog = await blogService.create(objectData);
      const { auth } = getState();
      newBlog.user = auth;

      dispatch(addBlog(newBlog));
      dispatch(initializeUsers());
      dispatch(
        setNotification(
          `A new blog ${newBlog.title} by ${newBlog.author} added`
        )
      );
      return { success: true };
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response.data.error}`));
      return { success: false };
    }
  };
};

export const updateBlog = (id) => {
  return async (dispatch, getState) => {
    try {
      const { blog } = getState();
      const blogToLike = blog.find((item) => item.id === id);
      const changedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1,
      };

      const updatedBlog = await blogService.update(id, changedBlog);
      dispatch(updateBlogLikes(updatedBlog));
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response.data.error}`));
    }
  };
};

export const addComment = (id, comment) => {
  return async (dispatch) => {
    if (comment.comments.trim() === "") {
      dispatch(setNotification("Error: Comment cannot be empty"));
      return;
    }
    try {
      const updatedBlog = await blogService.createComment(id, comment);
      dispatch(addBlogComments(updatedBlog));
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response.data.error}`));
    }
  };
};

export const removeBlog = (id) => {
  return async (dispatch, getState) => {
    try {
      const { blog } = getState();
      const blogToDelete = blog.find((item) => item.id === id);

      if (
        window.confirm(
          `Remove blog ${blogToDelete.title} by ${blogToDelete.author}?`
        )
      ) {
        await blogService.remove(id);
        dispatch(deleteBlog(id));
        dispatch(initializeUsers());
        dispatch(
          setNotification(`Blog: ${blogToDelete.title} has been removed`)
        );
      }
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response.data.error}`));
    }
  };
};

export default blogSlice.reducer;
