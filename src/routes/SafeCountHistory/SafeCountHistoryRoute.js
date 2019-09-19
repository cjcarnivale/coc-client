import React, { Component } from "react";
import { Link } from "react-router-dom";
import History from "../../components/History/History";

export default class SafeCountHistoryRoute extends Component {
  render() {
    return (
      <div>
        <h2>Safe Count History</h2>
        <Link
          to={{
            pathname: "/addsafecount",
            state: {
              manual: true,
              type: "safecounts"
            }
          }}
        >
          Add Safe Count
        </Link>
        <History type="safecounts"/>
      </div>
    );
  }
}
