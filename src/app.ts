import express from "express";
import handleError from "./middlewares/errorHandlingMiddleware";
import authRouter from "./routers/authRouter";
import ingredientsRouter from "./routers/ingredientsRouter";
import recipesRouter from "./routers/recipesRouter";

const app = express();
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(authRouter);
app.use("/ingredients", ingredientsRouter);
app.use("/recipes", recipesRouter);
app.use(handleError);

export default app;
