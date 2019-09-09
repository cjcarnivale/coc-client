import Config from "../config";

const DenominationService = {
  getDenominations() {
    return fetch(`${Config.API_ENDPOINT}/denominations`).then(res =>
      res.json()
    );
  }
};

export default DenominationService;
