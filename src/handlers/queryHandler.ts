import { dbConnection } from "../configs/dbConfig";
import { HttpError } from "../utils/commonTypes";

export default function handleQuery(query: string, values: any) {
  return new Promise((resolve, reject) => {
    dbConnection.query(query, values, (error, result, _) => {
      if (error) {
        return reject(new HttpError(error.message, 400));
      } else return resolve(result);
    });
    dbConnection.end();
  });
}
