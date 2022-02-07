import mongoose from "mongoose";

const statisticSchema = new mongoose.Schema({
  id: { type: String, required: true },
  stateData: {},
});

const requestSchema = new mongoose.Schema({
  responseId: { type: String, required: true },
  state: { type: String, required: true },
  date: { type: Date, required: true },
});

const statisticModel = mongoose.model("statistic", statisticSchema);
const requestModel = mongoose.model("request", requestSchema);

export { statisticModel, requestModel };
