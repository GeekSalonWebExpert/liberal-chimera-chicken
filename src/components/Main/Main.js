import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import ReactDOM from 'react-dom';
import Core from './Core';
import './Main.css';

// Header.jsをインポート
import Header from '../Header/Header'
// Detail.jsをインポート
import Detail from '../Detail/Detail'

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {

      spot: [],
      selectedSpot: null,
      config: {
        region: [],
        attribute: [],
      },
      view: "default",
      nowLocation: []
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

  componentWillMount(){
    this.startFetching()
  }

  startFetching(){
      // name, spot, config, nowLocation を取得する
      let resource = ["name","spot","config","nowLocation"]
      resource.map(r=>{
        // fetch(`http://localhost:3001/${r}/1`)
        fetch(`http://localhost:3001/${r}`)
        .then(response => response.json())
        .then(json=>{
          console.log(json)
          this.setState({
            [r]: json
          })
        })
      })
  }


  updateView(option = {}){
    this.setState({
      view: option.view,
    })
  }


  initMap(){
    let self = this
        // Geolocation APIに対応している
        if (navigator.geolocation) {
          // 現在地を取得
          navigator.geolocation.getCurrentPosition(( position ) => {


            // 取得成功した場合、this.state.nowLocationを更新
            this.setState({
              nowLocation: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                alt: position.coords.altitude,
                accLatlng: position.coords.accuracy,
                heading: position.coords.heading
              }
            })

              // 緯度・経度を変数に格納
              var mapLatLng = new window.google.maps.LatLng(this.state.nowLocation.lat, this.state.nowLocation.lng);
              // マップオプションを変数に格納
              var mapOptions = {
                zoom : 7,          // 拡大倍率
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
          			icon:{
          				fillColor:"#ED6A5A",
          				path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          				scale: 5,
          			},
          			// label:{
          			// 	text:"現在地",
          			// 	color:"#ff7fbf
                // }
              });

              self.updateConfig()
            }
          );
        }
  }

  // チェックボックスにチェックをつける
  updateConfig(option = {}) {
    let config = this.state.config
    switch(option.category){
      case "region":
      case "attribute":
        // チェックボックスの真偽を逆にする
        config[ option.category ][ option.index ].value = !config[ option.category ][ option.index ].value
        this.setState({
          config: config
        })
      break
      default:
      break
    }

    // 場所による絞り込み
    // filterPlaceKey = ["hokkaido","tohoku"]
    let filterPlaceKey = this.state.config && this.state.config.region && this.state.config.region.filter(p=>p.value).map(p=>p.key)

    this.state.spot.forEach(s=>{
      // this.state.spot[0] ~ [this.state.spot.length -1] までの area 属性を調べる
      if(filterPlaceKey && filterPlaceKey.length > 0){
        s.isActive = filterPlaceKey.includes(s.area);
      } else {
        s.isActive = true
      }
    })

    // 属性による絞り込み
    // filterAtrKey = ["hasBench","hasRoof","hasToilet"]
    let filterAtrKey = this.state.config && this.state.config.attribute && this.state.config.attribute.filter(a=>a.value).map(a=>a.key)
    let spot = this.state.spot

    // filterAtrKeyに値がある時
    if(filterAtrKey && filterAtrKey.length > 0){
      spot = spot.map(s=>{
        filterAtrKey.forEach(key=>{
          // 例えば、this.state.spotのhasBenchの値がfalseの時、activeをfalseにする
          if(s[key] === false) s.isActive = false
        })
        //s.isActive = true
        return s
      })
    }
    this.putMarker()
  }

  putMarker(o = {}){
    // 前回のマーカー、infoWindowを消去
    if(this.markerList){
      this.markerList.forEach(m=>m.setMap(null))
      this.markerList = null
    }
    if(this.infoWindowList){
      this.infoWindowList.forEach(m=>m.setMap(null))
      this.infoWindowList = null
    }
    this.markerList = []
    this.infoWindowList = []

    // activeな場所のマーカーを作成
		// this.state.spot.filter(s=>s.active).forEach((spot)=>{ここでやっとs.activeがtrueのものしか残らないfilterをかけて
		// ピンを絞っている
    let self = this

    // this.state.spotにfilterをかけて、sがactiveなものだけ取り出し、spotに一つ一つ取り出す
    this.state.spot.filter(s=>s.isActive).forEach((spot)=>{
      let latLng = new window.google.maps.LatLng( spot.lat, spot.lng );
      let marker = new window.google.maps.Marker({
        map: this.map,
        position: latLng,
        animation: o.animation
      })

      let info = document.createElement("div")
      let spotName = document.createElement("div")
      spotName.textContent = spot.name
      let button = document.createElement("input")
      button.type = "button"
      button.value = "詳細画面へ"
      button.onclick = ()=>{
        this.setState({
          selectedSpot: spot
        })
        browserHistory.push(`/detail/${this.state.selectedSpot.id}/`)
      }
      info.appendChild(spotName)
      info.appendChild(button)

      let infoWindow = new window.google.maps.InfoWindow({
        content:info
      })

      marker.addListener("click",()=>{
        infoWindow.open(self.map,marker);
        this.route(latLng)
      })

      self.markerList = self.markerList || []
      self.infoWindowList = self.infoWindowList || []
      self.markerList.push(marker)
      self.infoWindowList.push(infoWindow)

    })
  }

  // 現在地からのルート検索
  route(latLng){
    var request = {
      origin: new window.google.maps.LatLng(this.state.nowLocation.lat, this.state.nowLocation.lng), // 出発地
      destination: latLng, // 目的地
      travelMode: window.google.maps.DirectionsTravelMode.WALKING, // 交通手段(歩行。DRIVINGの場合は車)
    };

    var d = new window.google.maps.DirectionsService(); // ルート検索オブジェクト
    if(this.directionsRenderer){
      this.directionsRenderer.setMap(null)
      this.directionsRenderer = null
    }
    this.directionsRenderer = new window.google.maps.DirectionsRenderer({ // ルート描画オブジェクト
      map: this.map, // 描画先の地図
      preserveViewport: true, // 描画後に中心点をずらさない
    });

    // ルート検索
    var self = this
    d.route(request, function(result, status){
      // OKの場合ルート描画
      if (status == window.google.maps.DirectionsStatus.OK) {
        // この関数内でIndexを参照するために、↑でselfにthisを代入
        self.directionsRenderer.setDirections(result);
      }
    })
  }


  render() {

    let star = ""
    for(let i = 0; i<3; i++) star += "⭐️"

    console.log(this.refs)
    return (
      <div className="outer" data-view={this.state.view}>

        {/*背景を押したらdefaultのviewに戻る?*/}
        {
          ["post"].includes(this.state.view)
          ?
          <span className="modal-background" onClick={()=>{ this.updateView({ view: "default" }) }}></span>
          :
          null
        }


      <div className="App">
          <Header name={"野宿びより"} />
          <div className="flex-container">
            <div className="pane">
              <div className="map" ref="map-view"></div>
            </div>
            <div className="pane">


              <button type="button" name="post" onClick={()=> {this.updateView({ view: "post" }) }} >
                投稿する
              </button>


              {/*場所から探す*/}
              <section className="nav-section">
                <h2 className="nav-section-hd">場所から探す</h2>
                <ul className="nav-list">
                  {
                    this.state.config && this.state.config.region && this.state.config.region.map((data,i)=>{
                      return (
                        <li
                          key={`place${i}`}
                          className="nav-row checkbox"
                          onClick={
                            ()=>{ this.updateConfig({
                              category: "region",
                              index: i
                            })}
                          }
                          data-checked={data.value}>
                          <input type="checkbox" className="checkbox" />
                          {data.label}
                        </li>
                      )
                    })
                  }
                </ul>
              </section>


              {/*属性から探す*/}
              <section className="nav-section">
                <h2 className="nav-section-hd">属性から探す</h2>
                <ul className="nav-list">
                  {
                    this.state.config && this.state.config.attribute && this.state.config.attribute.map((data,i)=>{
                      return (
                        <li
                          key={`option${i}`}
                          className="nav-row checkbox"
                          onClick={
                            ()=> { this.updateConfig({
                              category: "attribute",
                              index: i
                            })}
                          }
                          data-checked={data.value}>
                          <input type="checkbox" className="checkbox" />
                          {data.label}
                        </li>
                      )
                    })
                  }
                </ul>
              </section>
          </div>
        </div>


        {
          this.state.view === "post"
          ?
          <section className="post">
            <figure className= "post-image">
            </figure>
            <select name="region-name" id="region-name" ref="region-name" className="region-score">
              <option value="1">北海道</option>
              <option value="2">東北</option>
              <option value="3">関東</option>
              <option value="4">北陸・甲信越</option>
              <option value="5">東海</option>
              <option value="6">近畿</option>
              <option value="7">中国</option>
              <option value="8">中国</option>
              <option value="9">九州・沖縄</option>
            </select>
            <div className="post-place">
              <div className="post-place-name">地名</div>
              <input type="text" id="post-input-place-name" className="input-place-name"></input>
            </div>
            <div className="post-address">
              <div className="post-address-content">住所</div>
              <input type="text" id="post-input-address-content" className="input-address-content"></input>
            </div>
            <div className="post-star">
              <div className="evaluate-star">評価をつける</div>
              <div className="chage-post-star">{star}</div>
            </div>
            <div className="post-attribute">
              <div className="post-hasBench" data-checked={this.state.something ? "checked" : ""}>ベンチがある</div>
              <input type="button" className="post-hasBench" value="ベンチがある"></input>
              <input type="button" className="post-hasRoof" value="屋根がある"></input>
              <input type="button" className="post-hasToilet" value="トイレがある"></input>
            </div>
            <div className="posting">
              <input type="button" className="posting" value="投稿する"></input>
            </div>

          </section>
          :null


        }

      </div>
    </div>


    );
  }
}

export default Main;
