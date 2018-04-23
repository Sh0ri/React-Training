import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const ElemStyle = {
  'padding-top':'0px',
};

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:"null",
    };
  }

  Update(elem_name){
    this.props.parentMethod(elem_name);
  }
  render() {
    return (
      <div className="NavBar" id="#">
      <nav class="navbar navbar-expand-lg sticky-top navbar-light bg-light">
      <a class="navbar-brand" href="/">React-Training</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">

      <li class="nav-item">
      <a class="nav-link" href="#Elem1" onClick={() => this.Update("Elem1")}>Elem1</a>
      </li>

      <li class="nav-item">
      <a class="nav-link" href="#Elem2" onClick={() => this.Update("Elem2")}>Elem2</a>
      </li>

      </ul>

      </div>
      </nav>
      <a style={{position:'fixed',
        right:'20px',
        top:'20px'}} href="#">TOP</a>
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
      <div className="Elem1"  style={ElemStyle}>
      <h1>ELEM1</h1>
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
      <div className="Elem2"  style={ElemStyle}>
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
      element:"Elem1",
    };
    this.ChangeElem = this.ChangeElem.bind(this);
  }

  ChangeElem(elem_name) {
    var tempState = this.state;
    console.log(tempState);
    tempState.element = elem_name;
    this.setState(tempState);
  }

  renderNavBar(i) {
    return <NavBar parentMethod={this.ChangeElem}/>;
  }
  renderElem1() {
    if(this.state.element === "Elem1")
      return <Elem1 />;
  }
  renderElem2() {
    if(this.state.element === "Elem2")
      return <Elem2 />;
  }


  render() {
    return (
      <div className="App">
      {this.renderNavBar()}
      {this.renderElem1()}
      {this.renderElem2()}
      </div>
      );
  }
}

export default App;
