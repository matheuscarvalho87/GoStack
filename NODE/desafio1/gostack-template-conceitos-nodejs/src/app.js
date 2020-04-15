const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
let likes = 0;
function checkRepoExistsAddLike(request, response, next) {
  const { id } = request.params;

  if (!uuid(id)) {
    return response.status(400).json({ error: "Repositorie not found!!" });
  }

  return next();
}

app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const results = title
    ? repositories.filter((repositorie) => repositorie.title.includes(title))
    : repositories;

  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Repositorie not found!" });
  }

  const repositorie = { id, title, url, techs, likes };

  repositories[repoIndex] = repositorie;

  return response.json(repositorie);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(
    (repositorie) => repositorie.id === id
  );

  if (repoIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  repositories.splice(repoIndex, 1);

  return response.status(204).send();
});

app.post(
  "/repositories/:id/like",
  checkRepoExistsAddLike,
  (request, response) => {
    const { id } = request.params;

    const findRepo = repositories.find((r) => r.id === id);

    const repositorie = {
      id,
      title: findRepo.title,
      url: findRepo.url,
      techs: findRepo.techs,
      likes: findRepo.likes++,
    };

    repositories[findRepo] = repositorie;

    return response.json(repositorie);
  }
);

module.exports = app;
