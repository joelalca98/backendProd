import { validateUser } from "./../src/middleware/user.validate";
import { Express } from "express";
import passport from "passport";
import {
  googleLoginHandler,
  testingHandler,
  testingHandler2,
} from "../src/controller/user.controller";
import { deserializeUser } from "../src/middleware/deserializeUser";
import userRouter from "./user.routes";
import reportRouter from "./report.routes"
import servicerouter from "./service.routes";

export function routes(app: Express) {


  app.get('/', passport.authenticate('google',{failureRedirect : '/failure'}), googleLoginHandler);;

  app.get('/failure', (req,  res) => res.json({ failure: "something went wrong"}));

  app.use("/api/user", userRouter);

  app.use("/api/report", reportRouter);

  app.use("/api/services", servicerouter);
  //testing purposes
  app.get("/api/testing", testingHandler);
}
