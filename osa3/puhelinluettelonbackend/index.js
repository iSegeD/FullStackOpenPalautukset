require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const PhonebookDB = require('./models/phonebook')
app.use(express.static('dist'))
app.use(express.json())
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :requestBody ',
  ),
)
const PORT = process.env.PORT

/* let persons = [
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
]; */

morgan.token('requestBody', (req) => {
  return JSON.stringify(req.body)
})

app.get('/api/persons', (req, res) => {
  PhonebookDB.find({}).then((people) => {
    res.json(people)
  })
})

app.get('/info', (req, res, next) => {
  /* res.send(`
    <h1>Phonebook has info for ${persons.length} people.</h1>
    <h3>${new Date().toString()}</h3>
    `); */

  PhonebookDB.countDocuments({})
    .then((people) => {
      res.send(`
        <h1>Phonebook has info for ${people} people.</h1>
        <h3>${new Date().toString()}</h3>
    `)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  /* const id = req.params.id;
  const person = persons.find((item) => item.id === id);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  } */

  PhonebookDB.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.json(result)
      } else {
        const error = new Error('Person not found')
        error.status = 404
        return next(error)
      }
    })
    .catch((error) => next(error))
})

app.delete('/api/persons/:id', (req, res) => {
  /* const id = req.params.id;
  persons = persons.filter((item) => item.id !== id);

  res.status(204).end(); */

  PhonebookDB.findByIdAndDelete(req.params.id).then((result) => {
    res.status(204).end()
  })
})

/* const randomId = () => {
  let id;

  do {
    id = String(Math.floor(Math.random() * 10000));
  } while (persons.some((item) => item.id === id));

  return id;
}; */

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  /* if (!body.name || !body.number) {
    const error = new Error("Name or number is missing");
    error.status = 400;
    return next(error);

    return res.status(400).json({
      error: "Name or number is missing",
    });
  } */

  /* if (
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

  persons = [...persons, newPerson]; */

  const newPerson = new PhonebookDB({
    name: body.name,
    number: body.number,
  })

  newPerson
    .save()
    .then((savedPerson) => {
      res.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  PhonebookDB.findById(req.params.id)
    .then((result) => {
      if (!result) {
        const error = new Error('Person not found')
        error.status = 404
        return next(error)
      }

      result.name = name
      result.number = number

      return result.save().then((updatedPerson) => {
        res.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})

/* Middleware */

const unknownPathHandler = (request, response) => {
  response.status(404).send({ error: 'Unknown endpoint' })
}

app.use(unknownPathHandler)

const errorHandler = (error, request, response, next) => {
  if (error.status === 400) {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Incorent id format' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.status === 404) {
    return response.status(404).send({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
