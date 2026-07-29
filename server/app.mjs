import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRouter from "./routes/index.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://refio-blog.vercel.app",
    ],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello TechUp!");
});

app.use(apiRouter);

if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
