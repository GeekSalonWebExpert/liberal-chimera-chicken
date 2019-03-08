import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import ReactDOM from 'react-dom';
import Core from './Core';
import '../../css/Main.css';


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

const inputList = [
  "places",
  "zipcodes",
  "addresses",
  "stars"
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
    this.inputText = this.inputText.bind(this)
    this.inputReview = this.inputReview.bind(this)
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
                animation: window.google.maps.Animation.BOUNCE, // アニメーション
          			icon:{
          				fillColor:"#FF0000",
          				path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                  //path: 'sleepingbag.png',
          				scale: 5,
          			}
                // label:{
          			// 	text:"現在地",
          			// 	color:"#ff7fbf
                // }
              });

              // // 住所から緯度・経度を取得する
              // var geocoder = new window.google.maps.Geocoder();
              //
              // document.getElementById('posting').addEventListener('click', function() {
              //   geocoder.geocode({
              //     places: document.getElementById('places').value
              //   },function(results,status){
              //     if (status !== 'OK') {
              //       alert('Failed: ' + status);
              //       return;
              //     }
              //     // resultsに緯度・経度などの情報、statusに緯度・経度取得に成功したかどうかの判定結果
              //     // results[0].geometry.location
              //     if (results[0]) {
              //       this.setState({
              //         postLat: results[0].geometry.location.lat(),
              //         postLng: results[0].geometry.location.lng()
              //       })
              //     } else {
              //       alert('No results found');
              //       return
              //     }
              //   });
              // });

              self.updateConfig()
            }
          );
        }
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


  inputArea(e){
    const areaID = e.target.value
    this.setState({ areas: areaList[areaID]})
    //console.dir(areaID)
  }

  inputText(o) {
    console.log({ [o.input]: o.value })
    this.setState({ [o.input]: o.value })
  }

  inputAttribute(o) {
    /*{
      attribute: "hasBench",
      value: false
    }*/
    // this.setState({ hasBench: false })
    console.log({ [o.attribute]: o.value })
    this.setState({ [o.attribute]: o.value })
  }

  inputReview(e) {
    const reviews = e.target.value
    console.dir(reviews)
    this.setState({ reviews: reviews })
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
        case "form-review":
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
    {/*if(!this.state.places) {
      this.setState({ showError: true })
      return false
    }*/}

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
        "lng": this.state.postLng,
        "review": this.state.reviews
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
              <div className="css-fukidashi">
                <button type="button" name="post" className="button-post" onClick={()=> {this.updateView({ view: "post" }) }} >
                  投稿する
                </button>
                <p className="fukidashi">あなたの利用した野宿先を投稿しませんか？</p>
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
                          className="nav-row checkbox"
                          onClick={
                            ()=>{ this.updateConfig({
                              category: "region",
                              index: i
                            })}
                          }
                          data-checked={data.value}>
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
                          {data.label}
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
            <div className="header-post">
              <h1 className="form-title">野宿場所 & レビュー 投稿フォーム</h1>
            </div>

            <div className="main-post">
              <div className="form-contents">
                <h1 className="contents-title">野宿先情報を記入する<span>※必須</span></h1>
                <p className="line"> </p>
                <p className="txt-contents">◼︎ 下記の項目について記入してください。</p>

                <select ref="area-name" className="area-name" onChange={ this.inputArea }>
                {
                  areaList.map((area,i)=>{
                    return <option value={i}>{area}</option>
                  })
                }
          　　　</select>

                <div className="post-place">
                  <input type="text" id="input-place" className="information-form" ref="input-place" placeholder="野宿先名称"  onChange={ (e)=>{
                    const value = e.target.value
                    this.inputText({ input: inputList[0], value: value })
                  } }></input>
                </div>
                <div className="post-address">
                  <input type="text" id="input-zipcode" className="information-form" ref="input-zipcode" placeholder="〒郵便番号" onChange={ (e)=>{
                    const value = e.target.value
                    this.inputText({ input: inputList[1], value: value })
                  } }></input>
                </div>

                <div className="post-address">
                  <input type="text" id="input-address" className="information-form" ref="input-address" placeholder="住所" onChange={ (e)=>{
                    const value = e.target.value
                    this.inputText({ input: inputList[2], value: value })
                  } }></input>
                </div>

                <p className="txt-contents">◼︎ 当てはまる項目を選択してください。</p>
                <ul className="post-attribute">
                  {
                    this.state.config && this.state.config.attribute && this.state.config.attribute.map( data => {
                      return (
                        <li ref="attribute-check" className="check-post">
                          <input type="checkbox"  className="attribute-check" onChange={ (e)=>{
                            const value = e.target.checked
                            this.inputAttribute({ attribute: data.key, value: value })
                          } }></input>
                           {data.label}
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>

            <div className="form-contents rating">
              <h1 className="contents-title">評価する<span>※必須</span></h1>
              <p className="line"> </p>
              <p className="txt-contents">◼︎ 野宿先を総合評価5点満点で採点してください。☆の部分をクリックすると、右側に1〜5の点数が表示されます。</p>
              <div class="cp_ipselect cp_sl02">
                <select ref="select-star" className="select-star" onChange={ (e)=>{
                  const value = e.target.value
                  this.inputText({ input: inputList[3], value: value })
                } }>
                  <option value="" hidden>5段階評価</option>
                  <option value="5" id="5">⭐️⭐️⭐️⭐️⭐️</option>
                  <option value="4" id="4">⭐️⭐️⭐️⭐️</option>
                  <option value="3" id="3">⭐️⭐️⭐️</option>
                  <option value="2" id="2">⭐️⭐️</option>
                  <option value="1" id="1">⭐️</option>
                </select>
              </div>
            </div>

            <div className="form-contents">
              <h1 className="contents-title">レビューする</h1>
              <p className="line"> </p>
              <textarea ref="form-review" className="form-review" rows="10" cols="60" placeholder="野宿先を利用した感想を記入してください。" onChange={ this.inputReview }></textarea>
            </div>

            <div className="form-contents">
              <h1 className="contents-title">画像をアップロードする</h1>
              <p className="line"> </p>
              <p className="txt-contents">◼︎ レビューに関連する画像ファイルを1点アップロードすることができます。</p>
              <div className="form-upload">
                <button id="upload" className="upload">アップロードする</button>
              </div>
            </div>

            <div className="message-space">
              <p className="form-message">野宿びよりは、『ご自身が実際に利用』した信頼度の高いレビューで、</p>
              <p className="form-message">お互いに「野宿者の役に立つ生きた情報」を共有する事を目的としたサイトです。</p>
              <p className="form-message">必ず、ご自身が実際に使用したものについてレビューしてください。</p>
            </div>

            <div className="posting">
              <button id="posting" className="button-post" onClick= { this.posting }>入力内容を投稿する</button>
              {
                this.state.spot.map( spots => {
                  return(
                    <div className="spots" key={ spots.id }>
                      {spots.id}
                    <button className="delete" onClick={ ()=>{ this.deleteSpot(spots.id) }}>削除する</button>
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
