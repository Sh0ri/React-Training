import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:"null",
    };
  }

  Update(){
    this.props.parentMethod(this.props.value);
  }
  render() {
    return (
      <div className="Test">
      <button onClick={() => this.Update()} >TEST {this.props.value}</button>
      </div>
      );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number:[0,1],
    };

    this.AddOne = this.AddOne.bind(this);
  }
  renderTest(i) {
    return <Test value={i} parentMethod={this.AddOne}/>;
  }
  AddOne(i) {
    console.log("Add one called");
    var tempState = this.state;
    console.log(tempState);
    tempState.number.push(i);
    this.setState(tempState);
    //number.map(temp=> console.log(temp));
    //number.push(i);
    //console.log(number);
    //this.setState({ number: number })
  }

  render() {
    const { number } = this.state;
    return (
      <div className="App">
      {number.map(temp => this.renderTest(temp))}
      </div>
      );
  }
}

export default App;
