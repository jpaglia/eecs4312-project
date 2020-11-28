import React, { Component } from 'react';
import Proptypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MiniCalendar.scss';

class MiniCalendar extends Component {

  setTile(date) {
    if (date.getTime() === this.props.selectedDate) {
      return 'miniCalendarSelected'
    }
  }

  render() {
    const today = new Date();
    const dateObj = this.props.selectedDate === null ? null : new Date(this.props.selectedDate);
    return (
      <div className='miniCalendarWrapper'>
       <Calendar
        onChange={this.props.updateDates}
        value={dateObj}
        selectRange={false}
        tileDisabled={({date, view}) => (view === 'month')
          && (date.getDay() === 0 || date.getDay() === 6 || 
          (this.props.disableTile && date.getTime() > today.getTime()))
        }
        tileClassName={({date}) => this.setTile(date)}
      />

      </div>
    );
  }
}

MiniCalendar.defaultProps = {
  disableTile: false
}

MiniCalendar.propTypes = {
 updateDates: Proptypes.func.isRequired,
 disableTile: Proptypes.bool,
 selectedDate: Proptypes.any.isRequired
}

export default MiniCalendar;
