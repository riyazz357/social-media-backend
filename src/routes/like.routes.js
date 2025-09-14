import { Router } from "express";
import { toggleLike } from "../controllers/likes.controller";
import { verifyJWT } from "../middleware/auth.middleare";

const router=Router();

//all like routes are protected. only login user can like
router.use(verifyJWT);
router.route('/toggle').post(toggleLike);
export default router