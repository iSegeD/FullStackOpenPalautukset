import { useField } from "../hooks";
import { useDispatch } from "react-redux";
import { createBlog } from "../reducers/blogReducer";

import { Button, Form } from "react-bootstrap";

const CreateForm = ({ modelRef }) => {
  const title = useField("text");
  const author = useField("text");
  const url = useField("text");

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(
      createBlog({
        title: title.inputProps.value,
        author: author.inputProps.value,
        url: url.inputProps.value,
      })
    );

    if (result && result.success) {
      title.reset();
      author.reset();
      url.reset();

      modelRef.current.switcher();
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-3">
      <h2>Create new Blog</h2>
      <Form.Group className="mb-3" controlId="formTitle">
        <Form.Label>Blog title</Form.Label>
        <Form.Control {...title.inputProps} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicAuthor">
        <Form.Label>Blog author</Form.Label>
        <Form.Control {...author.inputProps} />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicUrl">
        <Form.Label>Blog URL</Form.Label>
        <Form.Control {...url.inputProps} />
      </Form.Group>

      <Button variant="success" type="submit">
        Create
      </Button>
    </Form>
  );
};

export default CreateForm;
