import React, { Component } from 'react';
import Proptypes from 'prop-types';
import TopBar from '../../components/TopBar';
import SystemAdmin from './SystemAdmin';
import SecretaryAttendance from './SecretaryAttendance';
import './SecretaryMain.scss'
class SecretaryMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'currentPage': 'SecretaryHome',
    }
  }

  onChange(newPage) {
    this.setState({
      'currentPage': newPage
    })
  }

  getBackButton() {
    const button = 
      <div className="backWrapper">
        <img
          alt="Back Button"
          src="back-button.png"
          className="backButton"
        />
        <span
        className="backCircleWrapper"
        onClick={this.onChange.bind(this, 'SecretaryHome')}
        ></span>
      </div>;
    return button;
  }

  getMainPage() {
    return (
      <div>
          Secretary Page
      </div>
    )
  }

  render() {
    const backButton= this.getBackButton();
    const secretaryMainPage = this.state.currentPage === 'SecretaryHome' ? this.getMainPage() : null;
    const systemAdminPage = this.state.currentPage === 'SystemAdmin' ? <SystemAdmin/> : null;
    const secretaryAttendancePage = this.state.currentPage === 'SecretaryAttendance' ? <SecretaryAttendance/> : null;
    
    // TODO: Add in some welcome text or smthg 
    // TODO: Add in navigation to the two different pages within the getMainPage text
    // Also add stateupdaters for those
    return (
      <div>
        <TopBar
          showLogout={true}
          onChange={this.props.onChange.bind(this)}
          showBack={true}
          onBack={this.onChange.bind(this)}
          />
          <div className="secretaryWrapperPage">
          {backButton}
          <div className="secretaryInnerPage">
          {secretaryMainPage}
          {systemAdminPage}
          {secretaryAttendancePage}
          </div>
      
       </div>
      </div>
    );
  }
}

SecretaryMain.propTypes = {
  onChange: Proptypes.func,
}

export default SecretaryMain;
