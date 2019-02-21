import React, {Component} from 'react';
import './Search.css';

class Search extends Component {
  constructor() {
    super()

      this.state = {
        config: {
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
          ]
        }
      }
  }

  // チェックボックスにチェックをつける
  updateConfig(option = {}) {
    console.log(option.category)
    console.log(option.index)
    let config = this.state.config
    switch(option.category){
      case "place":
      case "attribute":
        config[ option.category ][ option.index ].value = !config[ option.category ][ option.index ].value
        this.setState({
          config: config
        })
      break
      default:
      break
    }
  }

  render() {
    return (
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
    );
  }
}

export default Search;
