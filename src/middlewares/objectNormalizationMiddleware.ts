import { convertToNormalObject } from "../transformers/objectTransformers";
import { Middleware } from "../utils/commonTypes";

const objectNormalizationMiddlware: Middleware = async (req, _, next) => {
  req.body = convertToNormalObject(req.body);
  return next();
};

export default objectNormalizationMiddlware;
