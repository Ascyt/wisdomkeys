import express from "express";
import {userDBInsert} from "../models/model_db";
import {UserRepository} from "../repositories/repository_user";
import {Unit} from "../database/unit";
import {StatusCodes} from "http-status-codes";
import bcrypt from "bcrypt";

export const authRouter = express.Router();

authRouter.post("/login", async (req, res) => {
    const unit: Unit = await Unit.create(false);

    try {
        const userRepo = new UserRepository(unit);
        const loginUser: userDBInsert = req.body;

        const userList = await userRepo.getAllUsers();
        if(userList !== null) {
            const user = userList.find((u) => u.username === loginUser.username);
            if(user === undefined) {
                await unit.complete(false);
                res.status(StatusCodes.UNAUTHORIZED).json("User does not exist");

                return;
            }

            if(!bcrypt.compareSync(loginUser.password, user.password)) {
                await unit.complete(false);
                res.status(StatusCodes.UNAUTHORIZED).json("Wrong password");

                return;
            }

            await unit.complete(true);
            res.status(StatusCodes.OK).json(user);
        } else {
            await unit.complete(false);
            res.status(StatusCodes.NOT_FOUND).json("No users in database");
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete();
    }
})