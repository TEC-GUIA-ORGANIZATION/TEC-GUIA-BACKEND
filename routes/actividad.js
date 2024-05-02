const express = require("express");
const router = express.Router();
const {
    getComentarios
} = require("../controllers/comentarioController.js")


router.get('/:i/comentarios', getComentarios)

module.exports = router;