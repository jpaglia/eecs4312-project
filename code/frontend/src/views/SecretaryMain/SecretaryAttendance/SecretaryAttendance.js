import React, { Component } from 'react';
import Proptypes from 'prop-types';
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
import { getAttendanceList, getListOfClasses, notifyParents } from '../../../utils/sockets';

class SecretaryAttendance extends Component {

  componentDidMount() {
    const data = {
      'schoolName': this.props.schoolName
    }
    getAttendanceList(this.state.searchParams).then(result => {
      const rowData = result.data;
      getListOfClasses(data).then(result => {
        const classes = result.data['classes']
        classes.unshift('All Classes')
        this.setState({
          allClasses: classes,
          rowData: rowData
        })
      })
    })
    
  }

  constructor(props) {
    super(props);
    this.state = {
      studentName: '',
      className: '',
      allClasses: [],
      calendarAccordion: false,
      date: null,
      searchParams: {
        studentName: '',
        className: '',
        date: null,
        schoolName: props.schoolName
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
    const currentSelection = this.state.date === null ? 'All': new Date(this.state.date).toDateString()
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
                selectedDate={this.state.date}
              />
            </AccordionDetails>
          </Accordion>
      </div>
    )
  }

  handleDateChange(e) {
    if (this.state.date === e.getTime()) {
      this.setState({
        date: null
      })
    } else {
      this.setState({
        date: e.getTime()
      })
    }
  }

  searchRecords() {
    // Get Search value
    const searchParams = {
      schoolName: this.props.schoolName,
      studentName: this.state.studentName,
      className: this.state.className === 'All Classes' ? '': this.state.className,
      date: this.state.date
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
    // notifyParents(childList).then(result => {
    //   getAttendanceList(this.state.searchParams).then(result => {
    //     this.setState({
    //       rowData : result.data,
    //     })
    //   })
    // })
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
           currentUser={'Secretary'}
           />
        </div>
      </div>
    );
  }
}

SecretaryAttendance.propTypes = {
  schoolName: Proptypes.string.isRequired
}

export default SecretaryAttendance;
