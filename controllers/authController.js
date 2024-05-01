const Usuario = require("../models/usuarioModelo");
const bcrypt = require("bcryptjs")
const {createAccessToken} = require("../libs/jwt")
const jwt = require("jsonwebtoken");
require('dotenv').config();

const register = async (req, res) => {
    try {
        const { correo, contrsena, nombre, primerApillido, segundoApellido, fotografia, rol} = req.body;
    
        const userFound = await Usuario.findOne({ correo });
    
        if (userFound)
            return res.status(400).json({
            message: ["The email is already in use"],
            });
    
        // hashing the password
        const passwordHash = await bcrypt.hash(password, 10);
    
        // creating the user
        const newUsuario = new Usuario({
            correo, contrsena: passwordHash, nombre, primerApillido, segundoApellido, fotografia, rol
        });
    
        // saving the user in the database
        const usuarioSaved = await newUsuario.save();
    
        // create access token
        const token = await createAccessToken({
            id: usuarioSaved._id,
        });
    
        res.cookie("token", token);
    
        res.json({
            id: usuarioSaved._id,
            email: usuarioSaved.email,

        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.send(false);

    jwt.verify(token, process.env.TOKEN_SECRET, async (error, user) => {
        if (error) return res.sendStatus(401);

    const userFound = await Usuario.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
        id: userFound._id,
        email: userFound.crreo,
        rol: userFound.rol,
        nombre: userFound.nombre,
        primerApellido: userFound.primerApellido,
        segundoApellido: userFound.segundoApellido,
    });
    });
};

const login = async (req,res)=>{
    try {
        const { correo, contraseña} = req.body;
        const userFound = await Usuario.findOne({ correo });
    
        if (!userFound)
            return res.status(400).json({
            message: ["The email does not exist"],
            });
    
        const isMatch = await bcrypt.compare(contraseña, userFound.contraseña);
        if (!isMatch) {
            return res.status(400).json({
            message: ["The password is incorrect"],
            });
        }
    
        const token = await createAccessToken({
            id: userFound._id,
        });
    
        res.cookie("token", token, {
            httpOnly: false,
            secure: true,
            sameSite: "none",
        });
        
    
        res.json({
            id: userFound._id,
            email: userFound.correo,
            rol: userFound.rol,
            nombre: userFound.nombre,
            primerApellido: userFound.primerApellido,
            segundoApellido: userFound.segundoApellido
        });
        } catch (error) {
        return res.status(500).json({ message: error.message });
        }
};

const logout = (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: true,
        expires: new Date(0),
    });
    return res.sendStatus(200);
}

module.exports={
    register,
    login,
    logout,
    verifyToken
};