import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import './Detail.css';

class Detail extends Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div className="list">
        <div className="list_name">道の駅　五霞</div>
          <div className="list_contents">
            <div className="list_image"></div>
            <div className="list_info">
              <div className = "list_evaluation">
                <div className= "list_star">⭐️⭐️⭐️⭐️⭐️</div>
                <div className="list_rate">5.0</div>
              </div>
              <ul className="list_searchword">
                <li className="list_searchword_item_first">トイレあり</li>
                <li className="list_searchword_item">ベンチあり</li>
                <li className="list_searchword_item">屋根あり</li>
              </ul>
            </div>
          </div>
        <Link to={`/Full/aaa/`}>詳細ページへ</Link>
      </div>
    )
  }
}

export default Detail;
