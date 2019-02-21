import React, {Component} from 'react';
import './Search.css';

class Search extends Component {
  constructor() {
    super()
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
