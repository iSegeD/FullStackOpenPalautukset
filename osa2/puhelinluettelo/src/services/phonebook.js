import axios from "axios";
const baseUrl = "http://localhost:3002/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newPerson) => {
  const request = axios.post(baseUrl, newPerson);
  return request.then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

const update = (id, updateData) => {
  const request = axios.put(`${baseUrl}/${id}`, updateData);
  return request.then((response) => response.data);
};

export default { getAll, create, remove, update };
