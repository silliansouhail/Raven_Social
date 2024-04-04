import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connection from "./helper/dbConnect.js";

import authController from "./controllers/auth.js";
import authRoutes from "./routes/router.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/post.js"
import { verifyToken } from "./middleware/auth.js";
import postController from "./controllers/post.js";



/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth/register",upload.single("picture"),authController.register)
app.post("/post",verifyToken,upload.single("picture"),postController.createPost)

/* ROUTES */
app.use('/auth',authRoutes)
app.use('/users',userRoutes)
app.use('/posts',postRoutes)

/* MONGOOSE SETUP */
connection()
const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Example app listening on port ${port}!`))