//require("dotenv").config();
import "dotenv/config";
import * as yup from "yup";

const schema = yup.object().shape({
  port: yup.number().integer().positive().min(80).max(65535).required(),
  db: yup.object().shape({
    client: yup.string().oneOf(["pg", "mysql2"]),
  }),
});

const data = {
  isDev: process.env.NODE_ENV === "developpement",
  port: process.env.PORT,
  db: {
    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
    },
    migrations: {
      stub: "./src/db/migration.stub",
    },
  },
  security: {
    password: {
      pepper: process.env.SECURITY_PASSWORD_PEPPER,
      iteration: 100000,
      keylen: 128,
      digest: "sha512",
    },
    session: {
      secret: process.env.SECURITY_SESSION_SECRET,
      expiresIn: "2 days",
    },
  },
};

const config = schema.validateSync(data);

export default config;
