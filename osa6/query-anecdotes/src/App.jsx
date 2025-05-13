import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAll, create, update } from "./services/anecdote";
import { useNotification } from "./components/NotificationContext";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";

const App = () => {
  const queryClient = useQueryClient();

  const infoHelper = useNotification();

  const newAnecdoteMutation = useMutation({
    mutationFn: create,
    onSuccess: (newAnecdote) => {
      const all = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], [...all, newAnecdote]);
      infoHelper(`Anecdote "${newAnecdote.content}" added`);
    },
    onError: (error) => {
      infoHelper(error.response.data.error);
    },
  });

  const updateAnecdoteMutation = useMutation({
    mutationFn: update,
    onSuccess: (updatedAnecdote) => {
      const all = queryClient.getQueryData(["anecdotes"]);
      const updated = all
        .map((item) =>
          item.id !== updatedAnecdote.id ? item : updatedAnecdote
        )
        .sort((a, b) => b.votes - a.votes);

      queryClient.setQueryData(["anecdotes"], updated);
      infoHelper(`Anecdote "${updatedAnecdote.content}" voted`);
    },
  });

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
  };

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAll,
  });

  if (result.isLoading) {
    return <h2>Loading anecdotes...</h2>;
  }

  if (result.isError) {
    return <h3>Anecdote service not available due to problems in server</h3>;
  }

  const anecdotes = [...result.data].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm
        addAnecdote={(content) =>
          newAnecdoteMutation.mutate({ content, votes: 0 })
        }
      />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
