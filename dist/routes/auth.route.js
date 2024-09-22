"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.authRouter = express_1.default.Router();
exports.authRouter.post("/verify-token", auth_controller_1.default.handleVerifyAccessToken);
exports.authRouter.post("/login", auth_controller_1.default.handleLogin);
exports.authRouter.post("/logout", auth_controller_1.default.handleLogout);
exports.authRouter.post("/register", auth_controller_1.default.handleCreateUser);
exports.authRouter.patch("/update/:id", auth_middleware_1.verifyAccessToken, auth_controller_1.default.handleUpdateUser);
