import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import History from '../../components/History/History'

export default class ChangeOrderHistoryRoute extends Component {
  render() {
    return (
      <div>
      <h2 className="heading">Change Order History</h2>
      <div className="add-link-container">
        <Link
          to={{
            pathname: "/addcount",
            state: {
              manaul: true,
              type: "changeorders"
            }
          }}
        >
          Add Change Order
        </Link>
      </div>
      <History type="changeorders" />
    </div>
        
    
    )
  }
}
