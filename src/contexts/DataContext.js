import React, { Component } from 'react'
import Config from '../config'; 
import dayjs from "dayjs";

const Context = React.createContext({
  date: "",
  denominations: [],
  safeCount: [],
  isLoaded: false,
  error: null
})

export class DataProvider extends Component {
  state = {
    date: dayjs(Date.now()).format("MM/DD/YYYY"),
    denominations: [],
    safeCount: [],
    isLoaded: false,
    error: null
  }

  render() {
    const pipe = {
      date: this.state.date,
      denominations: this.state.denominations,
      safeCount: this.state.safeCount,
      isLoaded: this.state.isLoaded,
      error: this.state.error
    }
    return (
      <Context.Provider value={pipe}>{this.props.children}</Context.Provider>
    )
  }
}

export default Context; 
