import express  from "express"
import { verifyToken } from "../middleware/auth.js"
import postController from "../controllers/post.js"


const router = express.Router()
//Read
router.get('/',verifyToken,postController.getFeedPosts)
router.get('/:userId',verifyToken,postController.getUserPosts)

//Update
router.patch('/:id/like',verifyToken,postController.likePost)

export default router