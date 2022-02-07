import { statisticModel, requestModel } from "./schema.js";

class DatabaseAPI {
  async createStatistic(id, stateData) {
    const statistic = new statisticModel({
      id,
      stateData,
    });

    return statistic.save();
  }

  async getStatstic(id) {
    const statistic = await statisticModel.findOne({
      id,
    });

    if (!statistic) return { stateDate: undefined };
    return statistic;
  }

  async createRequest(responseId, state) {
    const request = new requestModel({
      responseId,
      state,
      date: new Date(),
    });

    return request.save();
  }

  async getRequests() {
    const requests = await requestModel.find();

    return requests;
  }
}

export { DatabaseAPI };
