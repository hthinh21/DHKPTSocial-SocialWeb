import express from "express";
import { loginAdmin } from "../controllers/adminControllers.js";
import {
  updateUserStatus,
  getCommentReports,
  updateCommentStatus,
  getPostReports,
  updatePostStatus,
} from "../controllers/adminControllers.js";
const router = express.Router();

router.post("/login", loginAdmin);

router.put("/status/:id", updateUserStatus);

router.get("/comments-reports", getCommentReports);
router.put("/comments-reports/:id", updateCommentStatus);

router.get("/posts-reports", getPostReports);
router.put("/posts-reports/:id", updatePostStatus);

export default router;
