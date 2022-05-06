import { Model } from "objection";
import UserModel from "./User.js";

class PostModel extends Model {
  static tableName = "posts";

  static get relationMapping() {
    return {
      author: {
        relation: Model.BelongsToOneRelation,
        modelClass: UserModel,
        join: {
          from: "posts.userId",
          to: "users.id",
          //through existe aussi pour donner le path à parcourir pour arriver à la destination finale
        },
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: CommentModel,
        join: {
          from: "posts.id",
          to: "comments.postId",
        },
      },
    };
  }
}

export default PostModel;
