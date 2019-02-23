import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import './Main.css';
import ReactDOM from 'react-dom';
import Core from './Core'

// Header.jsをインポート
import Header from '../Header/Header'
// Map.jsをインポート
// import Map from '../Map/Map'
// Search.jsをインポート
// import Search from '../Search/Search'

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {

      name: "野宿びより",

      spot: [
        { id: 1, name: "道の駅五霞", address: "〒306-0304 茨城県猿島群五霞町幸主18-1", place: "関東", area: "kanto",  image: 0 , score: 5, hasToilet: 1, hasRoof: 1, hasBench: 1, lat: 36.115163, lng: 139.734986},
        { id: 2, name: "道の駅 YOU・遊・もり", address: "〒049-2311 北海道茅部郡森町上台町326-18", place: "北海道", area: "hokkaido" ,image: 0, score: 5, hasToilet: 1, hasRoof: 1, hasBench: 0, lat: 42.102251, lng: 140.568183},
        { id: 3, name: "道の駅 厳美渓谷", address: "〒021-0101 岩手県一関市厳美町沖野々220-1", place: "東北", area: "tohoku",image: 0, score: 5, hasToilet: 1, hasRoof: 1, hasBench: 0, lat: 38.946439, lng: 141.052885},
        { id: 4, name: "道の駅　きららあじす", address: "〒754-1277　山口県山口市阿知須509-88", place: "中国", area: "tyugoku",image: 0, score: 5, hasToilet: 1, hasRoof: 1, hasBench: 0, lat: 34.012855, lng: 131.369561},
        { id: 5, name: "道の駅 させぼっくす", address: "〒858-0917 長崎県佐世保市愛宕町11", place: "九州・沖縄", area: "kyusyuokinawa",image: 0, score: 5, hasToilet: 1, hasRoof: 1, hasBench: 1, lat: 33.201749, lng: 129.671847}
      ],

      selectedSpot: null, // 詳細,レビュー画面に対応するspotをセットする
      config: {
        place: [
          { label: "北海道", key: "hokkaido", value: false },
          { label: "東北", key: "tohoku", value: false },
          { label: "関東", key: "kanto", value: false },
          { label: "北陸・甲信越", key: "hokurikukousinetu", value: false },
          { label: "東海", key: "tokai", value: false },
          { label: "近畿", key: "kinki", value: false },
          { label: "中国", key: "tyugoku", value: false },
          { label: "四国", key: "sikoku", value: false },
          { label: "九州・沖縄", key: "kyusyuokinawa", value: false }
        ],
        attribute: [
          { label: "ベンチがある", key: "hasBench", value: false },
          { label: "屋根がある", key: "hasRoof", value: false},
          { label: "トイレがある", key: "hasToilet", value: false},
        ]
      }
    }

      this.watcher = window.setInterval(()=>{
        if(window.google.maps){
          clearInterval(this.watcher)
          this.watcher = null
          // initMapを表示する
          this.initMap.call(this)
        }
      },100)
  }


  initMap(){
    let self = this
        // Geolocation APIに対応している
        if (navigator.geolocation) {
          // 現在地を取得
          navigator.geolocation.getCurrentPosition(
            // 取得成功した場合
            function(position) {
              // 緯度・経度を変数に格納
              var mapLatLng = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
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
          				fillColor:"#FF0000",
          				path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
          				scale: 5,
          			},
          			// label:{
          			// 	text:"現在地",
          			// 	color:"#ff7fbf
                // }
              });

              self.updateConfig()

            },

            // 取得失敗した場合
            function(error) {
              // エラーメッセージを表示
              switch(error.code) {
                case 1: // PERMISSION_DENIED
                  alert("位置情報の利用が許可されていません");
                  break;
                case 2: // POSITION_UNAVAILABLE
                  alert("現在位置が取得できませんでした");
                  break;
                case 3: // TIMEOUT
                  alert("タイムアウトになりました");
                  break;
                default:
                  alert("その他のエラー(エラーコード:"+error.code+")");
                  break;
              }
            }
          );
        // Geolocation APIに対応していない
        } else {
          alert("この端末では位置情報が取得できません");
        }
  }


  // チェックボックスにチェックをつける
  updateConfig(option = {}) {
    let config = this.state.config
    switch(option.category){
      case "place":
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
    let filterPlaceKey = this.state.config.place.filter(p=>p.value).map(p=>p.key)
  　console.log(filterPlaceKey)

    this.state.spot.forEach(s=>{
      // this.state.spot[0] ~ [this.state.spot.length -1] までの area 属性を調べる
      if(filterPlaceKey.length > 0){
        s.active = filterPlaceKey.includes(s.area);
        console.log(s.active)
      } else {
        s.active = true
      }
    })

    // 属性による絞り込み
    // filterAtrKey = ["hasBench","hasRoof","hasToilet"]
    let filterAtrKey = this.state.config.attribute.filter(a=>a.value).map(a=>a.key)
    let spot = this.state.spot
    // filterAtrKeyに値がある時
    if(filterAtrKey.length > 0){
      spot = spot.map(s=>{
        let active = true
        filterAtrKey.forEach(key=>{
          // 例えば、this.state.spotのhasBenchの値が0の時、activeをfalseにする
          if(s[key] === 0) active = false
        })
        s.active = active
        return s
      })
    } else {
      spot = spot.map(s=>{
        s.active = true
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
    this.state.spot.filter(s=>s.active).forEach((spot)=>{
      console.log(spot)
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
      button.onClick = ()=>{this.updateView({view: "detail", data: spot})}
      info.appendChild(spotName)
      info.appendChild(button)

      let infoWindow = new window.google.maps.InfoWindow({
        content:info
      })

      marker.addListener("click",()=>{
        infoWindow.open(self.map,marker);
        //this.route(latLng)
      })

      self.markerList = self.markerList || []
      self.infoWindowList = self.infoWindowList || []
      self.markerList.push(marker)
      self.infoWindowList.push(infoWindow)

    })
  }


  render() {
    return (
      <div className="App">
          <Header name={this.state.name} />
          <div className="flex-container">
            <div className="pane">
              <div className="map" ref="map-view"></div>
            </div>
            <div className="pane">


              {/*場所から探す*/}
              <section className="nav-section">
                <h2 className="nav-section-hd">場所から探す</h2>
                <ul className="nav-list">
                  {
                    this.state.config.place.map((data,i)=>{
                      return (
                        <li
                          key={`place${i}`}
                          className="nav-row checkbox"
                          onClick={
                            ()=>{ this.updateConfig({
                              category: "place",
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
                    this.state.config.attribute.map((data,i)=>{
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
            <Link to={`/detail/id/`}>詳細ページへ</Link>
      </div>
    );
  }
}

export default Main;
