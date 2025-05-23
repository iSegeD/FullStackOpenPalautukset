import { useNavigate } from "react-router-dom";
import { useForm } from "../hooks/index";

const CreateForm = ({ addNew, infoHelper }) => {
  const content = useForm("text");
  const author = useForm("text");
  const info = useForm("text");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.input.value,
      author: author.input.value,
      info: info.input.value,
      votes: 0,
    });
    infoHelper(`a new anecdote ${content.input.value} created!`);
    navigate("/");
  };

  const handleReset = () => {
    content.onReset();
    author.onReset();
    info.onReset();
  };

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.input} />
        </div>
        <div>
          author
          <input {...author.input} />
        </div>
        <div>
          url for more info
          <input {...info.input} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};

export default CreateForm;
