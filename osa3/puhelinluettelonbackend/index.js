const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :requestBody "
  )
);
const PORT = process.env.PORT || 3001;

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("requestBody", (req) => {
  return JSON.stringify(req.body);
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/info", (req, res) => {
  res.send(`
    <h1>Phonebook has info for ${persons.length} people.</h1>
    <h3>${new Date().toString()}</h3>
    `);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((item) => item.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((item) => item.id !== id);

  res.status(204).end();
});

const randomId = () => {
  let id;

  do {
    id = String(Math.floor(Math.random() * 10000));
  } while (persons.some((item) => item.id === id));

  return id;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number is missing",
    });
  }

  if (
    persons.find((item) => item.name.toLowerCase() === body.name.toLowerCase())
  ) {
    return res.status(400).json({
      error: "Name must be unique",
    });
  }

  const newPerson = {
    id: randomId(),
    name: body.name,
    number: body.number,
  };

  persons = [...persons, newPerson];
  res.json(newPerson);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
