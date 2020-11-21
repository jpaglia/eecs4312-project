import React, { Component } from 'react';
import Proptypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../../constants';


class PhoneField extends Component {
  constructor(props) {
    super();
    this.state = {
      error: true
    }
  }


  handleChange(e) {
    this.setState({ error: e.target.value.match(/^(\+0?1\s)?\(?\d{3}\)?\d{3}\d{4}$/) !== null })

  }
  render() {

    return (
      <div className='textField'>
        <form autoComplete='off'>
          <ThemeProvider theme={COLOUR_THEME}>
            <TextField
              error={!this.state.error}
              label={this.props.label}
              variant='outlined'
              value={this.state.value}
              onChange={this.handleChange.bind(this)}
              onBlur={this.props.onBlur}
              name="numberformat"
              id={this.props.id}
            />
          </ThemeProvider>
        </form>
      </div>
    );
  }
}

PhoneField.defaultProps = {
  input: ''
}

PhoneField.propTypes = {
  label: Proptypes.string.isRequired,
  id: Proptypes.string.isRequired,
  input: Proptypes.string,
  onBlur: Proptypes.func.isRequired,
}

export default PhoneField;
