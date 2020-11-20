import React, { Component } from 'react';

import './TopBar.scss'


class TopBar extends Component {

  render() {
    return (
      <div className="topBarWrapper">

        <div className='logo'>
          <img
            alt="TDSB"
            src="/logo.png"
          />

        </div>
        <div className='banner'>
          Toronto District School Board
        </div>
      </div>
    );
  }
}

export default TopBar;
