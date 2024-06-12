import express from "express";
import {User} from "../models/model_user";
import {StatusCodes} from "http-status-codes";
import {Unit} from "../database/unit";
import {UserRepository} from "../repositories/repository_user";
import {userDBInsert} from "../models/model_db";
import bcrypt from "bcrypt";

const saltRounds = 8;

export const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
    const unit: Unit = await Unit.create(true);

    try {
        const userRepo: UserRepository = new UserRepository(unit);

        const users: User[] | null = await userRepo.getAllUsers();

        if(users !== null) {
            res.status(StatusCodes.OK).json(users);
        }
        res.status(StatusCodes.NOT_FOUND).send();

    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete();
    }
})

userRouter.get('/:id', async (req, res) => {
    const unit: Unit = await Unit.create(true);

    try {
        const userRepo: UserRepository = new UserRepository(unit);
        const idInput: number = Number(req.params.id);

        if(Number(idInput)) {
            const user: User | null = await userRepo.getUserById(idInput);
            if(user !== null) {
                res.status(StatusCodes.OK).json(user);
            }
            res.status(StatusCodes.NOT_FOUND).send();
        } else {
            res.status(StatusCodes.BAD_REQUEST);
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete();
    }
})

userRouter.post('/register', async (req, res) => {
    const unit: Unit = await Unit.create(false);

    try {
        const userRepo = new UserRepository(unit);
        let success: boolean = false;
        const user: userDBInsert = {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, saltRounds)
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

userRouter.delete('/:id', async (req, res) => {
    const unit = await Unit.create(false);

    try {
        const userRepo = new UserRepository(unit);
        const idInput = Number(req.params.id);
        let success: boolean = false;

        if(Number(idInput)) {
            const user: User | null = await userRepo.getUserById(idInput);
            if(user !== null) {
                success = await userRepo.deleteUser(user);
            }

            if(success) {
                await unit.complete(true);
                res.status(StatusCodes.OK).send();
            } else {
                await unit.complete(false);
                res.status(StatusCodes.NOT_FOUND).send();
            }
        } else {
            await unit.complete(false);
            res.status(StatusCodes.BAD_REQUEST);
        }
    } catch (e) {
        console.log(e);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    } finally {
        await unit.complete(false);
    }
})