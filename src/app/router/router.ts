import express from "express";
import userAuthRoutee from "./userAuth";
import {
  isVerifiedUser,
  verifyAccessToken,
} from "../http/middlewares/user-middleware";
import projectRoutes from "./project";
import categoryRoutes from "./category";
import proposalRoutes from "./proposal"

const router = express.Router();

router.use("/user", userAuthRoutee);
router.use("/category", categoryRoutes);

router.use(
  "/project",
  verifyAccessToken,
  isVerifiedUser,
  // authorize(ROLES.ADMIN, ROLES.OWNER),
  projectRoutes
);

router.use("/proposal", verifyAccessToken, isVerifiedUser, proposalRoutes);

export default router;
