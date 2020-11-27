import React, { Component } from 'react';
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
import './SecretaryAttendance.scss'
import { getAttendanceList } from '../../../utils/sockets';


// Working on calendar next
// Need to add in dates
class SecretaryAttendance extends Component {
  componentDidMount() {
    // Make call for all classes available within a school
    getAttendanceList(this.state.searchParams).then(result => {
      this.setState({
        rowData : result.data
      })
    })
  }

  constructor() {
    super();
    this.state = {
      studentName: '',
      className: '',
      allClasses: ['All Classes', 'MATH3U0', 'ENG4U0', 'PHYS4U0'], // Swap on mounting
      calendarAccordion: false,
      startingDate: Date.now(),
      searchParams: {
        studentName: '',
        className: '',
        startingDate: Date.now()
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

  getMiniCalendarFilter() {
    return (
      <div className='calendarAccordian'>
          <Accordion  className='accordionZIndex'>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="addParent-content"
              id="addParent-header"
            >
              <Typography className="AddParent" component={'span'}>Search by Date</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <MiniCalendar updateDates={this.handleDateChange.bind(this)} />
            </AccordionDetails>
          </Accordion>
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
    const searchParams = {
      studentName: this.state.studentName,
      className: this.state.className === 'All Classes' ? '': this.state.className,
      startingDate: this.state.startingDate
    }

   
    getAttendanceList(searchParams).then(result => {
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

  notifyParents(childList) {
    // call endpoint to notify parents with childList
    // refetch data with this.state.searchParams
    this.setState({
      rowData: [] // replace with endpoint result
    })
  }


  render() {
    const filterRow = this.getFilterRow();

    return (
      <div>
        {filterRow}
        <div className='tableAttendance'>
           <AttendanceTable
           rowData={this.state.rowData}
           notifyParents={this.notifyParents.bind(this)}
           />
        </div>
      </div>
    );
  }
}

export default SecretaryAttendance;
