"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var speakerController = require('../controllers/speaker.controller');
router.post('/', speakerController.post);
router.post('/message', speakerController.sendMessage)
router.post('/conversation', speakerController.conversate)
module.exports = router;
