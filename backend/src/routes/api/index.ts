import express from "express";
import registerRouter from "./register";

const router = express.Router();

router.use("/", registerRouter);

export default router;
