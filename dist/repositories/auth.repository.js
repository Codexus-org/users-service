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
Object.defineProperty(exports, "__esModule", { value: true });
const auth_schema_1 = require("../models/auth.schema");
const AuthRepository = {
    createAuth: (userId, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const newAuth = yield auth_schema_1.Auth.create({ userId, refreshToken });
            yield newAuth.save();
            return newAuth;
        }
        catch (error) {
            console.log(error);
        }
    }),
    getAuth: (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const auth = yield auth_schema_1.Auth.findOne({ refreshToken });
            console.log('auth repo: ', auth);
            return auth;
        }
        catch (error) {
            console.log(error);
        }
    }),
    deleteAuth: (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const deletedAuth = yield auth_schema_1.Auth.deleteOne({ refreshToken });
            return deletedAuth;
        }
        catch (error) {
            console.log(error);
        }
    })
};
exports.default = AuthRepository;
