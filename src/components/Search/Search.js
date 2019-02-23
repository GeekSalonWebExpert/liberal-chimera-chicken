// import React, {Component} from 'react';
// import './Search.css';
//
// class Search extends Component {
//   constructor() {
//     super()
//
//       this.state = {
//
//         spot: [
//           { id: 1, name: "道の駅五霞", address: "〒306-0304 茨城県猿島群五霞町幸主18-1", place: "関東",  image: 0 , score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: true, lat: 36.115163, lng: 139.734986},
//           { id: 2, name: "道の駅 YOU・遊・もり", address: "〒049-2311 北海道茅部郡森町上台町326-18", place: "北海道", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: false, lat: 42.102251, lng: 140.568183},
//           { id: 3, name: "道の駅 厳美渓谷", address: "〒021-0101 岩手県一関市厳美町沖野々220-1", place: "東北", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: true, lat: 38.946439, lng: 141.052885},
//           { id: 4, name: "道の駅　きららあじす", address: "〒754-1277　山口県山口市阿知須509-88", place: "中国", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: false, lat: 34.012855, lng: 131.369561},
//           { id: 5, name: "道の駅 させぼっくす", address: "〒858-0917 長崎県佐世保市愛宕町11", place: "九州・沖縄", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: true, lat: 33.201749, lng: 129.671847}
//         ],
//
//         config: {
//           place: [
//             { label: "北海道", key: "hokkaido", value: false },
//             { label: "東北", key: "touhoku", value: false },
//             { label: "関東", key: "kanto", value: false },
//             { label: "北陸・甲信越", key: "hokurikukousinetu", value: false },
//             { label: "東海", key: "tokai", value: false },
//             { label: "近畿", key: "kinki", value: false },
//             { label: "中国", key: "tyugoku", value: false },
//             { label: "四国", key: "sikoku", value: false },
//             { label: "九州・沖縄", key: "kyusyuokinawa", value: false }
//           ],
//           attribute: [
//             { label: "ベンチがある", key: "hasBench", value: false },
//             { label: "屋根がある", key: "hasRoof", value: false},
//             { label: "トイレがある", key: "hasToilet", value: false},
//           ]
//         }
//       }
//   }
//
//   // チェックボックスにチェックをつける
//   updateConfig(option = {}) {
//     console.log(option.category)
//     console.log(option.index)
//     let config = this.state.config
//     switch(option.category){
//       case "place":
//       case "attribute":
//         config[ option.category ][ option.index ].value = !config[ option.category ][ option.index ].value
//         this.setState({
//           config: config
//         })
//       break
//       default:
//       break
//     }
//
//     // 場所による絞り込み
//     let filterPlaceKey = this.state.config.place.filter(p=>p.value).map(p=>p.key)
//     let spot = this.state.spot
//       if(filterPlaceKey.length > 0){
//         spot = spot.map(s=>{
//         let active = true
//         filterPlaceKey.forEach(key=>{
//           if(s[key] === 0) active = false
//         })
//         s.active = active
//         return s
//         })
//         } else {
//         spot = spot.map(s=>{
//           s.active = true
//           return s
//         })
//       }
//
//     // 属性による絞り込み
//     let filterAtrKey = this.state.config.attribute.filter(a=>a.value).map(a=>a.key)
//       if(filterAtrKey.length > 0){
//         spot = spot.map(s=>{
//         let active = true
//         filterAtrKey.forEach(key=>{
//           if(s[key] === 0) active = false
//         })
//         s.active = active
//         return s
//         })
//       } else {
//         spot = spot.map(s=>{
//           s.active = true
//           return s
//         })
//       }
//       　this.putMarker()
//   }
//
//   putMarker(o = {}){
//     // 前回のマーカー、infoWindowを消去
//     if(this.makerList){
//       this.makerList.forEach(m=>m.setMap(null))
//       this.markerList = null
//     }
//     if(this.infoWindowList){
//       this.infoWindowList.forEach(m=>m.setMap(null))
//       this.infoWindowList = null
//     }
//     this.makerList = []
//     this.infoWindowList = []
//
//     // activeな場所のマーカーを作成
// 		// this.state.spot.filter(s=>s.active).forEach((spot)=>{ここでやっとs.activeがtrueのものしか残らないfilterをかけて
// 		// ピンを絞っている
//     let self = this
//
//     this.state.spot.filter(s=>s.active).forEach((spot)=>{
//       let latLng = new google.maps.LatLng( spot.lat, spot.lng );
//       let marker = new google.maps.Marker({
//         map: this.map,
//         position: latLng,
//         animation: o.animation
//       })
//
//       let info = document.createElement("div")
//       let spotName = document.createElement("div")
//       spotName.textContent = spot.name
//       let button = document.createElement("input")
//       button.type = "button"
//       button.value = "詳細画面へ"
//       button.onClick = ()=>{this.updateView({view: "detail", data: spot})}
//       info.appendChild(spotName)
//       info.appendChild(button)
//
//       let infoWindow = new google.maps.InfoWindow({
//         content:info
//       })
//
//       marker.addListener("click",()=>{
//         infoWindow.open(this.map,marker);
//         this.route(latLng)
//       })
//
//       self.markerListd.push(marker)
//       self.infoWindowList.push(infoWindow)
//
//     })
//   }
//
//   render() {
//     return (
//       <div className="pane">
//         {/*場所から探す*/}
//         <section className="nav-section">
//           <h2 className="nav-section-hd">場所から探す</h2>
//           <ul className="nav-list">
//             {
//               this.state.config.place.map((data,i)=>{
//                 return (
//                   <li
//                     key={`place${i}`}
//                     className="nav-row checkbox"
//                     onClick={
//                       ()=>{ this.updateConfig({
//                         category: "place",
//                         index: i
//                       })}
//                     }
//                     data-checked={data.value}>
//                     <input type="checkbox" className="checkbox" />
//                     {data.label}
//                   </li>
//                 )
//               })
//             }
//           </ul>
//         </section>
//
//         {/*属性から探す*/}
//         <section className="nav-section">
//           <h2 className="nav-section-hd">属性から探す</h2>
//           <ul className="nav-list">
//             {
//               this.state.config.attribute.map((data,i)=>{
//                 return (
//                   <li
//                     key={`option${i}`}
//                     className="nav-row checkbox"
//                     onClick={
//                       ()=> { this.updateConfig({
//                         category: "attribute",
//                         index: i
//                       })}
//                     }
//                     data-checked={data.value}>
//                     <input type="checkbox" className="checkbox" />
//                     {data.label}
//                   </li>
//                 )
//               })
//             }
//           </ul>
//         </section>
//       </div>
//     );
//   }
// }
//
// export default Search;
