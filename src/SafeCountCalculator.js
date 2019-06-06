import React, { Component } from 'react'

export default class SafeCountCalculator extends Component {
  
  constructor(props){
    super(props)
    this.state = {
      currency: [ 
        { 
          name: "Quarters",  
          count: 0,
          multiplier: 10,
        },
        {
          name: 'Dimes',
          count: 0,
          multiplier: 5,
        },
        {
          name: 'Nickles',
          count: 0,
          multiplier: 2,
        },
        {
          name: 'Pennies',
          count: 0,
          multiplier: .5,
        },
        {
          name: 'Ones',
          count: 0,
          multiplier: 1,
        },
        {
          name: 'Fives',
          count: 0,
          multiplier: 5,
        }
      ] 
    }
  }

  updateCount = (i, e) => {
    const currency = [...this.state.currency]
    currency[i].count = e.target.value;
    this.setState({
      currency 
    })
  }
  
  render() {
    return (
      <div>
        {this.state.currency.map((den, i) =>
          <div key= {i}>
            <span>
              {den.name} 
              <input type="number" min="0" max="50" value= {this.state.currency[i].count} onChange={(e) => this.updateCount(i, e)} /> 
              {(i <4) ? "roll(s)" : "bill(s)"}
              Total: {den.count * den.multiplier}
            </span>
          </div>
        )}
      <div>
        Grand Total: {this.state.currency.reduce((accumulator, currentValue) => accumulator + (currentValue.count * currentValue.multiplier), 0)}
      </div>
     </div> 
    )
  }
}
