import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { teamRouter } from "./routers/teamRouter.js";
import { pilotRouter } from "./routers/pilotRouter.js";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/team", teamRouter);
app.use("/api/pilot", pilotRouter);

app.listen(4000, () => {
  console.log(`--->BE listening on port ${PORT}.`);
});
