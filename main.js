import axios from "axios";
import express from "express";
import { v4 as uuid } from "uuid";
import sendError from "./sendError.js";
import validateState from "./validateState.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { DatabaseAPI } from "./database/databaseAPI.js ";

dotenv.config();
mongoose.connect(process.env.DATABASE_URL);

const app = express();
app.use(express.json());

function main() {
  const db = new DatabaseAPI();

  app.get("/covid_info_state/:state", async (req, res) => {
    try {
      const { state } = req.params;

      if (!validateState(state.toUpperCase()))
        throw Error("Error: Invalid state code.");

      const { data: stateData } = await axios.get(
        ` https://api.covidtracking.com/v1/states/${state.toLowerCase()}/current.json`
      );
      const id = uuid();

      const statistic = await db.createStatistic(id, stateData);
      await db.createRequest(id, state);

      res.status(200).send(statistic);
    } catch (err) {
      sendError(err, res);
    }
  });

  app.get("/covid_info_id/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { stateData } = await db.getStatstic(id);
      if (!stateData) throw Error("Error: Invalid id");

      res.status(200).send({ id, stateData });
    } catch (err) {
      sendError(err, res);
    }
  });

  app.get("/covid_list", async (_, res) => {
    try {
      const requests = await db.getRequests();
      if (!requests.length) throw Error("Error: You have no requests.");

      const response = requests.map(
        (req) =>
          new Object({
            responseId: req.responseId,
            state: req.state,
            date: req.date,
          })
      );

      res.status(200).send(response);
    } catch (err) {
      sendError(err, res);
    }
  });
}

main();

app.listen(3000, () => {
  console.log("Server is running");
});
