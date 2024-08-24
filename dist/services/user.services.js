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
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_schema_1 = require("../models/auth.schema");
const UserService = {
    getAllUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allUsers = yield user_repository_1.default.getAllUsers();
            return allUsers;
        }
        catch (error) {
            console.log(error);
        }
    }),
    getUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_repository_1.default.getUser(id);
            return user;
        }
        catch (error) {
            console.log(`Error while getting user: ${error}`);
        }
    }),
    createUser: (user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newUser = yield user_repository_1.default.createUser(user);
            return newUser;
        }
        catch (error) {
            console.log(error);
        }
    }),
    loginUser: (loginData) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = loginData;
        try {
            if (!email || password.length < 8) {
                return "email should be valid and password should have minimum 8 characters";
            }
            // find user
            const user = yield user_repository_1.default.loginUser(email);
            // check if user exists
            if (!user) {
                return "User not found";
            }
            // compare password
            const isPassMatch = yield bcrypt_1.default.compare(password, user.password);
            // check if password matches
            if (!isPassMatch) {
                return "Invalid password";
            }
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            //create token
            const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: 300 });
            const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
            const token = { accessToken, refreshToken };
            //save refresh token in db
            const newRefreshToken = new auth_schema_1.Auth({
                userId: user.id,
                refreshToken,
            });
            yield newRefreshToken.save();
            return token;
        }
        catch (error) {
            console.log(`Error while login user: ${error}`);
        }
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = yield user_repository_1.default.deleteUser(id);
            return userId;
        }
        catch (error) {
            console.log(error);
        }
    }),
    updateUser: (id, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedUser = yield user_repository_1.default.updateUser(id, user);
            return updatedUser;
        }
        catch (error) {
            console.log(error);
        }
    })
};
exports.default = UserService;
