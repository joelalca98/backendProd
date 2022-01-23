import { Router } from "express";
import { createReport, getGlobalUser, getReports } from "../src/controller/user.controller";

const router = Router();  

router.get("/global", getGlobalUser); 

router.get("/", getReports);

router.post("/", createReport);

export default router;