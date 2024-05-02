const Comentario = require('../models/comentarioModel.js')
const mongoose = require('mongoose')

const {verifyToken} = require('./authController.js')


// get all Usuarios
const getComentarios = async (req, res) => {
    try {
        const comentarios = await Comentario.aggregate([
            {
                $match: {
                }
            },
            {
                $graphLookup: {
                    from: 'Comentarios', // the collection name
                    startWith: '$_id', // start looking up from the current document's ID
                    connectFromField: '_id', // field in the current documents to match connectToField
                    connectToField: 'respuestas', // field in the documents of the 'from' collection
                    as: 'responseHierarchy', // the field that will contain the hierarchy of responses
                    depthField: 'depth' // adds a field indicating the depth level of the document
                }
            }
        ]);
        res.json(comentarios);
    } catch (error) {
        res.status(500).send(error);
    }
};

// get a single Usuario
const a = async (req, res) => {
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
const addComentario = async (req, res) => {
  const {contenido} = req.body
  const {id} = verifyToken;


  const {nombre, primerApellido, segundoApellido} = Usuario.findById(id);

  const fechaHora = Date.now();



  try {
    const comentario = await Comentario.create({fechaHora, })
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
  getComentarios
}