import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import './App.css';

// Main.jsをインポート
import Main from './Main'
// Header.jsをインポート
import Header from './Header/Header'
// Map.jsをインポート
import Map from './Map/Map'
// Search.jsをインポート
import Search from './Search/Search'
// Detail.jsをインポート
import Detail from './Detail'


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

export default App;
