import { Model } from "objection";
import PostModel from "./Post.js";
import CommentModel from "./Comments.js";
import RoleModel from "./Role.js";

class UserModel extends Model {
  static tableName = "users";

  static get relationMapping() {
    return {
      roles: {
        relation: Model.HasOneRelation,
        modelClass: RoleModel,
        join: {
          from: "users.roleId",
          to: "roles.id",
        },
      },
      posts: {
        relation: Model.HasManyRelation,
        modelClass: PostModel,
        join: {
          from: "users.id",
          to: "posts.userId",
          //through existe aussi pour donner le path à parcourir pour arriver à la destination finale
        },
      },
      comments: {
        relation: Model.HasManyRelation,
        modelClass: CommentModel,
        join: {
          from: "users.id",
          to: "comments.userId",
        },
      },
    };
  }
  checkPassword(password) {
    const [passwordHash] = hashPassword(password, this.passwordSalt);

    return passwordHash === this.passwordHash;
  }

  static findValidUserByEmail(email) {
    return UserModel.query().findOne({ email }).whereNull("suspendedAt");
  }
}

export default UserModel;
