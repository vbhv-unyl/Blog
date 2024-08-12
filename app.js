require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const router = require('./routes/blog');
const Blog = require('./models/blog');

const DATABASE_URL = process.env.DATABASE_URL
const PORT = process.env.PORT || 8000;

mongoose.connect(DATABASE_URL)
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.log(err))

app.use(cors());
app.use(express.json());
app.use("/blog", express.static(path.join(__dirname, 'public', 'images')), router);

app.listen(PORT, () => {
    console.log(`Server is up on PORT : ${PORT}`)
})