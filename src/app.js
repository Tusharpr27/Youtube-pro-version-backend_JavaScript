import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({
    extended: true, limit:
        "16kb"
}));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import

import userRouter from './routes/user.routes.js';

// Routes declaration
app.use('/api/v1/users', userRouter);

// what above line does is that it tells the app to use the userRouter for any routes that start with /user. So, for example, if you have a route defined in userRouter like router.post("/register"), it will be accessible at /user/register in the main app.
//(https:localHost:8000/user/register) : both are correct but the first one is more specific and it tells us that the route is part of the API version 1. So, it's a good practice to include the version number in the route to avoid any confusion in the future when you might have multiple versions of your API.
//(https:localHost:8000/api/v1/user/login)

export { app };
