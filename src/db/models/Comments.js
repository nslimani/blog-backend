import { Model } from "objection";
import UserModel from "./User.js";
import PostModel from "./Post.js";

class CommentModel extends Model {
  static tableName = "comments";

  static get relationMapping() {
    return {
      author: {
        relation: Model.HasOneRelation,
        modelClass: UserModel,
        join: {
          from: "comments.userId",
          to: "users.id",
          //through existe aussi pour donner le path à parcourir pour arriver à la destination finale
        },
      },
      post: {
        relation: Model.HasOneRelation,
        modelClass: PostModel,
        join: {
          from: "comments.postId",
          to: "posts.id",
        },
      },
    };
  }
}

export default CommentModel;
