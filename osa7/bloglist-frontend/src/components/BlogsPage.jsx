import { useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ModelWindow from "./ModelWindow";
import CreateForm from "./CreateForm";
import { Card, Nav } from "react-bootstrap";

const BlogsPage = () => {
  const blogs = useSelector((state) => state.blog);
  const modelRef = useRef();

  return (
    <>
      <section>
        <ModelWindow label="Create new blog" ref={modelRef}>
          <CreateForm modelRef={modelRef} />
        </ModelWindow>
      </section>
      <section>
        {blogs.map((item) => (
          <Card key={item.id} border="dark" className="w-100 mt-3">
            <Card.Body>
              <Card.Title>
                <Nav.Link as={Link} to={`/blogs/${item.id}`}>
                  {item.title}
                </Nav.Link>
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
      </section>
    </>
  );
};

export default BlogsPage;
