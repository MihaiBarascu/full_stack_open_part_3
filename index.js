const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

console.log(Person);

const corsOptions = {
  origin: "https://phonebook-f.fly.dev/",
};

app.use(cors());

app.use(express.json());

morgan.token("jsonData", (req) => JSON.stringify(req.body));
app.use(
  morgan((tokens, req, res) =>
    [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.jsonData(req),
    ].join(" ")
  )
);

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
  Person.find({}).then((resp) => {
    response.json(resp);
  });
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

    const person = new Person({
      name: body.name,
      number: body.number,
    });
    person.save().then((newPrerson) => {
      response.json(newPrerson);
    });
  } else
    return response.status(400).json({ error: "name or number is missing" });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
