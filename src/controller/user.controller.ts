import { LeanDocument } from "mongoose";
import { ISession } from "./../models/session.model";
import {
  createUser,
  deleteUser,
  findUserById,
  findUserByEmail,
  getUsers,
  updateUser,
  validatePassword,
  getAllReports,
  createNewReport,
  getGlobal,
} from "../services/user.service";
import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { get, omit } from "lodash";
import { createAccesToken, createRefreshToken } from "../jwtUtils/jwtWrapper";
import { createSession, invalidateSession} from "../services/session.service";
import log from "../logging/logger";
import { IReport } from "../models/report.model";
import { IGlobal } from "../models/global.model";

export async function getAllUsersHandler(req: Request, res: Response) {
  const users: any = await getUsers();
  const response = users.map((user: any) => omit(user.toJSON(), "password"));
  res.status(200).json(response);
}

export async function getUserByIdHandler(req: Request, res: Response) {
  const id = req.params.id;
  const user = await findUserById(id);

  if (user) {
    res.status(200).json(omit(user.toJSON(), "password"));
  } else {
    res.status(404).send({ message: "User not found" });
  }
}

export async function deleteUserByIdHandler(req: Request, res: Response) {
  const id = req.params.id;
  const user = await deleteUser(id);

  if (user) {
    res.status(200).json(omit(user.toJSON(), "password"));
  } else {
    res.status(404).send({ message: "User not found" });
  }
}

export async function updateUserHandler(req: Request, res: Response) {
  const id = req.params.id;
  const user = req.body as IUser;
  const updated: any = await updateUser(id, user);
  if (updated !== undefined) {
    res.status(200).json(omit(updated.toJSON(), "password"));
  } else {
    res.status(404).send({ message: "User not found" });
  }
}

export async function createUserHandler(req: Request, res: Response) {
  const user = req.body as IUser;
  const created = await createUser(user);
  if (created !== undefined) {
    res.status(201).json(omit(created.toJSON(), "password"));
  } else {
    res.status(405).send({ message: "User exists" });
  }
}

export async function loginHandler(req: Request, res: Response) {
  const { email, password } = req.body;
  const isValid = await validatePassword(email, password);
  if (isValid) {
    //find user and create session
    const user: any = await findUserByEmail(email);
    log.debug(user);
    const session: any = await createSession(user._id);

    //create both access and refresh token
    const accessToken = await createAccesToken(
      user as IUser,
      session as ISession
    );
    const refreshToken = createRefreshToken(session as ISession);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 300000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 600000,
    });

    //respond with user and tokens
    res.status(200).send({
      message: "Logged in correctly",
       ...user
    });
  } else {
    res.status(403).send({ message: "Error user or password missmatch" });
  }
}

export async function googleLoginHandler(req: Request, res: Response){
  if(!req.user) return { message: 'this is the redirect url '}; 

  //@ts-ignore
  const email = get(req.user,'emails[0].value'); 
  
  const user: any = await findUserByEmail(email);
    log.debug(user);
    const session: any = await createSession(user._id);

    //create both access and refresh token
    const accessToken = await createAccesToken(
      user as IUser,
      session as ISession
    );
    const refreshToken = createRefreshToken(session as ISession);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 300000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 600000,
    });

    //respond with user and tokens
    res.status(200).send({
      message: "Logged in correctly",
       ...user
    });
  

}




export async function logOutHandler(req: Request, res: Response){
  //@ts-ignore
  const invalidated : any = await invalidateSession(req.user.session); 
  res.cookie("accessToken", '', {
    httpOnly: true,
    maxAge: 0,
  });

  res.cookie("refreshToken", '', {
    httpOnly: true,
    maxAge: 0,
  });

  res.status(200).send({ message: "Logged out correctly", session: invalidated._id}); 

}


export async function testingHandler(req: Request, res: Response) {
 res.json({ message : "it works"}).status(200); 
}
export async function testingHandler2(req: Request, res: Response) {
  //@ts-ignore
  const user = req.user;

  res.json({ ...user, lavidaesdura: true }).status(200);
}

export async function createReport(req: Request, res: Response) {
  const report = req.body as IReport
  const reportCreated = await createNewReport(report);
  if (reportCreated != undefined) {
    res.status(200).json(reportCreated);
    return 
  } 
  res.status(405).send({message: "Te has creado un report"});

}

export async function getReports(req: Request, res: Response) {
  const reports: any = await getAllReports();
  res.status(200).json(reports);
  
  }

  export async function getGlobalUser(req: Request, res: Response) { 
 
    const global: IGlobal = {} as IGlobal
    global.global = await getGlobal();
    res.status(200).json(global); 
  }
