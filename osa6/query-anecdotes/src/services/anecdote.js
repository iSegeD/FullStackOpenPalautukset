import axios from "axios";
const baseUrl = "http://localhost:3001/anecdotes";

export const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

export const create = async (content) => {
  try {
    const response = await axios.post(baseUrl, content);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const update = async (content) => {
  const response = await axios.put(`${baseUrl}/${content.id}`, content);
  return response.data;
};
