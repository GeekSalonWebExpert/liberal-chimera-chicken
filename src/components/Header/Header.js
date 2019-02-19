import React, {Component} from 'react';
import './Header.css';


class Header extends Component {
  constructor() {
    super()
  }
  render() {
    return (
      <div className="header">
        <h2 className="title">{this.props.name}</h2>
      </div>
    );
  }
}

export default Header;
