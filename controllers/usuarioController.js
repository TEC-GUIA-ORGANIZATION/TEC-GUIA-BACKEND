const Usuario = require('../models/usuarioModel.js')
const mongoose = require('mongoose')
const usuarioDao = require('../dao/userDao.ts')

// get all Usuarios
const geUsuarios = async (req, res) => {
  const usuarios = await Usuario.find({}).sort({createdAt: -1})
  res.status(200).json(usuarios)
} 

// get a single Usuario
const getUsuario = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({error: 'No existe el usuario'})
  }
  const usuario = await usuario.findById(id)
  if (!usuario) {
    return res.status(404).json({error: 'No existe el usuario'})
  }
  res.status(200).json(usuario)
}




// create a new Usuario
const addUsuario = async (req, res) => {
  const {correo, contraseña, nombre, primerApellido, segundoApellido, sede, fotografia, rol} = req.body
  let emptyFields = []
  // add to the database
  try {
    const usuario = await Usuario.create({correo, contraseña, nombre, primerApellido, segundoApellido, sede, fotografia, rol})
    res.status(200).json(usuario)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// delete a Usuario
const deleteUsuario = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No existe el usuario'})
  }
  const usuario = await Usuario.findOneAndDelete({_id: id})
  if(!usuario) {
    return res.status(400).json({error: 'No existe el usuario'})
  }

  res.status(200).json(usuario)
}

// update a Usuario
const updateUsuario = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({error: 'No existe el usuario'})
  }

  const usuario = await Usuario.findOneAndUpdate({_id: id}, {
    ...req.body
  })

  if (!usuario) {
    return res.status(400).json({error: 'No existe le usuario'})
  }

  res.status(200).json(usuario)
}






module.exports = {
  getUsuarios,
  getUsuario,
  createUsuario,
  deleteUsuario,
  updateUsuario
}