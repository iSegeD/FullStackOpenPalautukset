const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const notificationMessage = message.startsWith("Information")
    ? "notification error"
    : "notification";

  return <div className={notificationMessage}>{message}</div>;
};

export default Notification;
