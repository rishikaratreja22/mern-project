import express from 'express';
import { getAllUsers, getUserById, singup, updateUser, deleteUser, login, getBookingsOfUser } from '../controllers/user-controller.js';

const userRouter = express.Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/signup", singup); 
userRouter.put("/:id", updateUser); //to update the user details by fetching the id of the user
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", login);
userRouter.get("/bookings/:id", getBookingsOfUser);

export default userRouter;     