import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ScrollUpButton from "react-scroll-up-button";

class NavBar extends Component {
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
      <div className="NavBar">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="/">React-Training</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">

      <li class="nav-item">
      <a class="nav-link" href="#Elem1">Elem1</a>
      </li>

      <li class="nav-item">
      <a class="nav-link" href="#Elem2">Elem2</a>
      </li>

      </ul>

      </div>
      </nav>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      </div>

      );
  }
}

class Elem1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:"null",
    };
  }

  render() {
    return (
      <div className="Elem1" id="Elem1">
      <h1>ELEM1</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      </div>

      );
  }
}

class Elem2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:"null",
    };
  }

  render() {
    return (
      <div className="Elem2" id="Elem2">
      <h1>ELEM2</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      <h1>HEHEHEHEHE</h1>
      </div>

      );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:null,
    };
  }
  renderNavBar(i) {
    return <NavBar parentMethod={this.AddOne}/>;
  }
  renderElem1() {
    return <Elem1 />;
  }
  renderElem2() {
    return <Elem2 />;
  }


  render() {
    return (
      <div className="App">
      {this.renderNavBar()}
      {this.renderElem1()}
      {this.renderElem2()}
      <ScrollUpButton />
      </div>
      );
  }
}

export default App;
