import app from "./app";
import { connectToDB } from "./configs/dbConfig";
import { PORT } from "./constants/env";

connectToDB(() => {
  app.listen(PORT);
  console.log("coonected to port", PORT);
});
