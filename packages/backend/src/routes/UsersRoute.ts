import { Router } from "express";
import {
    createUser,
    deleteUserById,
    getAllUsers,
    getUserById,
    updateUserById,
} from "../controllers/UsersController";

// Define a new router that basically wraps multiple endpoint into a single object.
const usersRoute = Router();

usersRoute.route("/").get(getAllUsers);
usersRoute.route("/").post(createUser);
usersRoute.route("/:id").get(getUserById);
usersRoute.route("/:id").delete(deleteUserById);
usersRoute.route("/:id").put(updateUserById);

export { usersRoute };
