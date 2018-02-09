/* eslint no-param-reassign: 0 */
const { Model } = require("objection");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const { ValidationError } = require("objection");

class User extends Model {
  static get tableName() {
    return "users";
  }

  static get PASSWORD_MIN_LENGTH() {
    return 6;
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["email"],

      properties: {
        id: { type: "string" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        email: {
          type: "string",
          minLength: 1,
          maxLength: 255,
          format: "email",
        },
        password: { type: "string" },
        isDeleted: { type: "boolean", default: false },
      },
    };
  }

  async checkPassword(password) {
    return bcrypt.compare(password, this.password);
  }

  async updatePassword() {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
  }

  $afterGet() {
    this.$omit(["isDeleted"]);
  }

  $afterInsert() {
    this.$afterGet();
  }

  $beforeUpdate(opt) {
    if (opt.patch && this.password) {
      return this.updatePassword();
    }
    return Promise.resolve();
  }

  $formatJson(json) {
    json = super.$formatJson(json);
    json.password = undefined;
    return json;
  }

  async $beforeInsert() {
    // throw error if passwords don't match.
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    this.id = uuid.v4();
  }

  $beforeValidate(jsonSchema, json) {
    json.isDeleted = this.isDeleted;
    json.id = this.id;
    if (json.password && json.password.length < User.PASSWORD_MIN_LENGTH) {
      throw new ValidationError(
        `Password is too short, it must be at least ${
          User.PASSWORD_MIN_LENGTH
        }`,
      );
    }
    return jsonSchema;
  }
}

module.exports = User;
