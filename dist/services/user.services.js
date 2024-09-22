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
    getUser: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_repository_1.default.getUser(email);
            return user;
        }
        catch (error) {
            console.log(`Error while getting user: ${error}`);
        }
    }),
    createUser: (user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newUser = yield user_repository_1.default.createUser(user);
            // create checking logic for user already registered
            if (!user.email) {
                throw new Error("email already registered");
            }
            return newUser;
        }
        catch (error) {
            console.log(error);
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
