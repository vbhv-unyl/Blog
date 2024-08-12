const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const { ObjectId } = require('mongodb');

const router = Router();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.resolve("./public/images"));
    },
    filename: function(req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
    const blogs = await Blog.find({});
    return res.json(blogs);
});

router.get("/:imgname", (req, res) => {
    const imageName = req.params.imgname;
    const imagePath = path.join(__dirname, 'public', 'images', imageName);

    console.log(imagePath);

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(err.status).end();
        } else {
            console.log('Sent:', imageName);
        }
    });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body;
    const id = new ObjectId('66a5eb905c62bf5989cbddd2');
    await Blog.create({
        body, title, 
        createdBy: id,
        coverImageURL: `/${req.file.filename}`,
    });
    return res.json({ msg:"Success" });
});

router.post("/comment", async(req, res) => {

});

module.exports = router;