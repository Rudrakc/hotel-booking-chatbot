import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Chatbot } from "./chatbot.js";
import { sequelize, Conversation } from "./database.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

app.use(express.json());
app.use(cors());  

const chatbot = new Chatbot();

app.post("/chat", async (req, res) => {
  const { message, userId } = req.body;
  const response = await chatbot.handleMessage(message, userId);
  console.log(req.body);
  res.json(response);
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
