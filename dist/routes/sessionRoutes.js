"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sessionController_1 = require("../controllers/sessionController");
const router = express_1.default.Router();
router.get("/all", sessionController_1.getAllSessions);
router.post("/", sessionController_1.createSession);
router.put("/:id", sessionController_1.updateSession);
router.delete("/:id", sessionController_1.deleteSession);
router.get("/user/:user_id", sessionController_1.getUserSessions);
router.get("/:id", sessionController_1.getSession);
exports.default = router;
