import React, { Component } from 'react';
import Proptypes from 'prop-types';
import TopBar from '../../components/TopBar';
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

  render() {
  
    return (
      <div>
        <TopBar showLogout={true} onChange={this.props.onChange.bind(this)}/>
       Secretary Page
      </div>
    );
  }
}

SecretaryMain.propTypes = {
  onChange: Proptypes.func,
}

export default SecretaryMain;
