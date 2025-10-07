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
  origin: ["http://localhost:3000", "http://127.0.0.1:3000", "https://mycontacts-frontend-thanus.netlify.app"],
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Middleware pour lire le JSON
app.use(express.json());

// Config Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes principales
app.use('/auth', authRoutes);
app.use('/contacts', contactRoutes);

// Import du modèle User
require('./models/User');

// Définition de la bonne URI MongoDB selon l’environnement
const dbUri =
  process.env.NODE_ENV === "test"
    ? process.env.MONGO_CONNECTION_STRING_TEST
    : process.env.MONGO_CONNECTION_STRING;

async function start() {
  try {
    await mongoose.connect(dbUri);
    console.log(
      `Connected to MongoDB (${process.env.NODE_ENV === "test" ? "TEST" : "PROD"})`
    );

    if (process.env.NODE_ENV !== "test") {
      const port = process.env.PORT || 4000;
      server.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    }
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  start();
}

// Export de l’app pour Jest / Supertest
module.exports = app;