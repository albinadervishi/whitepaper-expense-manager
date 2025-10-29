import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";

dotenv.config();

import teamRoutes from "./routes/teamRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import aiRoutes from "./routes/aiRoutes";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/teams", teamRoutes);
app.use("/expenses", expenseRoutes);
app.use("/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
