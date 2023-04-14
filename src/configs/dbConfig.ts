import mysql from "mysql2";
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "../constants/env";

export const dbConnection = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

export const connectToDB = (onSuccess: () => void) => {
  dbConnection.connect((error) => {
    if (error) console.log("db error", error);
    else {
      console.log("db connected");
      onSuccess();
    }
  });
};
