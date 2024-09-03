const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");

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

app.get("/api/persons", (request, response) => {
  Person.find({}).then((resp) => {
    response.json(resp);
  });
});

app.get("/info", (request, response, next) => {
  let date = new Date();
  date = date.toString();

  Person.find({})
    .then((persons) =>
      response.send(
        `<p> Phonebook has info for ${persons.length} persons </p> <p>${date}</p>`
      )
    )
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params["id"])
    .then((deleted) => response.status(204).end())
    .catch((error) => {
      next(error);
    });
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  if (body.name && body.number) {
    const person = new Person({
      name: body.name,
      number: body.number,
    });
    person
      .save()
      .then((newPerson) => {
        response.json(newPerson);
      })
      .catch((error) => next(error));
  } else
    return response.status(400).json({ error: "name or number is missing" });
});

app.put("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndUpdate(
    request.params["id"],
    {
      name: request.body.name,
      number: request.body.number,
    },
    { new: true }
  )
    .then((updatedNumber) => response.json(updatedNumber))
    .catch((error) => {
      next(error);
    });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.use((err, req, res, next) => {
  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformated id" });
  }
  next(err);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
