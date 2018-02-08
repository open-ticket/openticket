/* eslint no-param-reassign: 0 */
const { Model } = require("objection");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

class User extends Model {
  static get tableName() {
    return "users";
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
    this.passwordConfirm = undefined;
  }

  $afterGet() {
    this.$omit("isDeleted");
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

  async $beforeInsert() {
    // throw error if passwords don't match.
    if (this.password) {
      if (this.passwordConfirm) {
        this.passwordConfirm = undefined;
      } else {
        throw new Error("No password confirmation");
      }
      this.password = await bcrypt.hash(this.password, 10);
    }
    this.id = uuid.v4();
  }

  $beforeValidate(jsonSchema, json) {
    if (json.password && json.password !== json.passwordConfirm) {
      throw new Model.ValidationError(`Passwords don't match!`);
    }
    json.isDeleted = this.isDeleted;
    json.id = this.id;
    this.passwordConfirm = undefined;
    return jsonSchema;
  }
}

module.exports = User;
