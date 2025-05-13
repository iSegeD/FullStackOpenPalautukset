import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "INFO":
      return action.payload;

    case "CLEAR":
      return "";

    default:
      return state;
  }
};

const NotificationContext = createContext();

export const useNotificationValue = () => {
  const result = useContext(NotificationContext);
  return result[0];
};

export const useNotificationDispatch = () => {
  const result = useContext(NotificationContext);
  return result[1];
};

export const useNotification = () => {
  const dispatch = useNotificationDispatch();

  return (message) => {
    dispatch({ type: "INFO", payload: message });
    setTimeout(() => {
      dispatch({ type: "CLEAR" });
    }, 5000);
  };
};

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ""
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
