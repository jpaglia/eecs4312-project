import React, { Component } from 'react';
import Proptypes from 'prop-types';
import TopBar from '../../components/TopBar';
class ParentMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'currentPage': 'ParentHome',
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
       Parent Page
      </div>
    );
  }
}

ParentMain.propTypes = {
  onChange: Proptypes.func,
}

export default ParentMain;
