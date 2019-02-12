import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import './Main.css';

// Header.jsをインポート
import Header from './Header/Header'
// Map.jsをインポート
import Map from './Map/Map'
// Search.jsをインポート
import Search from './Search/Search'

class Main extends Component {
  constructor() {
    super()
    this.state = {
      name: "タイトル"
    }
  }
  render() {
    return (
      <div className="App">
          <Header name={this.state.name} />
          <div className="flex-container">
            <div className="pane">
              <Map />
            </div>
            <div className="pane">
              <Search />
            </div>
          </div>
            <Link to={`/detail/aaa/`}>詳細ページへ</Link>
          {/*<Link to={`/detail/aaa/`}>詳細ページへ</Link>*/}
      </div>
    );
  }
}


export default Main;
