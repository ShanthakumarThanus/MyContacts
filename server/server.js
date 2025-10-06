require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Middleware CORS
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

//Middleware pour lire le JSON
app.use(express.json());

//config swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Routes
app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);

require('./models/User');

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log('server is connected');
        const port = process.env.PORT || 4000;
        server.listen(port, () => {
            console.log('server running on ' + port);
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();

