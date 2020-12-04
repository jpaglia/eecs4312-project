import React, { Component } from 'react';
import Proptypes from 'prop-types';
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
import ParentAttendanceTable from '../../../components/ParentAttendanceTable';
import './ParentAttendanceView.scss'
// import { getChildRecords, getListOfChildClasses } from '../../../utils/sockets';

class ParentAttendanceView extends Component {

  componentDidMount() {
    // getChildRecords(this.state.searchParams).then(result => {
    //   const rowData = result.data;
    //   getListOfChildClasses(data).then(result => {
    //     const classes = result.data['classes']
    //     classes.unshift('All Classes')
    //     this.setState({
    //       allClasses: classes,
    //       rowData: rowData
    //     })
    //   })
    //})

  }

  constructor(props) {
    super(props);
    this.state = {
      selectedChild: '',
      className: '',
      allClasses: [],
      calendarAccordion: false,
      date: null,
      searchParams: {
        listOfChildren: this.props.allChildren,
        className: '',
        date: null
      },
      rowData: [],
    }
  }

  getChildDropdown() {
    const childList = [...this.props.allChildren]
    childList.unshift('All Children')
    return <DropdownSelect
      id={`Dropdown_${uuidv4()}`}
      dropdownOptions={this.props.allChildren}
      dropdownName={'Select Child'}
      currentSelection={this.state.selectedChild}
      onChange={this.handleChildsDropdownChange.bind(this)}
      className={'dropdownWrapperSmall'}
    />
  }

  getClassDropdown() {
    return <DropdownSelect
      id={`Dropdown_${uuidv4()}`}
      dropdownOptions={this.state.allClasses}
      dropdownName={'Select Class'}
      currentSelection={this.state.className}
      onChange={this.handleClassDropdownChange.bind(this)}
      className={'dropdownWrapperSmall'}
    />
  }

  handleClassDropdownChange(e) {
    const newSelection = e.target.value;
    this.setState({
      className: newSelection
    });
  }

  handleChildsDropdownChange(e) {
    const newSelection = e.target.value;
    this.setState({
      selectedChild: newSelection
    });
  }

  getMiniCalendarFilter() {
    const currentSelection = this.state.date === null ? 'All' : new Date(this.state.date).toDateString()
    return (
      <div className='calendarAccordian'>
        <Accordion className='accordionZIndex'>
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
      listOfChildren: this.state.selectedChild === 'All Children' ? this.props.allChildren : [this.state.selectedChild],
      className: this.state.className === 'All Classes' ? '' : this.state.className,
      date: this.state.date
    }

    // getChildRecords(searchParams).then(result => {
    //   this.setState({
    //     rowData : result.data,
    //     searchParams: searchParams
    //   })
    // })
  }

  getFilterRow() {
    const childListDropdown = this.getChildDropdown();
    const classListDropdown = this.getClassDropdown();
    const calendar = this.getMiniCalendarFilter();

    return (
      <ThemeProvider theme={COLOUR_THEME}>
        <div id={`Filter_Row_${uuidv4()}`} className="parentFilterRowWrapper">
          <div className='parentAttendanceLeft'>
            <div className='parentAttendanceSpacer'>
              {childListDropdown}
            </div>
            <div className='parentAttendanceSpacer'>
              {classListDropdown}
            </div>
            <div className='parentAttendanceSpacer'>
              {calendar}
            </div>
          </div>

        </div>
        <div className="parentFilterButtonWrapper">
          <Button className="parentFilterButton" onClick={this.searchRecords.bind(this)} color="primary" variant="contained" autoFocus>
            Search Records
          </Button>
        </div>
      </ThemeProvider>
    );
  }

  render() {
    const filterRow = this.getFilterRow();

    return (
      <div>
        {filterRow}
        <div className='tableAttendance'>
          <ParentAttendanceTable
           rowData={this.state.rowData}
           />
        </div>
      </div>
    );
  }
}

ParentAttendanceView.propTypes = {
  allChildren: Proptypes.array
}

export default ParentAttendanceView;
