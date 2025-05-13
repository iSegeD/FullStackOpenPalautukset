import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();

  const addAnecdote = async (e) => {
    e.preventDefault();
    const content = e.target.anecdote.value;
    e.target.anecdote.value = "";

    dispatch(createAnecdote(content));
    dispatch(setNotification(`You added "${content}"`, 5));
  };
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input type="text" name="anecdote" />
        <button type="submit">submit</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
