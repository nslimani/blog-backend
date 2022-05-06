exports.up = async (knex) => {
  // To create users table
  await knex.schema.createTable("users", (table) => {
    table.increments("id");
    table.string("username").notNullable();
    table.string("email").notNullable();
    table.string("password").notNullable();
    table.integer("roleId").notNullable();
    table.foreign("roleId").references("id").inTable("roles");
  });

  // To create roles table
  await knex.schema.createTable("roles", (table) => {
    table.increments("id");
    table.string("roleName").notNullable();
  });

  await knex("roles").insert([
    { roleName: "Admin" },
    { roleName: Author },
    { roleName: User },
  ]);

  // To create posts Table;
  await knex.schema.createTable("posts", (table) => {
    table.increments("id");
    table.integer("userId").notNullable();
    table.foreign("userId").references("id").inTable("users");
    table.text("title").notNullable();
    table.text("content").notNullable();
    table.timestamp("Created").defaultTo(knex.fn.now());
  });

  // To create comments Table;
  await knex.schema.createTable("comments", (table) => {
    table.increments("id");
    table.integer("postId");
    table.foreign("postId").references("id").inTable("posts");
    table.integer("userId");
    table.foreign("userId").references("id").inTable("users");
    table.text("name");
    table.text("content");
    table.timestamp("Created").defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable("comments");
  await knex.schema.dropTable("posts");
  await knex.schema.dropTable("roles");
  await knex.schema.dropTable("users");
  await knex("roles").where().del();
};
