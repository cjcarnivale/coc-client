import Config from "../config";

const DenominationService = {
  getDenominations(type) {
    return fetch(`${Config.API_ENDPOINT}/denominations/${type}`).then(res =>
      res.json()
    );
  }
};

export default DenominationService;
