import CommentModel from "../db/models/Comments.js";
import PostModel from "../db/models/Post.js";

const commentRoute = ({ app }) => {
  app.post("/comments", async (req, res) => {
    const {
      body: { name, content, userId, postId },
    } = req;

    try {
      const post = await CommentModel.query().insertAndFetch({
        name,
        content,
        userId,
        postId,
      });

      res.send(post);
    } catch (err) {
      res.status(500).send({ error: "Not Working" });
    }
  });

  app.get("/comments/:commentId", async (req, res) => {
    const {
      params: { commentId },
    } = req;

    const comment = await CommentModel.query().findById(commentId);
    if (!comment) {
      res.status(404).send({ error: "not found" });

      return;
    }
    res.send(comment);
  });

  app.delete("/comments/:commentId", async (req, res) => {
    const {
      params: { commentId },
    } = req;

    const comment = CommentModel.query().findById(commentId);

    if (!comment) {
      res.status(404).send({ error: "not found" });
      return;
    }

    await comment.$query().delete();

    res.send(comment);
  });

  app.put("/comments/:commentId", async (req, res) => {
    const {
      params: { commentId },
      body: { name, content },
    } = req;

    const existingComment = await CommentModel.query().findById(commentId);
    if (!existingComment) {
      res.status(404).send({ error: "not found" });
      return;
    }
    const [comment] = await existingComment.$query().updateAndFetch({
      name,
      content,
    });
    res.send(comment);
  });
};
export default commentRoute;
