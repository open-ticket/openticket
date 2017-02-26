"use strict";

const fs = require("fs");
const _ = require("lodash");
const koa = require("koa");
const Knex = require("knex");

const knexConfig = require("./knexfile");
const Model = require("objection").Model;

const app = koa();

const knex = Knex(knexConfig.development);

Model.knex(knex);

app.use(require("koa-bodyparser"))({
    strict: true
});

app.use(function* (next) {
    try {
        yield next;
        try{
            this.body = JSON.stringify(this.body, "\t", 3);
        }
        catch (e) {
            console.log("Error on stringifying "+this.body);
        }
    }
    catch (err) {
        if (err.status == 401) {
            this.status= err.status;
            this.body = JSON.stringify({"error": "User token missing or invalid"}, "\t", 3);
        }
    }

    // log this request.
    console.log(this.method + " " + this.path + " - " + this.status);
});

module.exports= app;
