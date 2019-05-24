
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

var express = __importDefault(require("express"));
var app = express.default();

app.use('/', require('./routes/index.route'));
app.use('/speaker', require('./routes/speaker.route'));

module.exports = app;


