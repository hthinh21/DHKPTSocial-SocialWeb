import express, { request, response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import articleRoute from "./routes/articleRoute.js";
import commentRoute from "./routes/commentRoute.js";
import followRoute from "./routes/followRoute.js";
import likeRoute from "./routes/likeRoute.js";
import notifyRoute from "./routes/notifyRoute.js";
import fileRoute from "./routes/fileRoutes.js";
import reportRoute from "./routes/reportRoute.js";
import messageRoute from "./routes/messageRoute.js";
import adminRoute from "./routes/adminRoute.js";
import cors from "cors";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app); // Tạo server HTTP
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // Đảm bảo đúng cổng của frontend
        credentials: true,
    },
});

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// Swagger Configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "DHKPT Social API",
            version: "1.0.0",
            description: "API documentation for my app",
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
app.get("/", (request, response) => {
    console.log(request);
    return response.status(200).send("Welcome to DHKPT Social API");
});

app.use("/users", userRoute);
app.use("/articles", articleRoute);
app.use("/comments", commentRoute);
app.use("/follows", followRoute);
app.use("/likes", likeRoute);
app.use("/notifications", notifyRoute);
app.use("/files", fileRoute);
app.use("/reports", reportRoute);
app.use("/messages", messageRoute);
app.use("/admin", adminRoute);
// **Socket.IO Logic**
io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    // Lắng nghe sự kiện 'sendMessage' từ client
    socket.on("sendMessage", (message) => {
        console.log("Tin nhắn mới từ client:", message);

        // Phát tin nhắn mới đến tất cả các client
        io.emit("newMessage", message);
    });

    // Xử lý khi client ngắt kết nối
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
    });
});

// Kết nối đến MongoDB và khởi động server
mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log(`Đã kết nối đến MongoDB!`);
        server.listen(PORT, () => {
            console.log(`Server đang lắng nghe trên cổng: ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("Lỗi kết nối MongoDB:", error);
    });
