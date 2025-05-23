import { useState } from "react";
import { Routes, Route, Navigate, useMatch } from "react-router-dom";
import Menu from "./components/Menu";
import AnecdoteList from "./components/AnecdoteList";
import SingleAnecdote from "./components/SingleAnecdote";
import CreateForm from "./components/CreateForm";
import About from "./components/About";
import Footer from "./components/Footer";

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: "If it hurts, do it more often",
      author: "Jez Humble",
      info: "https://martinfowler.com/bliki/FrequencyReducesDifficulty.html",
      votes: 0,
      id: 1,
    },
    {
      content: "Premature optimization is the root of all evil",
      author: "Donald Knuth",
      info: "http://wiki.c2.com/?PrematureOptimization",
      votes: 0,
      id: 2,
    },
  ]);

  const [notification, setNotification] = useState("");

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000);
    setAnecdotes(anecdotes.concat(anecdote));
  };

  const anecdoteById = (id) => anecdotes.find((a) => a.id === id);

  const vote = (id) => {
    const anecdote = anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1,
    };

    setAnecdotes(anecdotes.map((a) => (a.id === id ? voted : a)));
  };

  const infoHelper = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 5000);
  };

  const match = useMatch("/anecdotes/:id");

  const anecdote = match
    ? anecdotes.find((item) => item.id === Number(match.params.id))
    : null;

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu />
      {notification}
      <Routes>
        <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
        <Route
          path="/create"
          element={<CreateForm addNew={addNew} infoHelper={infoHelper} />}
        />
        <Route path="/about" element={<About />} />
        <Route
          path="/anecdotes/:id"
          element={<SingleAnecdote anecdote={anecdote} />}
        />
      </Routes>
      <br />
      <Footer />
    </div>
  );
};

export default App;
