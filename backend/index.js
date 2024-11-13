
const express = require('express');
const app = express();
const port = 3000;


const fs = require('fs');
const path = './tasks.json';


app.use(express.json());

app.get('/tasks', (req, res) => {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post('/tasks', (req, res) => {
    const newTask = req.body;
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;
        const tasks = JSON.parse(data);
        tasks.push(newTask);
        fs.writeFile(path, JSON.stringify(tasks, null, 2), err => {
            if (err) throw err;
            res.status(201).json(newTask);
        });
    });
});

app.put('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const updatedTask = req.body;
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;
        let tasks = JSON.parse(data);
        tasks = tasks.map(task => (task.id === taskId ? updatedTask : task));
        fs.writeFile(path, JSON.stringify(tasks, null, 2), err => {
            if (err) throw err;
            res.json(updatedTask);
        });
    });
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) throw err;
        const tasks = JSON.parse(data);
        const filteredTasks = tasks.filter(task => task.id !== taskId);
        fs.writeFile(path, JSON.stringify(filteredTasks, null, 2), err => {
            if (err) throw err;
            res.status(204).end();
        });
    });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});