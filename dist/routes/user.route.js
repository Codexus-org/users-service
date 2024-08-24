"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const auth_middleware_1 = __importDefault(require("../middleware/auth.middleware"));
exports.userRouter = express_1.default.Router();
exports.userRouter.get("/", user_controller_1.default.handleGetAllUsers);
exports.userRouter.get("/:id", user_controller_1.default.handleGetUser);
exports.userRouter.post("/", user_controller_1.default.handleCreateUser);
exports.userRouter.post("/login", user_controller_1.default.handleLoginUser);
exports.userRouter.post("/logout", auth_middleware_1.default, user_controller_1.default.handleLogoutUser);
exports.userRouter.delete("/:id", user_controller_1.default.handleDeleteUser);
exports.userRouter.patch("/:id", user_controller_1.default.handleUpdateUser);
