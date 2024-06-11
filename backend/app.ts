import express from "express";
import cors from "cors";
import {userRouter} from "./routers/router_user";
import {collectionRouter} from "./routers/router_collection";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

app.use("/api/users", userRouter);
app.use("/api/collections", collectionRouter);

app.listen(3000, async () => {
    console.log("Server listening on port 3000");
})