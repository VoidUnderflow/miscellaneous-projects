import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database";
import addressRoutes from "./routes/addressRoutes";
import personRoutes from "./routes/personRoutes";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "Address & People API",
    endpoints: {
      addresses: "/api/addresses",
      people: "/api/people",
    },
  });
});

app.use("/api/addresses", addressRoutes);
app.use("/api/people", personRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
