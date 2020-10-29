const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


function validateRepositoryId(request,response,next){    
  const { id } = request.params;
  
  if(!isUuid(id)){
    return response.status(400).json({
        error: 'Invalid repository id.'
    })
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  if(repositoryIndex < 0 ){
    return response
                .status(400)
                .json({ error: 'repository not found'})
  }

  return next();
}

function validateLike(request,response,next){
  const { likes } = request.body;

  if(likes > 0){
    return response.status(400).json({
        error: 'likes init in zero.'
    })
  }

  return next();
}

app.use("/repositories/:id",validateRepositoryId);

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", validateLike, (request, response) => {

  const { title, url, techs } = request.body;
  const likes = 0;

  const repository = {
    id:uuid(),
    title,
    url,
    techs,
    likes
  };

  repositories.push(repository);
  return response.json(repository);

});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id)

  const repository = {
    id,
    title,
    url,
    techs
  }
  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id)
  repositories.splice(repositoryIndex,1)
  return response.status(204).send();
});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex(repository => repository.id == id)
  repositories[repositoryIndex].likes++;
  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
