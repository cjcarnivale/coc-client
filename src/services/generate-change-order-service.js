import Config from "../config";

function generateChangeOrder(day) {
  return fetch(`${Config.API_ENDPOINT}/changeorders/generatecount/${day}`);
}

export default generateChangeOrder;
