import { Router } from 'express'; 
import { createReport, createUserHandler, deleteUserByIdHandler, getAllUsersHandler, getGlobalUser, getReports, getUserByIdHandler, googleLoginHandler, loginHandler, logOutHandler, updateUserHandler } from '../src/controller/user.controller';
import { requeriesUser } from '../src/middleware/requiresUser';
import { validateUser } from '../src/middleware/user.validate';
import { userSchema } from '../src/schemas/user.schema';
import passport from 'passport';


const router = Router();  


router.get('/auth',passport.authenticate('google', { scope: ['profile', 'email'] }), googleLoginHandler); 
//Get all users
router.get("/", getAllUsersHandler);

//Create a user
router.post("/", validateUser(userSchema),createUserHandler);

//login user
router.post("/login",loginHandler); 
  
//Get user by Id
router.get("/:id", getUserByIdHandler);

//Operations requiring user
router.use(requeriesUser); 

//Logout User
router.delete("/logout",logOutHandler);

//Update user by Id
router.put("/:id", validateUser(userSchema),updateUserHandler);

//Delete user by Id
router.delete("/:id", deleteUserByIdHandler);

export default router; 