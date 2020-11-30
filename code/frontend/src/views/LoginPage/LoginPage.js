import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '../../components/TextField';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../constants';
import TopBar from '../../components/TopBar';
import { v4 as uuidv4 } from 'uuid';
import { login } from '../../utils/sockets';
import './LoginPage.scss'


class LoginPage extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: false
    }
  }

  getTextField(defaultValue, label) {
    return <TextField
      id={`${label}_${uuidv4()}`}
      defaultValue={defaultValue}
      label={label}
      onBlur={this.handleTextFieldBlur.bind(this)}
      error={this.state.error}
    />
  }

  handleTextFieldBlur(e) {
    const textInput = e.target.value;
    if (e.target.id.includes('Email')) {
      this.setState({
        email: textInput
      });
    } else {
      this.setState({
        password: textInput
      });
    }
  }

  signIn() {
    // Insert Endpoint Here
    // TODO
    const data = {
      'email': this.state.email,
      'password': this.state.password
    }
    login(data).then(result => {
      if (result.data.valid) {
        this.props.loginVerified(this.state.email, result.data.type)
      } else {
        this.setState({ error: true })
      }
      
    })
  // this.props.loginVerified(this.state.email, 'Teacher')
  }

  render() {
    const email = this.getTextField('Email', 'Email')
    const password = this.getTextField('Password', 'Password')
    const invalidPassword = this.state.error ? 'Invalid Username or Password' : ''

    return (
      <div className="outerWrapperLoginPage">
        <TopBar />
        <div className="innerWrapperLoginPage">
          <ThemeProvider theme={COLOUR_THEME}>
            <div className='loginPageTitleText'>
              Welcome to the TDSB Attendance System!
            </div>
            <div className='loginInner'>
            <div className='invalidPassword'>{invalidPassword}</div>
            {email}
            {password}
            </div>
            <div id={`loginButton_${uuidv4()}`} className="wrapperLoginPageButton">
              <Button onClick={this.signIn.bind(this)} color="primary" variant="contained" autoFocus>
                Sign In
            </Button>
            </div>
          </ThemeProvider>
        </div>
      </div>
    );
  }
}

LoginPage.propTypes = {
  loginVerified: Proptypes.func.isRequired,
}

export default LoginPage;
