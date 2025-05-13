import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote, initializeAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";
import { useEffect } from "react";

const AnecdoteList = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeAnecdote());
  }, []);

  const anecdotes = useSelector(({ anecdote, filter }) => {
    const result = filter.toLowerCase();
    return anecdote.filter((item) =>
      item.content.toLowerCase().includes(result)
    );
  });

  const vote = (id) => {
    const result = anecdotes.find((item) => item.id === id);
    dispatch(voteAnecdote(id));
    dispatch(setNotification(`You voted "${result.content}"`, 5));
  };

  return (
    <>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default AnecdoteList;
