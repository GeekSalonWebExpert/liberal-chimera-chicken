import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import ReactDOM from 'react-dom';
import '../../css/Detail.css';

class Detail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      spot: []
    }

    this.watcher = window.setInterval(()=>{
      if(window.google.maps){
        clearInterval(this.watcher)
        this.watcher = null
        // initMapを呼び出す
        this.initMap.call(this)
      }
    },100)
  }

  initMap(){
    let self = this
        // Geolocation APIに対応している
        if (navigator.geolocation) {
          // 現在地を取得
          navigator.geolocation.getCurrentPosition(( position ) => {

            /*
            // 取得成功した場合、this.state.nowLocationを更新
            this.setState({
              nowLocation: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                alt: position.coords.altitude,
                accLatlng: position.coords.accuracy,
                heading: position.coords.heading
              }
            })*/

              // 緯度・経度を変数に格納
              var mapLatLng = new window.google.maps.LatLng(this.state.spot.lat, this.state.spot.lng);
              // マップオプションを変数に格納
              var mapOptions = {
                zoom : 15,          // 拡大倍率
                center : mapLatLng  // 緯度・経度
              };
              // マップオブジェクト作成
              self.map = new window.google.maps.Map(
                ReactDOM.findDOMNode(self.refs["map-view"]), // マップを表示する要素
                mapOptions         // マップオプション
              );
              //　マップにマーカーを表示する
              var marker = new window.google.maps.Marker({
                map : self.map,             // 対象の地図オブジェクト
                position : mapLatLng,   // 緯度・経度
                animation: window.google.maps.Animation.BOUNCE, // アニメーション
          			icon:{
          				fillColor:"#FF0000",
          				path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  //path: 'sleepingbag.png',
          				scale: 5,
          			}
              });
            }
          );
        }
  }

  componentWillMount(){
    this.fetchSpot()
  }

 fetchSpot(){
   fetch(`http://localhost:3001/spot/${this.props.params.id}/`)
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
            <div className="detail-map"　ref="map-view"></div>
        </div>
        <div className="reviewlist">
        <div className="wordofmouth">口コミ</div>
        <div className="review_info">
          <div className="user">
            <div className="user_image"></div>
            <div className="user_name">kai</div>
          </div>
          <div className="reviews">{this.state.spot.review}</div>
        </div>
        </div>
        </div>
    )
  }
}

export default Detail;
