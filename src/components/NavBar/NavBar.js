import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

export default class NavBar extends Component {
  render() {
    return (
      <div className="nav-links">
        <Link to="/">DashBoard</Link>
        <Link to={"/history/safecounts"}>Safe Count History</Link>
        <Link to={"/history/changeorders"}>Change Order History</Link>
      </div>
    );
  }
}
