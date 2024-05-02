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

const allowedOrigins = ["http://localhost:4200", "https://frontend-tec-guia.azurewebsites.net/"];

app.use(cors({
  origin: function (origin, callback) {
    // Check if the origin is in the list of allowed origins or if it is undefined (allowing requests from non-browser clients)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
