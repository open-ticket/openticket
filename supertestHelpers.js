/* eslint import/no-extraneous-dependencies: 0 */
const supertest = require("supertest");

module.exports = (request = supertest(require("./user/server"))) => ({
  jsonPostRequest: (path, data) =>
    request
      .post(path)
      .send(data)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json"),
  jsonPutRequest: (path, data) =>
    request
      .put(path)
      .send(data)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json"),
  jsonPatchRequest: (path, data) =>
    request
      .patch(path)
      .send(data)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json"),
  jsonGetRequest: path => request.get(path).set("Accept", "application/json"),
  jsonDeleteRequest: path =>
    request.delete(path).set("Accept", "application/json"),
});
