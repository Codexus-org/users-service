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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_repository_1 = __importDefault(require("../repositories/auth.repository"));
const user_services_1 = __importDefault(require("./user.services"));
const AuthServices = {
    loginUser: (loginData) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = loginData;
        try {
            if (!email || password.length < 8) {
                throw new Error("email should be valid and password should have minimum 8 characters");
            }
            // find user
            const user = yield user_services_1.default.getUser(email);
            // check if user exists
            if (!user) {
                throw new Error("Invalid credentials");
            }
            // compare password
            const isPassMatch = yield bcrypt_1.default.compare(password, user.password);
            // check if password matches
            if (!isPassMatch) {
                throw new Error("Invalid credentials");
            }
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };
            //create token
            const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: 300 });
            const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
            const userId = user.id;
            //save refresh token in db
            yield auth_repository_1.default.createAuth(user.id, refreshToken);
            return { userId, accessToken, refreshToken };
        }
        catch (error) {
            console.log(`Error while login user: ${error}`);
        }
    }),
    verifyAccessToken: (accessToken, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        // Check if access token and refresh token doesn't exist
        if (!accessToken && !refreshToken) {
            throw new Error("accessToken and refreshToken are required");
        }
        // Check if access token exists
        if (accessToken) {
            try {
                console.log('accessToken auth.service: ', accessToken);
                jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET);
                const payload = jsonwebtoken_1.default.decode(accessToken);
                return { userId: payload.id, refreshToken, accessToken };
            }
            catch (error) {
                // If refresh token doesn't exist, regenerate new access token from refresh token
                if (!refreshToken) {
                    throw new Error("refreshToken is required");
                }
                try {
                    // Check if refresh token valid
                    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
                    // If refresh token valid, verify resfresh token in db
                    const activateRefreshToken = yield auth_repository_1.default.getAuth(refreshToken);
                    if (!activateRefreshToken) {
                        throw new Error("refreshToken invalid");
                    }
                    console.log(activateRefreshToken);
                    console.log(refreshToken);
                    const payload = jsonwebtoken_1.default.decode(refreshToken);
                    console.log(payload);
                    // Generate new access token
                    const newAccessToken = jsonwebtoken_1.default.sign({ id: payload.id, name: payload.name, email: payload.email }, process.env.JWT_ACCESS_SECRET, { expiresIn: 300 });
                    return { userId: payload.id, refreshToken, accessToken: newAccessToken };
                }
                catch (error) {
                    // If invalid refresh token, return unauthorized
                    throw new Error("Invalid refreshToken");
                }
            }
        }
    }),
    userLogout: (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield auth_repository_1.default.deleteAuth(refreshToken);
        }
        catch (error) {
            console.log(`Error while logout user: ${error}`);
        }
    })
};
exports.default = AuthServices;
