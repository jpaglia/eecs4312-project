import React, { Component } from 'react';
import {InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';
import Proptypes from 'prop-types';
import { ThemeProvider } from '@material-ui/styles';
import './DropdownSelect.scss';
import { COLOUR_THEME } from '../../constants';

class DropdownSelect extends Component {
  createMenuItems() {
    const options = this.props.dropdownOptions.map((value) =>
      {
        const menuItem =
          <MenuItem
            id={value}
            key={value}
            value={value}
           >{`${value}`}
          </MenuItem>
          return menuItem;
      }
    );
    return options;
  }

  

  render() {
    const menuOptions = this.createMenuItems();
    return(
      <div  className={this.props.className}>
        <ThemeProvider theme={COLOUR_THEME}>
          <FormControl className='dropdownSelect'>
            <InputLabel id={`Dropdown_${this.props.dropdownName}`} color="primary"
            style={{"fontSize": '20px'}}
            >
                {this.props.dropdownName}
            </InputLabel>
          <Select
            id={`Dropdown_Select_${this.props.dropdownName}`}
            value={this.props.currentSelection}
            onChange={this.props.onChange}
          >
          {menuOptions}
          </Select>
        </FormControl>
        </ThemeProvider>
      </div>
    );
  }
}

DropdownSelect.defaultProps = {
  dropdownOptions: [],
  dropdownName: '',
  hoverText: '',
  enableTooltip: false,
  currentSelection: '',
  className: 'dropdownWrapper'
}

DropdownSelect.propTypes = {
 id: Proptypes.string.isRequired,
 dropdownOptions: Proptypes.array,
 dropdownName: Proptypes.string,
 currentSelection: Proptypes.string,
 hoverText: Proptypes.string,
 onChange: Proptypes.func.isRequired,
 className: Proptypes.string
}

export default DropdownSelect;
