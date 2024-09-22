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
const auth_service_1 = __importDefault(require("../services/auth.service"));
const user_services_1 = __importDefault(require("../services/user.services"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AuthControllers = {
    handleCreateUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
    handleLogin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const userLogin = yield auth_service_1.default.loginUser({ email, password });
            const { accessToken, refreshToken } = userLogin;
            return res
                .cookie("accessToken", accessToken, { httpOnly: true })
                .cookie("refreshToken", refreshToken, { httpOnly: true })
                .status(200)
                .json({ message: "User logged in" });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ message: error.message });
            }
        }
    }),
    handleLogout: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { refreshToken } = req.cookies;
        try {
            yield auth_service_1.default.userLogout(refreshToken);
            return res
                .clearCookie("accessToken")
                .clearCookie("refreshToken")
                .status(200)
                .json({ message: "User logged out" });
        }
        catch (error) {
            next(error);
        }
    }),
    handleVerifyAccessToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { accessToken, refreshToken } = req.body;
        try {
            const authorizeUser = yield auth_service_1.default.verifyAccessToken(accessToken, refreshToken);
            console.log('auth controller: ', authorizeUser);
            return res
                // .cookie("accessToken", accessToken, { httpOnly: true })
                // .cookie("refreshToken", refreshToken, { httpOnly: true })
                .status(200)
                .json({ message: "User authorized", data: authorizeUser });
        }
        catch (error) {
            next(error);
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
};
exports.default = AuthControllers;
