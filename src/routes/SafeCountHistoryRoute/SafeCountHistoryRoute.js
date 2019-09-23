import React, { Component } from "react";
import { Link } from "react-router-dom";
import History from "../../components/History/History";

export default class SafeCountHistoryRoute extends Component {
  render() {
    return (
      <div>
        <h2 className="heading">Safe Count History</h2>
        <div className="add-link-container">
          <Link
            to={{
              pathname: "/addcount",
              state: {
                manual: true,
                type: "safecounts"
              }
            }}
          >
            Add Safe Count
          </Link>
        </div>
        <History type="safecounts" />
      </div>
    );
  }
}
