import * as yup from "yup";

const checkPayload = (schema) => (req, res, next) => {
  try {
    yup.object().shape(schema).validateSync(req.body);
  } catch (err) {
    res.status(421).send({ error: "invalid payload" });
    return;
  }
  next();
};

export default checkPayload;
