import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdote",
  initialState: [],
  reducers: {
    addAnecdote(state, action) {
      state.push(action.payload);
    },
    vote(state, action) {
      const updated = action.payload;
      return state
        .map((item) => (item.id !== updated.id ? item : updated))
        .sort((a, b) => b.votes - a.votes);
    },
    getAllAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { addAnecdote, vote, getAllAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdote = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(getAllAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.create(content);
    dispatch(addAnecdote(newAnecdote));
  };
};

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const { anecdote } = getState();
    const anecdoteToVote = anecdote.find((item) => item.id === id);
    const changedAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1,
    };

    const updatedAnecdote = await anecdoteService.update(id, changedAnecdote);
    dispatch(vote(updatedAnecdote));
  };
};

export default anecdoteSlice.reducer;
