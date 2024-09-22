"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = require("../middleware/auth.middleware");
exports.userRouter = express_1.default.Router();
exports.userRouter.get("/", auth_middleware_1.verifyAccessToken, user_controller_1.default.handleGetAllUsers);
exports.userRouter.get("/:id", auth_middleware_1.verifyAccessToken, user_controller_1.default.handleGetUser);
// userRouter.delete("/delete/:id", authMiddleware, UserController.handleDeleteUser);
// userRouter.patch("/update/:id", authMiddleware, UserController.handleUpdateUser);
