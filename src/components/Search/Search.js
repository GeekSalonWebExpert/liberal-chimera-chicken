import React, {Component} from 'react';
import './Search.css';

class Search extends Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div className="searchbar">
      　
        <h3 className="first-search">フリーワードから探す</h3>
          <input type="text" className="freeword"></input>

          　
            <h3 className="second-search">場所から探す
            <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                北海道
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                東北
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                関東
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                北陸・甲信越
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                東海
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                近畿
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                中国
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                四国
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                九州・沖縄
              </label>
            </h3>

            {/*<h3 className="third-search">星の数から探す
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                ⭐️⭐️⭐️⭐️⭐️
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                ⭐️⭐️⭐️⭐️
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                ⭐️⭐️⭐️
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                ⭐️⭐️
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                ⭐️
              </label>
            </h3>*/}

            <h3 className="fourth-search">こだわり・目的から探す
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                ベンチがある
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                屋根がある
              </label>
              <label>
                <input type="checkbox" class="checkbox" />
                <span class="checkbox-icon"></span>
                トイレがある
              </label>
            </h3>








      </div>
    );
  }
}

export default Search;

{// <ul>
//   <li>北海道</li>
//   <li>東北</li>
//   <li>関東</li>
// </ul>
}
