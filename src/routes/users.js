//import { password } from "pg/lib/defaults.js";
import * as yup from "yup";
import UserModel from "../db/models/User.js";
import jsonwebtoken from "jsonwebtoken";
import hashPassword from "../hashPassword.js";
import checkPayload from "../middlewares/checkPayload.js";
import checkQuery from "../middlewares/checkQuery.js";
import { emailValidator } from "../validators.js";
import config from "../config.js";
import auth from "../middlewares/auth.js";

const usersRoute = ({ app, db }) => {
  app.post("/users", async (req, res) => {
    const {
      body: { email, password },
    } = req;

    const user = await UserModel.findValidUserByEmail(email);
    if (!user) {
      res.status(401).send({ error: "invalid email or password" });
      return;
    }

    if (!user.checkPassword(password)) {
      res.status(401).send({ error: "invalid email or password" });
      return;
    }

    const jwt = jsonwebtoken.sign(
      { payload: { userId: user.id } },
      config.security.session.secret,
      { expiresIn: config.security.session.expiresIn }
    );
    res.send({ jwt });
  });
  app.post(
    "/users",
    checkPayload({ email: emailValidator.required() }),
    async (req, res) => {
      const {
        body: { email, password },
      } = req;

      const [passwordHash, passwordSalt] = hashPassword(password);
      const user = await UserModel.query().insertAndFetch({
        email,
        passwordHash,
        passwordSalt,
      });

      res.send(user);
    }
  );

  app.get(
    "/user",
    checkQuery({
      sortBy: yup.string().oneOf(["email", "id"]),
      orderBy: yup.string().oneOf(["asc", "desc"]),
    }),
    async (req, res) => {
      const {
        query: { sortBy, order },
      } = req;
      const query = UserModel.query();
      if (sortBy && order) {
        query.orderBy(sortBy, order);
      }
      // const sql = `SELECT * FROM users ORDER BY ${sortBy} ${order}`; => l'un des plus gros trou des sécurité

      res.send(await query);
    }
  );

  app.get("/users/:userId", auth, async (req, res) => {
    const {
      params: { userId },
      session: { userId: sessionUserId },
    } = req;

    if (userId != sessionUserId) {
      res.status(403).send({ error: "forbidden" });
      return;
    }

    const user = await UserModel.query().findById(userId);
    if (!user) {
      res.status(404).send({ error: "not found" });

      return;
    }
    res.send(user);
  });

  app.put(
    "/users/:userId",
    checkPayload({ email: emailValidator }),
    async (req, res) => {
      const {
        params: { userId },
        body: { username, email, password },
      } = req;
      const existingUser = await UserModel.query().findById(userId);
      if (!existingUser) {
        res.status(404).send({ error: "not found" });
        return;
      }
      const [user] = await existingUser.$query().updateAndFetch({
        username,
        email,
        passwordHash: password,
        passwordSalt: password,
      });
      res.send(user);
    }
  );

  app.delete("/users/: userId", async (req, res) => {
    const {
      params: { userId },
    } = req;
    const user = await UserModel.query().findById(userId);
    if (!user) {
      res.status(404).send({ error: "not found" });
      return;
    }

    await user.$query().delete();

    res.send(user);
  });
};

//utiliser le checkQuery donné comme param email et id => utilisation du yup

//app.listen(3000, () => console.log("listening on :3000"));

export default usersRoute;
