import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '../../../components/TextField';
import DropdownSelect from '../../../components/DropdownSelect';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid'
import MiniCalendar from '../../../components/MiniCalendar';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../../constants';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AttendanceTable from '../../../components/AttendanceTable';
import './TeacherHistoricalRecords.scss'
import { getTeacherHistoricalAttendanceList } from '../../../utils/sockets';


// Working on calendar next
// Need to add in dates
class TeacherHistoricalRecords extends Component {
  componentDidMount() {
    this.searchRecords()
  }
  
  constructor(props) {
    super(props);
    this.state = {
      studentName: '',
      className: 'All Classes',
      allClasses: this.props.classList,
      calendarAccordion: false,
      startingDate: null,
      searchParams: {
        studentName: '',
        className: '',
        startingDate: null
      },
      rowData: []
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
    const list = [...this.state.allClasses]
    list.unshift('All Classes')
    return <DropdownSelect
      id={`Dropdown_${uuidv4()}`}
      dropdownOptions={list}
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

  getMiniCalendarFilter() {
    const currentSelection = this.state.startingDate === null ? 'All': new Date(this.state.startingDate).toDateString()
    return (
      <div className='calendarAccordian'>
          <Accordion  className='accordionZIndex'>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="addParent-content"
              id="addParent-header"
            >
              <Typography className="AddParent" component={'span'}>Search by Date: {currentSelection}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MiniCalendar
                updateDates={this.handleDateChange.bind(this)} 
                selectedDate={this.state.startingDate}
                disableTile={true}
              />
            </AccordionDetails>
          </Accordion>
      </div>
    )
  }

  handleDateChange(e) {
    if (this.state.startingDate === e.getTime()) {
      this.setState({
        startingDate: null
      })
    } else {
      this.setState({
        startingDate: e.getTime()
      })
    }
  }

  searchRecords() {
    // Get Search value
    const searchParams = {
      studentName: this.state.studentName,
      classList: this.state.className === 'All Classes' ? this.state.allClasses: [this.state.className],
      date: this.state.startingDate,
      schoolName: this.props.schoolName
    }
    
    getTeacherHistoricalAttendanceList(searchParams).then(result => {
      this.setState({
        rowData : result.data,
        searchParams: searchParams
      })
    })
  }

  getFilterRow() {
    const nameFilter = this.getTextField('Student Name', 'Search by Student Name');
    const classListDropdown = this.getDropdown();
    const calendar = this.getMiniCalendarFilter();

    return (
      <div id={`Filter_Row_${uuidv4()}`} className="secretaryFilterRowWrapper">
        <ThemeProvider theme={COLOUR_THEME}>
          <div className='secretaryAttendanceLeft'>
            <div className='secretaryAttendanceSpacer'>
          {nameFilter}
          </div>
          <div className='secretaryAttendanceSpacer'>
          {classListDropdown}
          </div>
          {calendar}
          </div>
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
        <div className='tableAttendance'>
           <AttendanceTable
           rowData={this.state.rowData}
           currentUser={'Teacher-Historical'}
           />
        </div>
      </div>
    );
  }
}

TeacherHistoricalRecords.propTypes = {
  classList: PropTypes.array.isRequired,
  email: PropTypes.string,
  schoolName: PropTypes.string
}

export default TeacherHistoricalRecords;
