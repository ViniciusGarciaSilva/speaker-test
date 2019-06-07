
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

var express = __importDefault(require("express"));
var body_parser = __importDefault(require("body-parser"));
var app = express.default();

app.use(body_parser.default.urlencoded({ extended: true }));
app.use(body_parser.default.json());
app.use('/', require('./routes/index.route'));
app.use('/speaker', require('./routes/speaker.route'));

module.exports = app;


