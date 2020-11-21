import React, { Component } from 'react';
import LoginPage from './views/LoginPage';
import SecretaryMain from './views/SecretaryMain';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'currentPage': 'LoginPage'
    }

    this.onChange = this.onChange.bind(this)
    this.onLogin = this.onLogin.bind(this)
  }

  onChange(newPage) {
    this.setState({
      'currentPage': newPage
    })
  }

  onLogin(newPage) {
    this.setState({
      'currentPage': newPage,
    });
  }

  render() {
    const loginPage = this.state.currentPage === 'LoginPage' ?
      <LoginPage
      loginVerified={this.onLogin}
      /> : null;

    const secretaryMain = this.state.currentPage === 'SecretaryMain' ?
    <SecretaryMain/> : null;

    return (
      <div>
       {loginPage}
       {secretaryMain}
      </div>
    );
  }
}
export default App;
