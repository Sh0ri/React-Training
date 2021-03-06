import React, { Component } from 'react';
import logo from './logo.svg';
import ReactDOM from 'react-dom';
//import './App.css';

// React Google Map
import GoogleMapReact from 'google-map-react';

// React Youtube
import YouTube from 'react-youtube';

// React Popup
import Popup from "reactjs-popup";

const myKey = "AIzaSyDsXpag-Ll1qaf40KKxgGaEeUBlIf-rCII";
const test_video_id = "kXlxlpAIzxQ";

const ElemStyle = {
  'padding-top':'0px',
};

const API = '/api/';
var CurrentUserID = 0;

//YOUTUBE
class YoutubeExample extends React.Component {
  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };

    return (
      <YouTube
      videoId={test_video_id}
      opts={opts}
      onReady={this._onReady}
      />
      );
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }
}

//GOOGLE MAP
const AnyReactComponent = ({ text }) => <div>{text}</div>;
class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
      bootstrapURLKeys={{ key: myKey }}
      defaultCenter={this.props.center}
      defaultZoom={this.props.zoom}
      >
      <AnyReactComponent
      lat={59.955413}
      lng={30.337844}
      text={'Kreyser Avrora'}
      />
      </GoogleMapReact>
      </div>
      );
  }
}

// Formulaire
class LoginForm extends Component {

  constructor () {
    super();
    this.state = {
      email: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange (evt) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.email);
    event.preventDefault();

    fetch(API + 'checkIfAccountExist?email='+this.state.email+'&password='+this.state.password)
    .then(response=>response.json())
    .then(data=>{
      if(data.result !== false) {
        window.sessionStorage.setItem("currentUser", JSON.stringify(data.result));
        console.log(data.result);
        this.props.parentMethod("UserHome");
      }
    })
  }

  CreateAccount() {
    //fetch(API + 'create-account?email=test@hotmail.com&password=testpassword')
    this.props.parentMethod("CreateAccount");
  }

  ForgotPassword() {
    this.props.parentMethod("ForgotPassword");
  }
  
  render () {
    return (
      <div className="loginmodal-container">
      <form onSubmit={this.handleSubmit}>
      <div className="input-div">
      <label className="form-label">Email :</label>
      <input type="text" name="email" onChange={this.handleChange} />
      </div>

      <br/>

      <div className="input-div">
      <label className="form-label">Password :</label>
      <input type="password" name="password" onChange={this.handleChange} />
      </div>

      <div className="submit-button-div">
      <input type="submit" value="Submit" />
      </div>

      <br/>

      <a className = "text-info" onClick={() => this.CreateAccount()}>Create account </a>
      <a className = "text-info" onClick={() => this.ForgotPassword()}> Forgot Password ?</a>
      </form>
      </div>
      );
  }
}

class CreateAccount extends Component {

  constructor () {
    super();
    this.state = {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
      secondPassword:'',

      formErrors: {email: 'is empty', firstname: 'is empty', lastname: 'is empty', password: 'is empty'},
      emailValid: false,
      firstnameValid: false,
      lastnameValid: false,
      passwordValid: false,
      secondPasswordValid: false,

      formValid: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  sendEmail(email) {
    fetch(API + 'send?to='+email)
    .then(response=>response.json())
    .then(data=>{
      console.log(data);
    })
  }

  createAccount(value) {
    console.log(value);
    fetch(API + 'create-account?email='+value.email+'&firstname='+value.firstname+'&lastname='+value.lastname+'&password='+value.password+'&verified=false')
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if(data.result === 'done') {
        alert('jobs done');
        this.sendEmail(value.email);
      }
      else
        alert('already exist');
    });
  }

  checkPasswords(first, second) {
    return first === second;
  }

  handleChange (evt) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    //console.log([evt.target.name][0]);
    this.setState({ [evt.target.name]: evt.target.value });
    var value = evt.target.value;

    switch([evt.target.name][0]) {
      case 'email':
      this.state.emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      this.state.formErrors.email = this.state.emailValid ? '' : ' is invalid';
      break;
      case 'firstname':
      this.state.firstnameValid = value.length >= 1;
      this.state.formErrors.firstname = this.state.firstnameValid ? '' : ' is empty';
      break;
      case 'lastname':
      this.state.lastnameValid = value.length >= 1;
      this.state.formErrors.lastname = this.state.lastnameValid ? '' : ' is empty';
      break;
      case 'password':
      this.state.passwordValid = value.length >= 6;
      this.state.formErrors.password = this.state.passwordValid ? '': ' is too short';
      break;
      case 'secondPassword':
      this.state.secondPasswordValid = (value.length === this.state.password.length);
      break;
      default:
      break;
    }

    if(this.state.emailValid && this.state.firstnameValid && this.state.lastnameValid && this.state.passwordValid && this.state.secondPasswordValid)
      this.setState({formValid: true});
    else
      this.setState({formValid: false});
    //if([evt.target.name][0] === 'email')
        //this.setState({emailValid: this.isEmailValid(evt.target.value)});
      }

      handleSubmit(event) {
        if(this.state.formValid === true && this.checkPasswords(this.state.password,this.state.secondPassword))
          this.createAccount({email:this.state.email,firstname:this.state.firstname,lastname:this.state.lastname,password:this.state.password});
        else
          alert('not the same passwords');
        event.preventDefault();
      }

      render() {
        return (
          <div className="loginmodal-container">
          <form onSubmit={this.handleSubmit}>

          <div className="input-div" id="Email">
          <label className="form-label">Email :</label>
          <input type="text" name="email" onChange={this.handleChange} />
          </div>

          <br/>

          <div className="input-div" id="FirstName">
          <label className="form-label">First Name :</label>
          <input type="text" name="firstname" onChange={this.handleChange} />
          </div>

          <br/>

          <div className="input-div" id="LastName">
          <label className="form-label">Last Name :</label>
          <input type="text" name="lastname" onChange={this.handleChange} />
          </div>

          <br/>

          <div className="input-div">
          <label className="form-label" id="Password">Password :</label>
          <input type="password" name="password" onChange={this.handleChange} />
          </div>

          <div className="input-div">
          <label className="form-label" id="SecondPassword">Second Password :</label>
          <input type="password" name="secondPassword" onChange={this.handleChange} />
          </div>

          <br/>

          <div className="submit-button-div">
          <input type="submit" disabled={!this.state.formValid} value="Create Account" />
          </div>

          </form>
          </div>

          );
      }
    }

    class ForgotPassword extends Component {

      constructor () {
        super();
        this.state = {
          email: '',
          isEmailValid: 'false'
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }

      sendEmail(email) {
        fetch(API + 'sendPassword?to='+email)
        .then(response=>response.json())
        .then(data=>{
          console.log(data);
        })
      }

      handleChange (evt) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    //console.log([evt.target.name][0]);
    this.setState({ [evt.target.name]: evt.target.value });
    var value = evt.target.value;

    switch([evt.target.name][0]) {
      case 'email':
      this.state.isEmailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
      break;

      default:
      break;
    }
  }

  handleSubmit(event) {

    console.log("send email");
    this.sendEmail(this.state.email);
    
    event.preventDefault();
  }

  render() {
    return (
      <div className="loginmodal-container">
      <form onSubmit={this.handleSubmit}>

      <div className="input-div" id="Email">
      <label className="form-label">Email :</label>
      <input type="text" name="email" onChange={this.handleChange} />
      </div>

      <div className="submit-button-div">
      <input type="submit" disabled={!this.state.isEmailValid} value="Send Email" />
      </div>

      </form>
      </div>

      );
  }
}

class UserHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser:null,
    };
  }

  componentWillMount() {
    console.log("Dans le didMount");
    console.log(window.sessionStorage.getItem("currentUser"));
    if(window.sessionStorage.getItem("currentUser")!==null){
      //this.setState({currentUser:JSON.parse(window.sessionStorage.getItem("currentUser"))})
      var obj = JSON.parse(window.sessionStorage.getItem("currentUser"));
      this.state.currentUser = obj;
      console.log("LE STATE");
      console.log(this.state);
    }
  }

  askNewRole() {
    this.props.parentMethod("NewRole");
  }

  render() {
    //this.setState({currentUser:window.sessionStorage.getItem("currentUser")})
    const { currentUser } = this.state;
    return (
      <div>
      <label>Hello {currentUser.firstname} !</label>
      <a className = "text-info" onClick={() => this.askNewRole()}>Ask a new role</a>
      </div>

      );
  }
}

class NewRole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser:null,
      role:"",
      region:""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  sendEmail(email) {
    console.log("le role : " + this.state.role);
    fetch(API + 'askNewRole?email='+email+'&role='+this.state.role+'&region='+this.state.region+'&password='+this.state.currentUser.password)
    .then(response=>response.json())
    .then(data=>{
      console.log(data);
    })
  }

  componentDidMount() {
    if(window.sessionStorage.getItem("currentUser")!==null){
      //this.setState({currentUser:JSON.parse(window.sessionStorage.getItem("currentUser"))})
      var obj = JSON.parse(window.sessionStorage.getItem("currentUser"));
      this.state.currentUser = obj;
      console.log(this.state);
    }
  }
  handleSubmit(event){
    this.sendEmail(this.state.currentUser.email);
    event.preventDefault();
  }

  handleChange (evt) {
    // check it out: we get the evt.target.name (which will be either "email" or "password")
    // and use it to target the key on our `state` object with the same name, using bracket syntax
    this.setState({ [evt.target.name]: evt.target.value });
  }

  render() {
    return (
      <div className="loginmodal-container">
      <form onSubmit={this.handleSubmit}>

      <label htmlFor="role">Select role:</label>
      <select class="form-control" id="role" name="role" onChange={this.handleChange}>
      <option>Role 1</option>
      <option>Role 2</option>
      <option>Role 3</option>
      <option>Role 4</option>
      </select>

      <label htmlFor="region">Select region:</label>
      <select class="form-control" id="region" name="region" onChange={this.handleChange}>
      <option>Europe</option>
      <option>Asia</option>
      <option>Africa</option>
      <option>America</option>
      </select>

      <br/>

      <div className="submit-button-div">
      <input type="submit" value="Request this role" />
      </div>

      </form>
      </div>

      );
  }
}

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value:"null",
    };
  }

  Update(elem_name,elem_props){
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

      <li class="nav-item">
      <a class="nav-link" href="#Google Map" onClick={() => this.Update("Google Map")}>Google Map</a>
      </li>

      <li class="nav-item">
      <a class="nav-link" href="#Youtube" onClick={() => this.Update("Youtube")}>Youtube</a>
      </li>

      <li class="nav-item">
      <a class="nav-link" href="#Form" onClick={() => this.Update("Form")}>Form</a>
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

  renderGoogleMap() {
    if(this.state.element === "Google Map")
      return <SimpleMap />;
  }

  renderYoutube() {
    if(this.state.element === "Youtube")
      return <YoutubeExample />;
  }

  renderForm() {
    if(this.state.element === "Form")
      return <LoginForm parentMethod={this.ChangeElem}/>;
  }

  renderCreateAccount() {
    if(this.state.element === "CreateAccount")
      return <CreateAccount />;
  }

  renderForgotPassword() {
    if(this.state.element === "ForgotPassword")
      return <ForgotPassword />;
  }

  renderUserHome() {
    if(this.state.element === "UserHome")
      return <UserHome parentMethod={this.ChangeElem}/>;
  }

  renderNewRole() {
    if(this.state.element === "NewRole")
      return <NewRole parentMethod={this.ChangeElem}/>;
  }


  render() {
    return (
      <div className="App">
      {this.renderNavBar()}
      {this.renderElem1()}
      {this.renderElem2()}
      {this.renderGoogleMap()}
      {this.renderYoutube()}
      {this.renderForm()}
      {this.renderCreateAccount()}
      {this.renderForgotPassword()}
      {this.renderUserHome()}
      {this.renderNewRole()}
      </div>
      );
  }
}

export default App;
