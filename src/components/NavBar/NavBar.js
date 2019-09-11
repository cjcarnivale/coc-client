import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css"

export default class NavBar extends Component {
  render() {
    return (
      <div className="nav-links">
        <Link to="/">DashBoard</Link>
        <Link to="/safecounthistory">
          Safe Count History
        </Link>
        <Link to="/">Change Order History</Link>
      </div>
    );
  }
}
