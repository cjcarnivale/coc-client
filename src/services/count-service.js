import Config from "../config";

const CountService = {
  getAllSafeCounts() {
    return fetch(`${Config.API_ENDPOINT}/safecounts`).then(res => res.json());
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

  updateSafeCount(newSafeCount, day) {
    return fetch(`${Config.API_ENDPOINT}/safecounts/${day}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(newSafeCount)
    });
  },

  deleteSafeCount(day) {
    return fetch(`${Config.API_ENDPOINT}/safecounts/${day}`, {
      method: "DELETE"
    });
  }
};

export default CountService;
