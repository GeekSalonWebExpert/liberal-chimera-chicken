import React, {Component} from 'react';

import ReactDOM from 'react-dom';
import './Map.css';
import Core from './Core'

class Map extends Core {
  constructor() {
    super()
    console.log("gitの確認")
    this.watcher = window.setInterval(()=>{
      if(window.google.maps){
        clearInterval(this.watcher)
        this.watcher = null
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
                zoom : 15,          // 拡大倍率
                center : mapLatLng  // 緯度・経度
              };
              // マップオブジェクト作成
              this.map = new window.google.maps.Map(
                ReactDOM.findDOMNode(self.refs["map-view"]), // マップを表示する要素
                mapOptions         // マップオプション
              );
              //　マップにマーカーを表示する
              var marker = new window.google.maps.Marker({
                map : map,             // 対象の地図オブジェクト
                position : mapLatLng   // 緯度・経度
              });
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
  render() {
    return (
      <div className="container">


        <div className="map" ref="map-view">地図</div>
      </div>
    );
  }
}

export default Map;
