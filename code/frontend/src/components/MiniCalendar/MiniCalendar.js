import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MiniCalendar.scss';

class MiniCalendar extends Component {


  render() {
  
    return (
      <div className='miniCalendarWrapper'>
       <Calendar
        onChange={this.props.updateDates}
        selectRange={false}
        tileDisabled={({date, view}) => (view === 'month') && (date.getDay() === 0 || date.getDay() === 6)}
      />

      </div>
    );
  }
}

MiniCalendar.propTypes = {
 updateDates: Proptypes.func.isRequired
}

export default MiniCalendar;
