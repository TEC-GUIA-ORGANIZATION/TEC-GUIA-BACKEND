const Usuario = require("../models/usuarioModel.js");
const bcrypt = require("bcryptjs")
const {createAccessToken} = require("../libs/jwt")
const jwt = require("jsonwebtoken");
const ProfesorGuia = require("../models/profesorGuiaModel.js");
const AsistenteAdministrador = require("../models/asistenteAdministradorModel.js");
require('dotenv').config();



const register = async (req, res) => {
    try {
        const { 
            correo, 
            contrasena, 
            nombre,
            primerApellido,
            segundoApellido,
            sede,
            fotografia,
            rol,
        } = req.body;
        
        const userFound = await Usuario.findOne({ correo });
        if (userFound)
            return res.status(400).json({
            message: ["The email is already in use"],
            });

         // hashing the password
        const passwordHash = await bcrypt.hash(contrasena, 10);
        // id of the rol info 
        const idInfo = '0';
        // creating the user
        const newUsuario = new Usuario({
            correo, contrasena: passwordHash, nombre, primerApellido, segundoApellido, sede, fotografia, rol, idInfo
        });

        if (rol === 'admin') {
            const idAdmin =  await createAdmin(req, res);
            newUsuario.adminInfo = idAdmin;
        } else if (rol === 'profesor Guia') {
            const idProfesorGuia = await createProfesorGuia(req, res);
            newUsuario.profesorGuiaInfo = idProfesorGuia;
        }
     
        // saving the user in the database
        const usuarioSaved = await newUsuario.save();
    
        // create access token
        const token = await createAccessToken({
            id: usuarioSaved._id,
        });

        res.json({errorJson: 'got res before expected'})

        res.cookie("token", token);
    
        //res.json({
            //id: usuarioSaved._id,
            //email: usuarioSaved.correo,
        //});

    } catch (error) {
        res.status(500).json({ message: error.message});
    }
};

//helper functions for adding the info of user being registered based on its rol 

async function createAdmin(req, res) {
    try{
        const { esPrincipal } = req.body;
        const newAdminInfo = new AsistenteAdministrador({ esPrincipal });
        const adminInfoSaved = await newAdminInfo.save();
        return adminInfoSaved._id;
    }catch (error) {
        res.status(500).json({})
    }
}

async function createProfesorGuia(req, res) {
    try {
        const { codigo, telefonoOficina, telefonoPersonal, esCoordinador, estaActivo } = req.body;
        const newProfesorGuiaInfo = new ProfesorGuia({
            codigo,
            telefonoOficina,
            telefonoPersonal,
            esCoordinador,
            estaActivo
        });
        const profesorGuiaSaved = await newProfesorGuiaInfo.save();
        return profesorGuiaSaved._id;
    }catch (error) {
        res.status(500).json({})
    }
}





const verifyToken = async (req, res) => {
    const { token } = req.cookies;
    if (!token) return res.send(false);

    jwt.verify(token, process.env.TOKEN_SECRET, async (error, user) => {
        if (error) return res.sendStatus(401);

    const userFound = await Usuario.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
        id: userFound._id,
        email: userFound.correo,
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
    
        const isMatch = await bcrypt.compare(contraseña, userFound.contrasena);
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