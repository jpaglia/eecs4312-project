import React, { Component } from 'react';
import TextField from '../../../components/TextField';
import DropdownSelect from '../../../components/DropdownSelect';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid'
import MiniCalendar from '../../../components/MiniCalendar';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../../constants';
import './SecretaryAttendance.scss'


// Working on calendar next
// Need to add in dates
class SecretaryAttendance extends Component {
  componentDidMount() {
    // Make call for all classes available within a school
  }

  constructor() {
    super();
    this.state = {
      studentName: '',
      className: '',
      allClasses: ['All Classes', 'Math', 'English', 'Science'], // Swap on mounting
      calendarAccordion: false,
      startingDate: Date.now()
    }
  }

  getTextField(defaultValue, label) {
    return <TextField
      id={`${label}_${uuidv4()}`}
      defaultValue={defaultValue}
      label={label}
      onBlur={this.handleTextFieldBlur.bind(this)}
    />
  }

  handleTextFieldBlur(e) {
    const textInput = e.target.value;
    if (e.target.id.includes('Name')) {
      this.setState({
        studentName: textInput
      });
    }
  }

  getDropdown() {
    return <DropdownSelect
      id={`Dropdown_${uuidv4()}`}
      dropdownOptions={this.state.allClasses}
      dropdownName={'Search By Class'}
      currentSelection={this.state.className}
      onChange={this.handleDropdownChange.bind(this)}
    />
  }

  handleDropdownChange(e) {
    const newSelection = e.target.value;
    this.setState({
      className: newSelection
    });
  }

  getDownChevron() {
    const button =
      <div className="chevronWrapper">
        <img
          alt="Down Chevron"
          src="down-chevron.png"
          className="downChevron"
        />
      </div>;
    return button;
  }

  onChevronClick() {
    this.setState({ 'calendarAccordion': !this.state.calendarAccordion })
  }

  getMiniCalendarFilter() {
    const chevron = this.getDownChevron();
    if (this.state.calendarAccordion) {
      return (
        <div>
          <div className='calendarClosedAccordian' onClick={this.onChevronClick.bind(this)}>
            Search By Date
            <div style={{ 'transform': 'rotate(180deg)' }}>
              {chevron}
            </div>
          </div>
          <MiniCalendar updateDates={this.handleDateChange.bind(this)} />
        </div>
      )
    }
    return (
      <div className='calendarClosedAccordian' onClick={this.onChevronClick.bind(this)}>
        Search By Date
        {chevron}
      </div>
    )
  }

  handleDateChange(e) {
    this.setState({
      startingDate: e.getTime()
    })
  }

  searchRecords() {
    // Get Search value
  }

  getFilterRow() {
    const nameFilter = this.getTextField('Student Name', 'Search by Student Name');
    const classListDropdown = this.getDropdown();
    const calendar = this.getMiniCalendarFilter();

    return (
      <div id={`Filter_Row_${uuidv4()}`} className="secretaryFilterRowWrapper">
        <ThemeProvider theme={COLOUR_THEME}>
          {nameFilter}
          {classListDropdown}
          {calendar}
          <div className="secretaryFilterButtonWrapper">
            <Button className="secretaryFilterButton" onClick={this.searchRecords.bind(this)} color="primary" variant="contained" autoFocus>
              Search Records
            </Button>
          </div>
        </ThemeProvider>
      </div>
    );
  }

  render() {
    const filterRow = this.getFilterRow();

    return (
      <div>
        {filterRow}
      </div>
    );
  }
}

export default SecretaryAttendance;
