import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import './Detail.css';

class Detail extends Component {
  constructor() {
    super()
  }
  render() {
    console.log(this.refs)

    return (
      <div className="list">
        <div className="list_name">道の駅 五霞</div>
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
        <div className="location">
          <div className="location_info">
            <div className="address">住所</div>
            <div className="location_address">〒306-0304 茨城県 猿島郡五霞町幸主１８－１</div>
          </div>
            <div className="detail-map"></div>
        </div>
        <div className="reviewlist">
          <div className="wordofmouth">口コミ</div>
          <div className="review_info">
            <div className="user">
              <div className="user_image"></div>
              <div className="user_name">kai</div>
            </div>
             <div className="reviews"></div>
          </div>
        </div>
        </div>
    )
  }
}

export default Detail;
