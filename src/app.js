const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID' });
  }
  return next();
}

app.get("/repositories", (request, response) => {
  
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

   const repo = {
     id: uuid(), 
     title, 
     url, 
     techs,
     likes: 0 
    };

   repositories.push(repo);

   return response.json(repo);
});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepo = repositories.findIndex(r => r.id === id);

  if(findRepo === -1) {
    return response.status(400).json({ error: 'Repository does not exists' });
  }

  const repo = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepo].likes,
  }

  repositories[findRepo] = repo;

  return response.json(repo);

});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(r => r.id === id);

  if(repoIndex >= 0) {
    repositories.splice(repoIndex, 1);
  }
  else {
    return response.status(400).json({ error: 'Repository does not exists' })
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;

  const findRepo = repositories.findIndex(r => r.id === id);

  if(findRepo === -1) {
    return response.status(400).json({ error: 'Repository does not exists' });
  }
 
  repositories[findRepo].likes += 1;

  return response.json(repositories[findRepo]);

});

module.exports = app;
