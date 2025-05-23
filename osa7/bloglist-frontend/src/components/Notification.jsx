import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";

const Notification = () => {
  const message = useSelector((state) => state.notification);

  if (!message) {
    return null;
  }

  const isError = message.toLowerCase().startsWith("error");
  const variant = isError ? "danger" : "success";

  const dispalayMessage = isError
    ? message.replace(/^error:\s*/i, "")
    : message;

  return (
    <Alert variant={variant} className="text-center fs-4">
      {dispalayMessage}
    </Alert>
  );
};

export default Notification;
