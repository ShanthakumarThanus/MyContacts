require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const authRoutes = require('./routes/authRoutes');

//config swagger
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);

require('./models/User');

async function start() {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_STRING);
        console.log('server is connected');
        const port = process.env.PORT || 3000;
        server.listen(port, () => {
            console.log('server running on ' + port);
        })
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

start();

