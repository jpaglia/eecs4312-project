import React, { Component } from 'react';
import Proptypes from 'prop-types';
import TopBar from '../../components/TopBar';
import ParentHome from './ParentHome';
import { getChildren } from '../../utils/sockets';

class ParentMain extends Component {

  componentDidMount() {
    const data = {
      'email': this.props.email
    }
    getChildren(data).then(result => {
      console.log(result)
      this.setState({
        childList: result.data
      })
    })
  }

  constructor(props) {
    super(props);
    this.state = {
      'currentPage': 'ParentHome',
      'childList': []
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
  email: Proptypes.string
}

export default ParentMain;
