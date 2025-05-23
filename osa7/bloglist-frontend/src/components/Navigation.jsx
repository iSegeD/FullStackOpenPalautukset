import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../reducers/authReducer";
import { Link } from "react-router-dom";

import { Container, Navbar, Nav, Button } from "react-bootstrap";

const Navigation = () => {
  const currentUser = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!currentUser) {
    return null;
  }

  return (
    <Navbar  bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Container>
        <Navbar.Brand style={{ color: "#f5f5dc" }}>BlogApp</Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link as={Link} to="/">
            Blogs
          </Nav.Link>
          <Nav.Link as={Link} to="/users">
            Users
          </Nav.Link>
        </Nav>

        <Nav className="d-flex align-items-center gap-2">
          <div className="text-white me-2 align-self-center">
            {currentUser.name} logged in
          </div>
          <Button
            variant="outline-light"
            size="sm"
            className="align-self-start mt-0"
            onClick={() => dispatch(logOut())}
          >
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Navigation;
