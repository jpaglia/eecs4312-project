import React, { Component } from 'react';
import Proptypes from 'prop-types';
import TopBar from '../../components/TopBar';
import ParentHome from './ParentHome';

class ParentMain extends Component {

  componentDidMount() {
    // Create API call to fetch names of all children data (name, school, and if was absent today)
  }

  constructor(props) {
    super(props);
    this.state = {
      'currentPage': 'ParentHome',
      'childList': [{
        'lateNotification': false,
        'name': 'Julia P'
      }]
    }
  }

  onChange(newPage) {
    this.setState({
      'currentPage': newPage
    })
  }

  render() {
    const parentHome = this.state.currentPage === 'ParentHome' ?
    <ParentHome
      childList={this.state.childList}
    /> : null;
  
    return (
      <div>
        <TopBar showLogout={true} onChange={this.props.onChange.bind(this)}/>
          {parentHome}
      </div>
    );
  }
}

ParentMain.propTypes = {
  onChange: Proptypes.func,
}

export default ParentMain;
