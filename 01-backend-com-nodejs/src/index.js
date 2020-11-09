const express = require('express');
const { v4, uuid, isUuid } = require('uuidv4'); //criar um universal unic id

const app = express();

// adicionar algum tipo de funcao que todas as rotas precisam passar por ela. Precisa vir antes das rotas. Se não fizer isso, o express não reconhece por padrão o json que é enviado na request
app.use(express.json());

// aplicação já está criada, precisa agora ouvir uma porta para que o navegador consiga acessar a aplicação
// da pra escolher qualquer porta acima de 80 (com exceção de algumas que estão reservadas)
// porta comum para back: localhost:3333


const projects = [];

// Middlewares

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.log(logLabel);

  // pra ir pro próximo middleware
  return next();
}

function validateProjectId (request, response, next) {
  const { id } = request.params;
  console.log(isUuid(id));
  if (!isUuid(id)) {
    return response.status(400).json({ "error": "Id is not valid" });
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId);

// Rotas

app.get('/projects', (request, response) => {
  const { title, owner } = request.query;

  const results = title
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return response.json(results);
});

app.post('/projects', (request, response) => {

  const { title, owner } = request.body;

  const project = { id: uuid(), title, owner };

  projects.push(project);

  return response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) return response.status(400).json({ "error": "Project not found" });

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project);
});

app.delete('/projects/:id', (request, response) => {

  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) return response.status(400).json({ "error": "Project not found" });

  projects.splice(projectIndex, 1);

  return response.status(200).send(`ID ${id} deleted successfully`);
});

//ouvir a porta
app.listen(3333, () => {
  console.log('🚀 Backend started!');
}); // o callback é chamado automaticamente sempre que o servidor rodar

