import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { TextField as TextFieldUI } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import './TextField.scss';
import { COLOUR_THEME } from '../../constants';


class TextField extends Component {


  render() {
    if (this.props.label.includes('Password')) {
      return(
        <div className='textField'>
          <form autoComplete='off'>
          <ThemeProvider theme={COLOUR_THEME}>
              <TextFieldUI
                error={this.props.error}
                type='password'
                id={this.props.id}
                label={this.props.label}
                variant='outlined'
                onBlur={this.props.onBlur}
                color='primary'
                defaultValue={this.props.input}
              />
            </ThemeProvider>
          </form>
        </div>
      );
    }
    return(
      <div className='textField'>
        <form autoComplete='off'>
        <ThemeProvider theme={COLOUR_THEME}>
            <TextFieldUI
              id={this.props.id}
              label={this.props.label}
              variant='outlined'
              onBlur={this.props.onBlur}
              color='primary'
              defaultValue={this.props.input}
            />
          </ThemeProvider>
        </form>
      </div>
    );
  }
}

TextField.defaultProps = {
  input: '',
  error: false
}

TextField.propTypes = {
  label: Proptypes.string.isRequired,
  id: Proptypes.string.isRequired,
  input: Proptypes.string,
  onBlur: Proptypes.func.isRequired,
  error: Proptypes.bool
}

export default TextField;
