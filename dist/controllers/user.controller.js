"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_services_1 = __importDefault(require("../services/user.services"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const UserController = {
    // Get all users
    handleGetAllUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const allUsers = yield user_services_1.default.getAllUsers();
        return res.status(200).json({ message: "All users", data: allUsers });
    }),
    // Get user
    handleGetUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const user = yield user_services_1.default.getUser(id);
        console.log(user);
        return res.status(200).json({ message: "User", data: user });
    }),
    handleDeleteUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { accessToken } = req.cookies;
            const payload = jsonwebtoken_1.default.decode(accessToken);
            const deletedUser = yield user_services_1.default.deleteUser(payload.id);
            return res.status(200).json({ message: "User deleted", data: deletedUser });
        }
        catch (error) {
            console.log(error);
        }
    }),
    handleLogoutUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { refreshToken } = req.body;
        yield auth_service_1.default.userLogout(refreshToken);
        return res.clearCookie("accessToken").clearCookie("refreshToken").status(200).json({ message: "User logged out" });
    })
};
exports.default = UserController;
