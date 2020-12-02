import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { TextField as TextFieldUI } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import './SearchField.scss';
import { COLOUR_THEME } from '../../constants';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';


class SearchField extends Component {
  

  render() {
    const searchResultDiv = this.props.searchResult !== '' ? 
    <Button 
      onClick={this.props.onSelect.bind(this)}
      color="primary"
      variant="contained"
      className='searchResultButton'
      autoFocus>
        {this.props.searchResult}
    </Button> : null;


    return(
      <div className='searchFieldWrapper'>
      <div className={'searchField'}>
        <form autoComplete='off'>
        <ThemeProvider theme={COLOUR_THEME}>
            <TextFieldUI
              id={this.props.id}
              label={this.props.label}
              variant='outlined'
              color='primary'
              defaultValue={this.props.input}
              error={this.props.error}
              onBlur={this.props.onBlur}
            />
            <IconButton className='searchButtonWrapper' onClick={this.props.onSearch.bind(this)}>
              <SearchIcon />
            </IconButton>
          </ThemeProvider>
        </form>
      </div>
      {searchResultDiv}
      </div>
    );
  }
}

SearchField.defaultProps = {
  input: '',
  error: false,
  searchResults: ''
}

SearchField.propTypes = {
  label: Proptypes.string.isRequired,
  id: Proptypes.string.isRequired,
  input: Proptypes.string,
  onSelect: Proptypes.func,
  error: Proptypes.bool,
  onSearch: Proptypes.func.isRequired,
  searchResult: Proptypes.string
}

export default SearchField;
