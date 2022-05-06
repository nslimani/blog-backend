import * as yup from "yup";

const checkQuery = (schema) => (req, res, next) => {
  try {
    yup.object().shape(schema).validateSync(req.query);
  } catch (err) {
    res.status(421).send({ error: "invalid query params" });
    return;
  }
  next();
};

export default checkQuery;
