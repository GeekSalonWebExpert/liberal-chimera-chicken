import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import ReactDOM from 'react-dom';
import Core from './Core';
import './Main.css';


const areaList = [
  "北海道",
  "東北",
  "関東",
  "北陸・甲信越",
  "東海",
  "近畿",
  "中国",
  "四国",
  "九州・沖縄"
]


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
      nowLocation: [],
    }

    this.watcher = window.setInterval(()=>{
      if(window.google.maps){
        clearInterval(this.watcher)
        this.watcher = null
        // initMapを呼び出す
        this.initMap.call(this)
      }
    },100)

    this.inputArea = this.inputArea.bind(this)
    this.inputPlace = this.inputPlace.bind(this)
    this.inputZipCode = this.inputZipCode.bind(this)
    this.inputAddress = this.inputAddress.bind(this)
    this.inputStar = this.inputStar.bind(this)
    this.posting = this.posting.bind(this)
    this.startFetching = this.startFetching.bind(this)
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
                zoom : 6.1,          // 拡大倍率
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
                // icon:{
                //   url:'sleepingbag.png',
                // }
          			// label:{
          			// 	text:"現在地",
          			// 	color:"#ff7fbf
                // }
              });

              // // 住所から緯度・経度を取得する
              // var geocoder = new window.google.maps.Geocoder();
              //
              // document.getElementById('posting').addEventListener('click', funciton() {
              //   geocodeAddress(geocoder, map);
              // });

              self.updateConfig()
            }
          );
        }
  }


  updateConfig(option = {}) {
    let config = this.state.config
    switch(option.category){
      case "region":
      case "attribute":
        // 見せかけのチェックボックス
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


  // function geocodeAddress(geocoder, resultsMap) {
  //   var address = document.getElementById('input-post-address-content').value;
  //   // resultsに緯度・経度などの情報、statusに緯度・経度取得に成功したかどうかの判定結果
  //   geocoder.geocode({'input-post-address-content': address}, function(results, status))
  //     if (status === google.maps.GeocoderStatus.OK) {
  //       resultsMap.setCenter(results[0].geometry.location);
  //       var marker = new google.maps.Marker({
  //         map: resultsMap
  //         positon: results[0].geometry.location
  //       });
  //       this.setState({
  //         postLat: results[0].geometry.location.lat(),
  //         postLng: results[0].geometry.location.lng()
  //       })
  //     } else {
  //       alert('Geocode was not successful for the following reason:' + status);
  //     }
  // }



  inputArea(e){
    const areaID = e.target.value
    this.setState({ areas: areaList[areaID]})
    //console.dir(areaID)
  }

  inputPlace(e) {
    const places = e.target.value
    this.setState({ places: places })
    //console.dir(places)
  }

  inputZipCode(e) {
    const zipcodes = e.target.value
    this.setState({ zipcodes: zipcodes })
    //console.dir(zipcodes);
  }

  inputAddress(e) {
    const addresses = e.target.value
    this.setState({ addresses: addresses })
    console.dir(addresses);
  }

  inputStar(e) {
    const stars = e.target.value
    this.setState({ stars: stars })
    console.dir(stars)
  }

  // inputing(e) {
  //   const = [area]
  // }


  inputAttribute(o) {
    /*{
      attribute: "hasBench",
      value: false
    }*/
    // this.setState({ hasBench: false })
    console.log({ [o.attribute]: o.value })
    this.setState({ [o.attribute]: o.value })
  }



  deleteSpot(spotsId) {
    fetch("http://localhost:3001/spot/"+spotsId, {
      method: "DELETE"
    })
    .then( this.startFetching )
  }


  posting() {
    let refNames = Object.keys(this.refs)
    refNames.forEach(ref=>{
      console.log(this.refs[ref].checked)
      switch(ref){
        case "map-view":
        break
        case "area-name":
          this.refs[ref].value = 0
        break
        case "input-place":
          this.refs[ref].value = ""
        break
        case "input-zipcode":
          this.refs[ref].value = ""
        break
        case "input-address":
          this.refs[ref].value = ""
        break
        case "select-star":
          this.refs[ref].value = 5
        break
        case "attribute-check":
          this.refs[ref].checked = false
        break
      }
    })

    //if(!this.state.places.length) || (!this.state.zipcodes.length) || (!this.state.addresses.length) {
    if(!this.state.places) {
      this.setState({ showError: true })
      return false
    }

    fetch("http://localhost:3001/spot", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // body: JSON.stringify({ body: this.state.inputText })
      body: JSON.stringify({
        "name": this.state.places,
        "zipcode": this.state.zipcodes,
        "address": this.state.addresses,
        "isActive": false,
        "area": this.state.areas || "北海道",
        "star": this.state.stars || 5,
        "hasToilet": this.state.hasToilet || false,
        "hasRoof": this.state.hasRoof || false,
        "hasBench": this.state.hasBench || false,
        "lat": this.state.postLat,
        "lng": this.state.postLng
      })
    })
    .then( this.startFetching )
  }


  render() {
    //let star = ""
    //for(let i = 0; i<3; i++) star += "⭐️"
    //console.log(this.refs["region-name"] && this.refs["region-name"].value)

    return (
      <div className="outer" data-view={this.state.view}>

        {/*背景を押したらdefaultのviewに戻る?*/}
        {
          ["post"].includes(this.state.view)
          ?
          //trueかfalseかによってcssを変える
          //<span className={this.state.config.attribute.hasRoof ? "modal-background checked": "modal-background"} onClick={()=>{ this.updateView({ view: "default" }) }}></span>
          <span className="modal-background" onClick={()=>{ this.updateView({ view: "default" }) }}></span>
          :
          null
        }


      <div className="App">
          <div className="header">
            <h2 className="title">野宿びより</h2>
          </div>
          <div className="flex-container">
            <div className="pane01">
              <div class="css-fukidashi">
                <button type="button" name="post" className="button-post" onClick={()=> {this.updateView({ view: "post" }) }} >
                  投稿する
                </button>
                <p class="fukidashi">あなたの利用した野宿先を投稿しませんか？</p>
              </div>

              {/*場所から探す*/}
              <section className="nav-section">
                <h2 className="nav-section-hd">場所から探す</h2>
                <ul className="nav-list">
                  {
                    this.state.config && this.state.config.region && this.state.config.region.map((data,i)=>{
                      return (
                        <li
                          key={`place${i}`}
                          className="checkbox"
                          onClick={
                            ()=>{ this.updateConfig({
                              category: "region",
                              index: i
                            })}
                          }
                          data-checked={data.value}>
                          <label>
                           <input type="checkbox" className="checkbox01-input"/>
                           <span class="checkbox01-parts">{data.label}</span>
                          </label>
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
                          <label>
                           <input type="checkbox" className="checkbox01-input"/>
                           <span class="checkbox01-parts">{data.label}</span>
                          </label>
                        </li>
                      )
                    })
                  }
                </ul>
              </section>
            </div>

            <div className="pane02">
              <div className="map" ref="map-view"></div>
            </div>
          </div>


        <div className="alert">
          {
            this.state.showError
            &&
            <div className="post-alert"></div>
          }
        </div>


        {
          this.state.view === "post"
          ?
          <section className="post">
          <div className="header">
            <h2 className="form-title">野宿場所投稿フォーム</h2>
          </div>
            <figure className= "post-image">
            </figure>
            <div class="cp_ipselect cp_sl02">
              <select ref="area-name" className="area-name" onChange={ this.inputArea }>
                <option value="" hidden>地域選択</option>
                {
                  areaList.map((area,i)=>{
                    return <option value={i}>{area}</option>
                  })
                }
              </select>
            </div>
            <div className="cp_iptxt post-place-name">
            	<input type="text" placeholder="野宿先名" id="input-place" className="text" ref="input-place" onChange={ this.inputPlace }/>
            </div>
            <div className="cp_iptxt post-address-number">
            	<input type="text" placeholder="郵便番号" id="input-zipcode" className="text" ref="input-zipcode" onChange={ this.inputZipCode }/>
            </div>
            <div className="cp_iptxt post-address-content">
            	<input type="text" placeholder="住所"/>
            </div>

            <div className="post-star">
              <div className="evaluate-star">評価をつける</div>
              {/*<div className="change-post-star">{star}</div>*/}
                <div class="cp_ipselect cp_sl02">
                  <select ref="select-star" className="select-star" onChange={ this.inputStar }>
                    <option value="" hidden>5段階評価</option>
                    <option value="5" id="5">⭐️⭐️⭐️⭐️⭐️</option>
                    <option value="4" id="4">⭐️⭐️⭐️⭐️</option>
                    <option value="3" id="3">⭐️⭐️⭐️</option>
                    <option value="2" id="2">⭐️⭐️</option>
                    <option value="1" id="1">⭐️</option>
                  </select>
                </div>
            </div>



            <ul className="post-attribute">
              {/* <div className="post-hasBench" data-checked={this.state.something ? "checked" : ""}>ベンチがある</div> */}
              {/* <input className="post-hasBench" data-checked={this.state.spot.hasBench ? "check" : "">ベンチがある</input> */}
              {
                this.state.config && this.state.config.attribute && this.state.config.attribute.map( data => {
                  return (
                    <li ref="attribute-check">
                      <input type="checkbox"  className="checkbox01-input attribute-check" onChange={ (e)=>{
                        const value = e.target.checked
                        this.inputAttribute({ attribute: data.key, value: value })
                      } }></input>
                      <label>
                       <input type="checkbox" className="checkbox01-input"/>
                       <span class="checkbox01-parts">{data.label}</span>
                      </label>
                    </li>
                  )
                })
              }
            </ul>
            <div className="posting">
              <button id="posting" className="button-post" onClick= { this.posting }>投稿する</button>
              {
                this.state.spot.map( spots => {
                  return(
                    <div className="spots" key={ spots.id }>
                      {spots.id}
                    {/*<button className="delete" onClick={ ()=>{ this.deleteSpot(spots.id) }}>削除する</button>*/}
                    </div>
                  )
                })
              }
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
