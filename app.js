require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const { createHmac, randomBytes } = require('node:crypto');

const app = express();

const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');
const User = require('./models/user');

const DATABASE_URL = process.env.DATABASE_URL
const PORT = process.env.PORT || 8000;

mongoose.connect(DATABASE_URL)
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log(err))

app.use(cors());
app.use(express.json());

app.use("/blog", express.static(path.join(__dirname, 'public', 'images')), blogRouter);
app.use("/register", userRouter);

app.post("/validate", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        email: email
    });

    let msg = 'Authorized Access';
    if (user) {
        const salt = user.salt;
        const hashedPassword = user.password;

        const userProvidedHash = createHmac("sha256", salt)
            .update(password)
            .digest("hex");

        if (hashedPassword !== userProvidedHash)
            msg = 'Unauthorized Access';
    }
    else {
        msg = 'Unauthorized Access';
    }

    return res.json({ msg: msg });
});

app.listen(PORT, () => {
    console.log(`Server is up on PORT : ${PORT}`)
})