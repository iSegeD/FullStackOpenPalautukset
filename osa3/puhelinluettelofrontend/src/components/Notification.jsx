const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  const notificationMessage = message.startsWith("Information") || message.startsWith("Error")
    ? "notification error"
    : "notification";

  return <div className={notificationMessage}>{message}</div>;
};

export default Notification;
