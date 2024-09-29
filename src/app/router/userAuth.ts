import express from "express";

const router = express.Router();

router.post("/get-otp", (_req, res) => {
  res.status(200).send({
    message: "در حال توسعه ",
  });
});

export default router;
