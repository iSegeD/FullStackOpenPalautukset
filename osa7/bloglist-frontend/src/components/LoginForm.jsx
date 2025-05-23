import { useField } from "../hooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signIn } from "../reducers/authReducer";

import { Button, Form } from "react-bootstrap";

const LoginForm = () => {
  const username = useField("text");
  const password = useField("password");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await dispatch(
      signIn({
        username: username.inputProps.value,
        password: password.inputProps.value,
      })
    );
    username.reset();
    password.reset();
    navigate("/");
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="mt-5 border border-dark rounded p-4"
    >
      <legend className="mb-4 text-center h4">Sign in to your account</legend>

      <Form.Group className="mb-3" controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          {...username.inputProps}
          placeholder="Enter your username"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          {...password.inputProps}
          placeholder="Enter your password"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Sign in
      </Button>
    </Form>
  );
};

export default LoginForm;
