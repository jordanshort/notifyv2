import React, { Component } from 'react';
import './App.css';
import NoteContainer from './components/NoteContainer';
import notify from './scripts/helpers/notify';
import './components/notify.css';

class App extends Component {
  componentDidMount(){
    console.log(notify);
  }

  handleSuccess(){
    notify.success("This is a success message");
  }
  handleDanger(){
    notify.alert("This is an alert message");
  }
  handleWarning(){
    notify.warning("This is a warning message");
  }
  handleInfo(){
    notify.info("This is an info message");
  }
  render() {
    return (
      <div className="App">
        <button onClick={this.handleSuccess}>Success</button>
        <button onClick={this.handleDanger}>Danger</button>
        <button onClick={this.handleWarning}>Warning</button>
        <button onClick={this.handleInfo}>Info</button>

        <NoteContainer />

      </div>
    );
  }
}

export default App;
