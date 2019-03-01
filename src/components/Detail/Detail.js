import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import './Detail.css';

class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSpot: [],
      spot: []
    }
  }

componentWillMount(){
  this.fetchSpot()
}

 fetchSpot(){
   fetch("http://localhost:3001/spot/this.state.selectedSpot.id")
   .then( response => response.json() )
   .then( json => {
     this.setState({ spot: json })
   })
 }

 render() {
    console.log(this.refs)
    let star = ""
    for(let i = 0; i<this.state.spot.score; i++) star += "⭐️"

    return (
      <div className="list">
        <div className="list_name">{this.state.spot.name}</div>
          <div className="list_contents">
            <div className="list_image"></div>
            <div className="list_info">
              <div className = "list_evaluation">
                <div className= "list_star">{star}</div>
                <div className="list_rate">{this.state.spot.score}</div>
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
            <div className="location_address">{this.state.spot.address}</div>
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
