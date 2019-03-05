import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import './App.css';


// Main.jsをインポート
import Main from './js/Main/Main'
// Detail.jsをインポート
import Detail from './js/Detail/Detail'


class App extends Component {
  constructor() {
    super()
  }
  render() {
    // React-router
    return (
      <Router history={browserHistory}>
      	<Route path="/" component={Main}/>
      	<Route path="/detail/:id/" component={Detail}/>
      </Router>
    )
  }
}

let application = new App()

window.initMap = ()=>{
	application.trigger("invocationMap")
}

export default App;
