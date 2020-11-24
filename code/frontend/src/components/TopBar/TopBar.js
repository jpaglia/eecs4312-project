import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../constants';
import './TopBar.scss';


class TopBar extends Component {
  logout() {
    this.props.onChange('LoginPage')
  }

  render() {
    const logoutButton = this.props.showLogout ? <div className="logoutButton">
       <ThemeProvider theme={COLOUR_THEME}>
          <Button onClick={this.logout.bind(this)} color="primary" variant="contained" autoFocus>
            Logout
          </Button> 
       </ThemeProvider>
    </div>
    : null;

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
        {logoutButton}
      </div>
    );
  }
}

TopBar.defaultProps = {
  showLogout: false,
  onChange: null
}

TopBar.propTypes = {
  showLogout: Proptypes.bool,
  onChange: Proptypes.func
}

export default TopBar;
