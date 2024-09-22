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
exports.verifyAccessToken = verifyAccessToken;
function verifyAccessToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { accessToken, refreshToken } = req.cookies;
        if (!accessToken) {
            return res.status(401).json({ message: "Unauthorized: No access token provided. Please log in first." });
        }
        try {
            const authorizeUser = yield fetch(`http://localhost:3001/auth/verify-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accessToken, refreshToken })
            });
            const data = yield authorizeUser.json();
            req.body.user = data.data;
            if (!authorizeUser.ok) {
                const error = yield authorizeUser.json();
                throw new Error(error.message);
            }
            next();
        }
        catch (error) {
            // next(error);
            res.status(401).json({ message: error.message });
        }
    });
}
