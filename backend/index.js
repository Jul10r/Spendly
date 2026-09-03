require('dotenv').config();
const cors = require('cors')
const express = require('express');
const { connectDB } = require('./config/db')
const transactionRoutes = require('./routes/transactionRoutes');
const authRoutes = require('./routes/authRoutes')


const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/transactions', transactionRoutes);
app.use('/auth', authRoutes)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});