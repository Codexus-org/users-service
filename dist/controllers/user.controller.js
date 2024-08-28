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
const auth_schema_1 = require("../models/auth.schema");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserController = {
    // Get all users
    handleGetAllUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const allUsers = yield user_services_1.default.getAllUsers();
        return res.status(200).json({ message: "All users", data: allUsers });
    }),
    // Create user
    handleCreateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, email, password } = req.body;
        const newUser = yield user_services_1.default.createUser({ name, email, password });
        if (!newUser) {
            return res.status(401).json({ message: "Failed Create User" });
        }
        try {
            return res.status(201).json({ message: "User created", data: newUser });
        }
        catch (error) {
            console.log(error);
        }
    }),
    // Get user
    handleGetUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { id } = req.params;
        const user = yield user_services_1.default.getUser(id);
        return res.status(200).json({ message: "User", data: user });
    }),
    handleLoginUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const userLogin = yield user_services_1.default.loginUser({ email, password });
            if (userLogin && typeof userLogin === 'object') {
                const { accessToken, refreshToken } = userLogin;
                // rest of your code
                return res
                    .cookie("accessToken", accessToken, { httpOnly: true })
                    .cookie("refreshToken", refreshToken, { httpOnly: true })
                    .status(200)
                    .json({ message: "User logged in" });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ message: error.message });
            }
        }
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
    handleUpdateUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { accessToken } = req.cookies;
            const payload = jsonwebtoken_1.default.decode(accessToken);
            const { name, email, password } = req.body;
            const hashPassword = yield bcrypt_1.default.hash(password, 13);
            const updatedUser = yield user_services_1.default.updateUser(payload.id, { name, email, password: hashPassword });
            return res.status(200).json({ message: "User updated", data: updatedUser });
        }
        catch (error) {
            console.log(error);
        }
    }),
    handleLogoutUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { refreshToken } = req.cookies;
        yield auth_schema_1.Auth.findOneAndDelete({ refreshToken });
        return res.clearCookie("accessToken").clearCookie("refreshToken").status(200).json({ message: "User logged out" });
    })
};
exports.default = UserController;
