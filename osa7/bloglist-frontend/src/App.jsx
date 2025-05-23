import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import { initializeUser } from "./reducers/authReducer";
import { initializeBlog } from "./reducers/blogReducer";
import { initializeUsers } from "./reducers/userReducer";

import Navigation from "./components/Navigation";
import LoginForm from "./components/LoginForm";
import BlogsPage from "./components/BlogsPage";
import SingleBlogPage from "./components/SingleBlogPage";
import UsersPage from "./components/UsersPage";
import UserPage from "./components/UserPage";
import Notification from "./components/Notification";

const App = () => {
  const [userChecked, setUserChecked] = useState(false);

  const currentUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlog());
    dispatch(initializeUser());
    dispatch(initializeUsers());
    setUserChecked(true);
  }, [dispatch]);

  if (!userChecked) {
    return null;
  }

  return (
    <>
      <Navigation />
      <Notification />

      <main className="container">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/"
            element={
              currentUser ? <BlogsPage /> : <Navigate replace to="/login" />
            }
          />
          <Route
            path="/blogs/:id"
            element={<SingleBlogPage currentUser={currentUser} />}
          />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/:id" element={<UserPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
