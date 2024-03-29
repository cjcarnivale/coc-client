import Config from "../config";

const CountService = {
  getAllCounts(type) {
    return fetch(`${Config.API_ENDPOINT}/${type}`).then(res => res.json());
  },

  getCount(day, type) {
    return fetch(`${Config.API_ENDPOINT}/${type}/${day}`).then(res =>
      res.json()
    );
  },

  postCount(newCount, type) {
    return fetch(`${Config.API_ENDPOINT}/${type} `, {
      headers: {
        "content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(newCount)
    });
  },

  updateCount(newCount, type, day) {
    return fetch(`${Config.API_ENDPOINT}/${type}/${day}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(newCount)
    });
  },

  deleteCount(type, day) {
    return fetch(`${Config.API_ENDPOINT}/${type}/${day}`, {
      method: "DELETE"
    });
  }
};

export default CountService;
