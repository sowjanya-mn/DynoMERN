import "#db";
import express from "express";
import cors from "cors";
import { crmRouter } from "#routes";
import { errorHandler, notFoundHandler } from "#middlewares";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Mount the router directly onto the path expected by your Vite server configurations
app.use("/crm", crmRouter);

app.use("*splat", notFoundHandler);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`),
);

// Open src/app.ts and add this snippet right at the very bottom, below app.listen():

process.on("unhandledRejection", (reason, promise) => {
  console.error(
    "⚠️ Caught an Unhandled Rejection at Promise:",
    promise,
    "reason:",
    reason,
  );
});

process.on("uncaughtException", (error) => {
  console.error("❌ Caught a Critical Uncaught Exception:", error);
});
