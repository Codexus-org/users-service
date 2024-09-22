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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_schema_1 = require("../models/user.schema");
const UserRepository = {
    getAllUsers: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const allUsers = yield user_schema_1.User.find();
            return allUsers;
        }
        catch (error) {
            console.log(`Error while getting all users: ${error}`);
        }
    }),
    getUser: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_schema_1.User.findOne({ email });
            return user;
        }
        catch (error) {
            console.log(`Error while getting user: ${error}`);
        }
    }),
    createUser: (user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password } = user;
            const hashPassword = yield bcrypt_1.default.hash(password, 13);
            const newUser = new user_schema_1.User({ name, email, password: hashPassword });
            const savedUser = yield newUser.save();
            return savedUser;
        }
        catch (error) {
            console.log(`Error while creating user: ${error}`);
        }
    }),
    loginUser: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield user_schema_1.User.findOne({ email });
            return user;
        }
        catch (error) {
            console.log(`Error while login user: ${error}`);
        }
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = yield user_schema_1.User.findByIdAndDelete(id);
            return userId;
        }
        catch (error) {
            console.log(error);
        }
    }),
    updateUser: (id, user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const updatedUser = yield user_schema_1.User.findByIdAndUpdate(id, user);
            return updatedUser;
        }
        catch (error) {
            console.log(error);
        }
    })
};
exports.default = UserRepository;
