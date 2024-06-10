import express from "express";
import {User} from "../models/model_user";
import {StatusCodes} from "http-status-codes";

export const userRouter = express.Router();

userRouter.get('/')
