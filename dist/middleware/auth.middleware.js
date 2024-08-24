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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_schema_1 = require("../models/auth.schema");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { accessToken, refreshToken } = req.cookies;
    if (!accessToken && !refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (accessToken) {
        try {
            jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET);
        }
        catch (error) {
            if (!refreshToken) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            try {
                jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                const activateRefreshToken = yield auth_schema_1.Auth.findOne({ refreshToken });
                if (!activateRefreshToken) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                const payload = jsonwebtoken_1.default.decode(refreshToken);
                const newAccessToken = jsonwebtoken_1.default.sign({ id: payload.id, name: payload.name, email: payload.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: 300 });
                return res.cookie("accessToken", newAccessToken, { httpOnly: true }).status(200).json({ message: "User logged in" });
            }
            catch (error) {
                return res.status(401).json({ message: "Unauthorized" });
            }
        }
    }
    next();
});
exports.default = authMiddleware;
