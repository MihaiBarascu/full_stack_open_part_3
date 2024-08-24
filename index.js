const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:5173",
};

app.use(cors());

app.use(morgan("tiny"));

app.use(express.json());

const requestLogger = (request, response, next) => {
  console.log("Method ", request.method);
  console.log("Path", request.path);
  console.log("Body", request.body);
  console.log("---");
  next();
};
app.use(requestLogger);

app.use(express.static("dist"));
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
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  let date = new Date();
  date = date.toString();
  const message = `<p> Phonebook has info for ${persons.length} persons </p> <p>${date}</pv>`;
  response.send(message);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params["id"];

  const person = persons.find((p) => p.id === id);

  if (!person) {
    return response.status(404).end();
  }
  response.json(person);
});
app.delete("/api/persons/:id", (request, response) => {
  const id = request.params["id"];
  persons = persons.filter((p) => p.id !== id);
  response.status(204).end();
});

const checkName = (name) => {
  return persons.find((p) => p.name === name);
};

app.post("/api/persons", (request, response) => {
  const id = Math.floor(Math.random() * 100000);
  const body = request.body;

  if (body.name && body.number) {
    if (checkName(body.name)) {
      return response.status(409).json({ error: "name must me unique" });
    }

    const person = {
      name: body.name,
      number: body.number,
      id: String(id),
    };
    persons = persons.concat(person);
    return response.json(person);
  }
  return response.status(400).json({ error: "name or number is missing" });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
