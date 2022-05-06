import { Model } from "objection";

class RoleModel extends Model {
  static tableName = "roles";

  static get relationMapping() {
    return {
      roles: {
        relation: Model.BelongsToOneRelation,
        modelClass: RoleModel,
        join: {
          from: "roles.id",
          to: "users.roleId",
          //through existe aussi pour donner le path à parcourir pour arriver à la destination finale
        },
      },
    };
  }
}

export default RoleModel;
