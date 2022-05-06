import express from "express";
import knex from "knex";
import { Model } from "objection";
import dotenv from "dotenv";
import pino from "pino";
import cors from "cors";
import faker from "Faker";
import config from "./src/config.js";
import postsRoute from "./src/routes/posts.js";
import usersRoute from "./src/routes/users.js";
import commentRoute from "./src/routes/comments.js";

const app = express();
const db = knex(config.db);

dotenv.config();

const logger = pino(
  config.isDev
    ? {
        transport: {
          target: "pino-pretty",
        },
      }
    : {}
);

Model.knex(db);

app.use(
  cors({
    origin: process.env.WEB_APP_ORIGIN,
  })
);
app.use(express.json());
app.use((req, res, next) => {
  logger.error(req);

  next();
});

usersRoute({ app, db });
postsRoute({ app, db });
commentRoute({ app, db });

app.listen(config.port, () => console.log(`Listening on: ${config.port}`));
