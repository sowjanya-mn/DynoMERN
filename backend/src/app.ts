import "#db";
import express from "express";
import cors from "cors";
import { crmRouter } from "#routes";
//import { errorHandler, notFoundHandler } from "#middlewares";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/crm", crmRouter);

//app.use("*splat", notFoundHandler);
//app.use(errorHandler);

app.listen(port, () =>
  console.log(`\x1b[34mMain app listening at http://localhost:${port}\x1b[0m`),
);
