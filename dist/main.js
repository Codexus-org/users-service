"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_route_1 = require("./routes/user.route");
const auth_route_1 = require("./routes/auth.route");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const api_gateway_middleware_1 = require("./middleware/api-gateway.middleware");
dotenv_1.default.config();
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Mongodb connection success"))
    .catch((error) => {
    console.log("Mongodb connection failed");
    console.log(error);
});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(api_gateway_middleware_1.middlewareCheckOrigin);
app.use("/forumapp/api/v1/auth", auth_route_1.authRouter);
app.use("/forumapp/api/v1/users-services", user_route_1.userRouter);
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
