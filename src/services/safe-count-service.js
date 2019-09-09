import Config from "../config";

const SafeCountService = {
  getAllSafeCounts() {
    return fetch(`${Config.API_ENDPOINT}/safecounts`).then(res => res.json());
  },

  getSafeCount(day) {
    return fetch(`${Config.API_ENDPOINT}/safecounts/${day}`).then(res =>
      res.json()
    );
  },

  postSafeCount(newSafeCount) {
    return fetch(`${Config.API_ENDPOINT}/safecounts`, {
      headers: {
        "content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(newSafeCount)
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

export default SafeCountService;