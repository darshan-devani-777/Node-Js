"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = __importDefault(require("./Routes/user.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json()); // Middleware to parse JSON
app.use("/api/users", user_route_1.default);
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server Start At http://localhost:${PORT}`);
});
exports.default = app;
