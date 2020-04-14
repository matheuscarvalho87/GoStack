const express = require("express");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
/**
 *Install uuidv4 - Function create an unic universal id
 */
/**
 * Params Types
 *
 * Query params: Filtros e paginação
 * Route params: Identificar recursos (Atualizar/deletar)
 * Request Body: Conteúdo
 */
/**
 * Middleware:
 *
 * Interceptador de requisições que interrompe totalmente a requisição ou alterar dados da requisição.
 * Stop the request that stops totally the request or change data request.
 *
 *
 * console.time --- console.timeEnd == if i want execute the first method,and inside the middlware after next have another function,
 *  but before the next, jump for the second method, and when finish the second comeback to middleware and play the function
 * after the next();
 *
 *
 */

const projects = [];

app.use(logRequests);
app.use("/projects/:id", validateProjectId);

// This is a middleware that shows the request function made by the user
function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  //If don't use next, ll'not pass for the next request
  next();

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next) {
  const { id } = request.params;

  if (!uuid(id)) {
    return response.status(400).json({ error: "Invalid project ID." });
  }

  return next();
}

app.get("/projects", (request, response) => {
  const { title } = request.query;

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;

  return response.json(results);
});

app.post("/projects", (request, response) => {
  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});
//Thats a update data function
app.put("/projects/:id", (request, response) => {
  const { id } = request.params;

  const { title, owner } = request.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  const project = {
    id,
    title,
    owner,
  };

  //replace the array value with the wanted value
  projects[projectIndex] = project;

  return response.json(project);
});

app.delete("/projects/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project not found" });
  }

  projects.splice(projectIndex, 1);
  // Status 204: No Content
  return response.status(204).send();
});

app.listen(3333, () => {
  console.log("😎Backend started");
});
