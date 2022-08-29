const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/tasks')

const app = express()
const sequelize = new Sequelize({ 
    dialect: 'sqlite', 
    storage: './task-list.db' 
})
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

// List tasks
app.get('/tasks', async (req, res) => {
    const allTasks = await tasks.findAll()
    res.json({ action: 'Listing tasks', allTasks })
})

// Create task
app.post('/', async (req, res) => {
  const {description, done} = req.body;
  const newTasks = await tasks.create({description, done});
  res.send({newTasks})
})

// Show task
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const taskById = await tasks.findByPk(taskId)
  res.json({ description: taskById.description, id: taskById.id, done: taskById.done })
})

// Update task
app.put('/tasks/:id', async (req, res) => {
  const {id} = req.params;
  const {description, done} = req.body;
  const taskUpd = await tasks.update({description, done}, {where: {id}});

  res.json({ action: 'Updating task', taskUpd })
})

// Delete task
app.delete('/tasksd/:id', async (req, res) => {
    const {id} = req.params;
    const taskDel = await tasks.destroy({where: {id}});

  res.json('Successfully deleted!')
})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})