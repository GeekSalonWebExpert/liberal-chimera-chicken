import React, { Component } from 'react';
import { Router, Route, IndexRoute, browserHistory, Link } from "react-router";
import './Main.css';

// Header.jsをインポート
import Header from './Header/Header'
// Map.jsをインポート
import Map from './Map/Map'
// Search.jsをインポート
import Search from './Search/Search'

class Main extends Component {
  constructor() {
    super()
    this.state = {

      name: "野宿びより",

      spot: [
        { name: "道の駅五霞", address: "〒306-0304 茨城県猿島群五霞町幸主18-1", place: "関東",  image: 0 , score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: true},
        { name: "道の駅 YOU・遊・もり", address: "〒049-2311 北海道茅部郡森町上台町326-18", place: "北海道", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: false},
        { name: "道の駅 厳美渓谷", address: "〒021-0101 岩手県一関市厳美町沖野々220-1", place: "東北", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: true},
        { name: "道の駅　きららあじす", address: "〒754-1277　山口県山口市阿知須509-88", place: "中国", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: false},
        { name: "道の駅 させぼっくす", address: "〒858-0917 長崎県佐世保市愛宕町11", place: "九州・沖縄", image: 0, score: 5, let: 0, lng: 0, hasToilet: true, hasRoof: true, hasBench: true}
      ],

      selectedSpot: null,
      refine: {
        place: [
          { label: "北海道", key: "hokkaido", value: false },
          { label: "東北", key: "touhoku", value: false },
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
        ],
      }

    }
  }
  render() {
    return (
      <div className="App">
          <Header name={this.state.name} />
          <div className="flex-container">
            <div className="pane">
              <Map />
            </div>
            {/*<div className="pane">
              <Search />
            </div>*/}

          </div>
            <Link to={`/detail/aaa/`}>詳細ページへ</Link>
          {/*<Link to={`/detail/aaa/`}>詳細ページへ</Link>*/}
      </div>
    );
  }
}

export default Main;
