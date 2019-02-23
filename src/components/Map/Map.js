// import React, {Component} from 'react';
//
// import ReactDOM from 'react-dom';
// import './Map.css';
// import Core from './Core'
//
// class Map extends Core {
//   constructor(props) {
//     super(props)
//
//     this.state = {
//       spot: [
//         { id: 1, name: "道の駅五霞", address: "〒306-0304 茨城県猿島群五霞町幸主18-1", place: "関東",  image: 0 , score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: true, lat: 36.115163, lng: 139.734986},
//         { id: 2, name: "道の駅 YOU・遊・もり", address: "〒049-2311 北海道茅部郡森町上台町326-18", place: "北海道", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: false, lat: 42.102251, lng: 140.568183},
//         { id: 3, name: "道の駅 厳美渓谷", address: "〒021-0101 岩手県一関市厳美町沖野々220-1", place: "東北", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: true, lat: 38.946439, lng: 141.052885},
//         { id: 4, name: "道の駅　きららあじす", address: "〒754-1277　山口県山口市阿知須509-88", place: "中国", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: false, lat: 34.012855, lng: 131.369561},
//         { id: 5, name: "道の駅 させぼっくす", address: "〒858-0917 長崎県佐世保市愛宕町11", place: "九州・沖縄", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: true, lat: 33.201749, lng: 129.671847}
//       ]
//     }
//
//     this.watcher = window.setInterval(()=>{
//       if(window.google.maps){
//         clearInterval(this.watcher)
//         this.watcher = null
//         this.initMap.call(this)
//       }
//     },100)
//
//
//   }
//
//   initMap(){
//     let self = this
//         // Geolocation APIに対応している
//         if (navigator.geolocation) {
//           // 現在地を取得
//           navigator.geolocation.getCurrentPosition(
//             // 取得成功した場合
//             function(position) {
//               // 緯度・経度を変数に格納
//               var mapLatLng = new window.google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//               // マップオプションを変数に格納
//               var mapOptions = {
//                 zoom : 15,          // 拡大倍率
//                 center : mapLatLng  // 緯度・経度
//               };
//               // マップオブジェクト作成
//               self.map = new window.google.maps.Map(
//                 ReactDOM.findDOMNode(self.refs["map-view"]), // マップを表示する要素
//                 mapOptions         // マップオプション
//               );
//               //　マップにマーカーを表示する
//               var marker = new window.google.maps.Marker({
//                 map : self.map,             // 対象の地図オブジェクト
//                 position : mapLatLng   // 緯度・経度
//               });
//
//               self.state.spot.forEach((spot)=>{
//                 let latLng = new window.google.maps.LatLng (spot.lat, spot.lng);
//                 let marker = new window.google.maps.Marker({
//                   map: self.map,
//                   position: latLng
//                 })
//               })
//             },
//
//             // 取得失敗した場合
//             function(error) {
//               // エラーメッセージを表示
//               switch(error.code) {
//                 case 1: // PERMISSION_DENIED
//                   alert("位置情報の利用が許可されていません");
//                   break;
//                 case 2: // POSITION_UNAVAILABLE
//                   alert("現在位置が取得できませんでした");
//                   break;
//                 case 3: // TIMEOUT
//                   alert("タイムアウトになりました");
//                   break;
//                 default:
//                   alert("その他のエラー(エラーコード:"+error.code+")");
//                   break;
//               }
//             }
//           );
//         // Geolocation APIに対応していない
//         } else {
//           alert("この端末では位置情報が取得できません");
//         }
//   }
//
//   render() {
//     return (
//       <div className="container">
//         <div className="map" ref="map-view"></div>
//       </div>
//     );
//   }
// }
//
// export default Map;
