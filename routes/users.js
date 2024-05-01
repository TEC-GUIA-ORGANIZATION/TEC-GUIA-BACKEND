const express = require('express')
const {
  getUsuarios, 
  getUsuario, 
  createUsuario, 
  deleteUsuario, 
  updateUsuario
} = require('../controllers/usuarioController')

const router = express.Router()

// GET all Usuarios
router.get('/', getUsuarios)

// GET a single Usuario
router.get('/:id', getUsuario)

// POST a new Usuario
router.post('/', createUsuario)

// DELETE a Usuario
router.delete('/:id', deleteUsuario)

// UPDATE a Usuario
router.patch('/:id', updateUsuario)

module.exports = router