const express = require("express");

const server = express();
server.use(express.json());
server.listen(3000);

const projects = []

var requestCount = 0;

server.use(countRequests)

function countRequests(req, res, next) {    
    requestCount += 1;
    console.log(`Request Number: ${requestCount}`);
    next();
}

function projectIdExist(req, res, next) {
    const { id } = req.params;

    const project = projects.find(p => p.id == id);

    if (!project) {
         return res.status(400).json({ error: 'Projeto não existe!' });
    }
    next();
}

server.get('/projects', (req, res) => {
    return res.json(projects);    
})

server.put('/projects/:id', projectIdExist, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const project = projects.find(p => p.id == id);
    project.title = title;
    return res.json(project);    
})

server.delete('/projects/:id', projectIdExist, (req, res) => {
    const { id } = req.params;
    const index = projects.findIndex(p => p.id == id);
    projects.slice(index);
    return res.send();
})

server.post('/projects', (req, res) => {
    const { id, title } =  req.body;
    const project = {
        id,
        title,
        tasks:[]
    }
    projects.push(project);
    return res.json(projects);    
})

server.post('/projects/:id/task', projectIdExist, (req, res) => {
    const { task } =  req.body;
    const { id } = req.params;   
    const project = projects.find(p => p.id == id);
    project.tasks.push(task);    
    return res.json(projects);    
})


