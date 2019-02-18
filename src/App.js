import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import './App.css';

// Main.jsをインポート
import Main from './components/Main/Main'
// Header.jsをインポート
import Header from './components/Header/Header'
// Map.jsをインポート
import Map from './components/Map/Map'
// Search.jsをインポート
import Search from './components/Search/Search'
// Detail.jsをインポート
import Detail from './components/Detail/Detail'
// Full.jsをインポート
import Full from './components/Full/Full'


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
        <Route path="/full/:id" component={Full}/>
      </Router>
    )
  }
}

export default App;
