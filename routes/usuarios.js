const express = require('express')
const {
  getUsuarios, 
  getUsuario, 
  addUsuario, 
  deleteUsuario, 
  updateUsuario
} = require('../controllers/usuarioController')

const router = express.Router()

// GET all Usuarios
router.get('/', getUsuarios)

// GET a single Usuario
router.get('/:id', getUsuario)

// POST a new Usuario
router.post('/add', addUsuario)

// DELETE a Usuario
router.delete('/delete/:id', deleteUsuario)

// UPDATE a Usuario
router.patch('/update/:id', updateUsuario)

module.exports = router