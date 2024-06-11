import express from "express";
import {User} from "../models/model_user";
import {StatusCodes} from "http-status-codes";
import {Unit} from "../database/unit";
import {UserRepository} from "../repositories/repository_user";
import {userDBInsert} from "../models/model_db";

export const userRouter = express.Router();

userRouter.post('/', async (req, res) => {
    const unit: Unit = await Unit.create(false);

    try {
        const userRepo = new UserRepository(unit);
        let success: boolean = false;
        const user: userDBInsert = {
            username: req.body.username,
            password: req.body.password
        }

        success = await userRepo.insertUser(user);

        if(success) {
            await unit.complete(true);
            res.status(StatusCodes.CREATED).json(user);
        } else {
            await unit.complete(false);
            res.status(StatusCodes.BAD_REQUEST).send();
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete(false);
    }
})
