import { createSlice } from "@reduxjs/toolkit";
import loginService from "../services/login";
import blogService from "../services/blogs";
import { setNotification } from "./notificationReducer";

const authSlice = createSlice({
  name: "auth",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser(state, action) {
      return null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export const initializeUser = () => {
  return (dispatch) => {
    const storageUser = window.localStorage.getItem("BlogAppLoggedUser");

    if (storageUser) {
      const currentUser = JSON.parse(storageUser);
      blogService.getToken(currentUser.token);
      dispatch(setUser(currentUser));
    }
  };
};

export const signIn = (credentials) => {
  return async (dispatch) => {
    try {
      const currentUser = await loginService.logIn(credentials);

      window.localStorage.setItem(
        "BlogAppLoggedUser",
        JSON.stringify(currentUser)
      );
      blogService.getToken(currentUser.token);
      dispatch(setUser(currentUser));
    } catch (error) {
      dispatch(setNotification(`Error: ${error.response.data.error}`));
    }
  };
};

export const logOut = () => {
  return (dispatch) => {
    window.localStorage.removeItem("BlogAppLoggedUser");
    dispatch(clearUser());
  };
};

export default authSlice.reducer;
