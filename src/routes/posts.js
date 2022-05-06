import PostModel from "../db/models/Post.js";
import CommentModel from "../db/models/Comments.js";

const postsRoute = ({ app }) => {
  app.post("/posts", async (req, res) => {
    const {
      body: { title, content, userId },
    } = req;

    try {
      const post = await PostModel.query().insertAndFetch({
        title,
        content,
        userId,
      });

      res.send(post);
    } catch (err) {
      res.status(500).send({ error: "Not Working" });
    }
  });

  app.get("/posts/:postId", async (req, res) => {
    const {
      params: { userId, postId },
    } = req;
    const post = await PostModel.query()
      .withGraphFetched("author")
      .join("users", "users.id", "=", "posts.userId")
      .select("users.id AS userId", "users.email AS userEmail")
      .orderBy("posts.created", "desc");

    const comment = await CommentModel.query()
      .withGraphFetched("author")
      .join("posts", "posts.id", "=", "comment.postId")
      .select("users.id AS userId", "users.email AS userEmail")
      .orderBy("comments.created", "desc");

    if (!post) {
      res.status(400).send({ error: "post not found" });
    }
    res.send({ ...post, comment: comment });
  });

  app.delete("/posts/: postId", async (req, res) => {
    const {
      params: { postId },
    } = req;
    const post = await PostModel.query().findById(postId);
    if (!post) {
      res.status(404).send({ error: "not found" });
      return;
    }

    await post.$query().delete();

    res.send(post);
  });

  app.put("/posts/:postId", async (req, res) => {
    const {
      params: { postId },
      body: { title, content },
    } = req;

    const existingPost = await PostModel.query().findById(postId);
    if (!existingPost) {
      res.status(404).send({ error: "not found" });
      return;
    }
    const [post] = await existingPost.$query().updateAndFetch({
      title,
      content,
    });
    res.send(user);
  });
};

export default postsRoute;
