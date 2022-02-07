import axios from "axios";
import express from "express";
import { v4 as uuid } from "uuid";
import sendError from "./sendError.js";
import validateState from "./validateState.js";

const app = express();
app.use(express.json());

function main() {
  const database = {};
  const requests = [];

  app.get("/covid_info_state/:state", async (req, res) => {
    try {
      const { state } = req.params;
      if (!validateState(state.toUpperCase()))
        throw Error("Error: Invalid state code.");
      const { data: stateData } = await axios.get(
        ` https://api.covidtracking.com/v1/states/${state.toLowerCase()}/current.json`
      );
      const id = uuid();
      database[id] = stateData;
      const request = { responseId: id, state, date: new Date() };
      requests.push(request);

      res.status(200).send({ id, stateData });
    } catch (err) {
      sendError(err, res);
    }
  });

  app.get("/covid_info_id/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const stateData = database[id];
      if (!stateData) throw Error("Error: Invalid id");

      res.status(200).send({ id, stateData });
    } catch (err) {
      sendError(err, res);
    }
  });

  app.get("/covid_list", async (_, res) => {
    try {
      if (!requests.length) throw Error("Error: You have no request.");

      res.status(200).send(requests);
    } catch (err) {
      sendError(err, res);
    }
  });
}

main();

app.listen(3000, () => {
  console.log("Server is running");
});
