import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import ReactDOM from 'react-dom';
import '../../css/Detail.css';
import image from '../Image/sleepingbag.png'
import sleep from "../Image/sleep.png"
import noImage from "../Image/noimage.png"



class Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      spot: {
        id: "",
        name: "",
        zipcode: "",
        address: "",
        area: "",
        isActive: "",
        image: "",
        star: [],
        hasToilet: "",
        hasRoof: "",
        hasBench: "",
        lat: "",
        lng: "",
        review: [],
      }
    }

    this.watcher = window.setInterval(()=>{
      if(window.google.maps){
        clearInterval(this.watcher)
        this.watcher = null
        // initMapを呼び出す
        this.initMap.call(this)
      }
    },100)

    this.fetchSpot = this.fetchSpot.bind(this)
    this.inputReview = this.inputReview.bind(this)
    this.deleteInput = this.deleteInput.bind(this)
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
                animation : window.google.maps.Animation.BOUNCE, // アニメーション
                icon : image
          			// icon:{
          			// 	fillColor:"#FF0000",
          			// 	path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                //   //path: 'sleepingbag.png',
          			// 	scale: 5,
          			// }
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

  inputReview(e) {
    const reviews = e.target.value
    var totals = this.state.spot.review.push(reviews)
    this.setState({ reviews: this.state.spot.review })
  }

  deleteInput() {
    let refNames = Object.keys(this.refs)
    refNames.forEach(ref=>{
      switch (ref) {
        case "detail-review":
          this.refs[ref].value = ""
        break;
        default:
      }
    })
  }

  postReview(postId) {
    fetch("http://localhost:3001/spot/" + postId, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "name": this.state.spot.name,
        "zipcode": this.state.spot.zipcode,
        "address": this.state.spot.address,
        "isActive": false,
        "area": this.state.spot.area,
        "star": this.state.spot.star,
        "hasToilet": this.state.spot.hasToilet,
        "hasRoof": this.state.spot.hasRoof,
        "hasBench": this.state.spot.hasBench,
        "lat": this.state.spot.lat,
        "lng": this.state.spot.lng,
        "review": this.state.reviews
      })
    })
    .then( this.fetchSpot )
    .then( this.deleteInput )
  }

  render() {
    console.log(this.state.spot.hasToilet)
    let star = ""
    for(let i = 0; i<this.state.spot.score; i++) star += "⭐️"

    return (
      <section className="detail">
        <header className="detail-header">
        <div className="header-pane">
          <div className="title">野宿びより</div>
          <img  className="image-sleep" src={sleep}></img>
        </div>
        </header>
        <div className="detail-name">{this.state.spot.name}</div>

        <div className="detail-pane">
          <img  className="image" src={noImage}></img>
            <div className="detail-contents">
              <div className="detail-info">
                {/*
                <div className = "detail_evaluation">
                   <div className= "detail_star">{star}</div>
                   <div className="detail_rate">{this.state.spot.score}</div>
                </div>
                */}
                <div className="detail-facility">設備状況</div>
                  <ul className="detail-searchword">
                    <li className={this.state.spot.hasToilet ? "hasToilet": "noToilet"}>トイレ</li>
                    <li className={this.state.spot.hasBench ? "hasBench": "noBench"}>ベンチ</li>
                    <li className={this.state.spot.hasRoof ? "hasRoof": "noRoof"}>屋根</li>
                  </ul>
                  <div className="location">
                      <div className="address">住所</div>
                      <div className="location-address">{this.state.spot.address}</div>
                  </div>
              </div>
            </div>
        </div>

        <div className="detail-map"　ref="map-view"></div>
        <div className="reviewlist">
          <div className="wordofmouth">レビュー</div>
          <div className="reviews">
            {
              this.state.spot.review.length　=== 0
              ?
              <div>レビューがありません</div>
              :
              this.state.spot.review.map( reviewsList => {
                return(
                  <div className="reviewsList">{reviewsList}
                  <p className="line"></p>
                  </div>
                )
              })
            }
          </div>
          <div className="detail-post">
            <button type="button" name="post" className="plus-review" placeholder="+" onClick={()=> {this.postReview(this.state.spot.id) }} >+</button>
            <textarea ref="detail-review" className="detail-review" rows="5" cols="90" placeholder="レビューを投稿してください" onChange={ this.inputReview }></textarea>
          </div>

        </div>
      </section>
    )
  }
}

export default Detail;
