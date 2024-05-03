require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const workoutRoutes = require('./routes/workouts')
const usuarioRoutes = require('./routes/usuarios.js')
const authRoutes = require('./routes/auth.js')
const actividadRoutes = require('./routes/actividad.js')


const cookieParser = require("cookie-parser")
const cors = require("cors");
const morgan = require("morgan");


// express app
const app = express()

// middleware
app.use(express.json())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());

app.use(cors({
  origin: ['http://localhost:8080', 'https://frontend-tec-guia.azurewebsites.net'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

// routes
app.use('/api/workouts', workoutRoutes)
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/actividades', actividadRoutes)



app.get('/', (req, res) => {
  res.send('Hello, World!');
});


// connect to db
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('connected to database')
    // listen to port
    app.listen(process.env.PORT, () => {
      console.log('listening for requests on port', process.env.PORT)
    })
  })
  .catch((err) => {
    console.log(err)
  }) 
