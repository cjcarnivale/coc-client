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
  }

}

export default FetchService; 