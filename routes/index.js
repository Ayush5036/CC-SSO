var router = require('express').Router();
const { requiresAuth } = require('express-openid-connect'); 
const mongoose = require('mongoose');

// Define schema for todo items
const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});


const Todo = mongoose.model('Todo', todoSchema);

router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Auth0 Webapp sample Nodejs',
    isAuthenticated: req.oidc.isAuthenticated()
  });
});

// router.get('/profile', requiresAuth(), function (req, res, next) {
//   res.render('profile', {
//     userProfile: JSON.stringify(req.oidc.user, null, 2),
//     title: 'Profile page'
//   });
// });



router.get('/profile', requiresAuth(), async function (req, res, next) {
  try {
    // Fetch all todo items from the database
    const todos = await Todo.find();
    res.render('profile', {
      todos: todos,
      title: 'To-Do List'
    });
  } catch (error) {
    // Handle error
    next(error);
  }
});


router.post('/profile', requiresAuth(), async function (req, res, next) {
  try {

    if (!req.body.title) {
      return res.status(400).send('Title is required');
    }
    // Create a new todo item based on the request body
    const newTodo = new Todo({
      title: req.body.title
    });
    // Save the todo item to the database
    await newTodo.save();
    res.redirect('/profile'); // Redirect back to the todo list
  } catch (error) {
    // Handle error
    next(error);
  }
});


router.post('/todo/:id/complete', requiresAuth(), async function (req, res, next) {
  try {
    const todoId = req.params.id;
    // Find the todo item by ID
    const todo = await Todo.findById(todoId);
    if (!todo) {
      return res.status(404).send('Todo item not found');
    }
    // Update the todo item to mark it as completed
    todo.completed = true;
    await todo.save();
    res.redirect('/profile'); // Redirect back to the todo list
  } catch (error) {
    // Handle error
    next(error);
  }
});


router.post('/todo/:id/delete', requiresAuth(), async function (req, res, next) {
  try {
    const todoId = req.params.id;
    // Find the todo item by ID and delete it
    await Todo.findByIdAndDelete(todoId);
    res.redirect('/profile'); // Redirect back to the todo list
  } catch (error) {
    // Handle error
    next(error);
  }
});

module.exports = router;
