import Config from "../config"

const FetchService = {
  getAllSafeCounts() {
    return  fetch(`${Config.API_ENDPOINT}/safecounts`)
              .then(res => res.json())
  },

  getDenominations() {
    return  fetch(`${Config.API_ENDPOINT}/denominations`)
              .then(res => res.json())
  },

  getSafeCount(day) {
    return fetch(`${Config.API_ENDPOINT}/safecounts/${day}`)
              .then(res => res.json())
  },

  postSafeCount(newSafeCount) {
    return fetch(`${Config.API_ENDPOINT}/safecounts`, {
              headers: {
                "content-type": "application/json"
              },
              method: "POST",
              body: JSON.stringify(newSafeCount)
        })
  },

  updateSafeCount(newSafeCount, day) {
    return fetch(`${Config.API_ENDPOINT}/safecounts/${day}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(newSafeCount)
    })
  }
}

export default FetchService; 