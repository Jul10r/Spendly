require('dotenv').config();
const cors = require('cors')
const express = require('express');
const { connectDB } = require('./config/db')
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes')
const helmet = require('helmet');
const { generalLimiter } = require('./middleware/rateLimiter')


const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(generalLimiter)
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/transactions', transactionRoutes);
app.use('/auth', authRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startServer();