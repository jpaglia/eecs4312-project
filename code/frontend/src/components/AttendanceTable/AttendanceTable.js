import React, { Component } from 'react';
import Proptypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../constants';
import Button from '@material-ui/core/Button';
import AttendanceDropdown from './AttendanceDropdown';
import AttendanceCheckbox from './AttendanceCheckbox';
import AttendanceDiv from './AttendanceDiv';
import SubmitAttendance from './SubmitAttendance';
import { updateAttendanceRecord, addRecords } from '../../utils/sockets';
import './AttendanceTable.scss';


class AttendanceTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnDefs: this.getTableColumnDefs(),
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        wrapText: true,
        autoHeight: true
      },
      frameworkComponents: {
        attendanceDropdown: AttendanceDropdown,
        attendanceCheckbox: AttendanceCheckbox,
        attendanceDiv: AttendanceDiv
      },
      disableButton: true,
      overlayNoRowsTemplate:
        '<div style="padding: 10px; font-style:italic;">No attendance records exist</div>',

    };
  }

  getTableColumnDefs() {
    if (this.props.currentUser === 'Secretary') {
      return (
        [
          {
            field: "Name",
            minWidth: 200
          },
          {
            field: "Attendance",
            cellRenderer: "attendanceDropdown",
            cellRendererParams: {
              clicked: this.updateAttendance.bind(this),
              type: 'Secretary'
            },
            minWidth: 130
          },
          {
            field: "Class",
            minWidth: 85
          },
          {
            field: "Date",
            minWidth: 100
          },
          {
            field: "Reason For Absence",
            minWidth: 235,
            editable: true
          },
          {
            field: "Reason Verified",
            cellRenderer: "attendanceCheckbox",
            cellRendererParams: {
              onChange: this.updateVerifiedReason.bind(this)
            },
            minWidth: 150
          },
          {
            field: "Parent Notified",
            minWidth: 150
          },
        ]
      )
    } else if (this.props.currentUser === 'Teacher-Historical') {
      return (
        [
          {
            field: "Name",
            minWidth: 268
          },
          {
            field: "Attendance",
            cellRenderer: "attendanceDiv",
            minWidth: 268
          },
          {
            field: "Class",
            minWidth: 268
          },
          {
            field: "Date",
            minWidth: 269
          }
        ]
      )
    } else if (this.props.currentUser === 'Teacher-Record') {
        return (
          [
            {
              field: "Name",
              minWidth: 250
            },
            {
              field: "Attendance",
              cellRenderer: "attendanceDropdown",
              cellRendererParams: {
                clicked: this.markAttendance.bind(this),
                type: 'Teacher-Record'
              },
              minWidth: 130
            }
          ]
        )
      }
    }

  // For secretary only
  updateAttendance(value, rowIndex) {
    const rowNode = this.gridApi.getRowNode(rowIndex);
    rowNode.setDataValue('Attendance', value)
    updateAttendanceRecord(rowNode.data)
    this.gridApi.redrawRows()
   
  }

  updateRecord(e) {
    if (e.colDef.field === 'Reason For Absence') {
      updateAttendanceRecord(e.data)
    }
  }

  // For Teacher Only
  markAttendance(value, rowIndex) {
    const rowNode = this.gridApi.getRowNode(rowIndex);
    rowNode.setDataValue('Attendance', value)
    let disableButton = false;
    this.gridApi.forEachNode(function(rowNode, index) {
      if (rowNode.data['Attendance'] === '') {
        disableButton = true;
      }
    })

    if (disableButton !== this.state.disableButton) {
      this.setState({ disableButton: disableButton})
    }
  }

  updateVerifiedReason(value, rowIndex) {
    const rowNode = this.gridApi.getRowNode(rowIndex);
    rowNode.setDataValue('Reason Verified', value)

    // Call endpoint to update child's attendance record
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  notifyParents() {
    const childrenList = [];
    this.gridApi.forEachNode(function(rowNode, index) {
      if (rowNode.data['Parent Notified'] === 'N' && !rowNode.data['Reason Verified'] && (rowNode.data['Attendance'] === 'Late' || rowNode.data['Attendance'] === 'Absent')) {
        childrenList.push({'Name' : rowNode.data['Name'], 'Date': rowNode.data['Name'], 'Class': rowNode.data['Class']})
      }
    })
    // TODO: confirm date works.... may need to format it
    this.props.notifyParents(childrenList);
  }

  getNotifyParents() {
    return (
      <div className='notifyParents'>
        <ThemeProvider theme={COLOUR_THEME}>
          <Button className="notifyParentsButton" onClick={this.notifyParents.bind(this)} color="primary" variant="contained" autoFocus>
            Notify Parents
        </Button>
        </ThemeProvider>
      </div>
    )
  }

  
  submitAttendance() {
  const data = [];
  this.gridApi.forEachNode(function(rowNode, index) {
    data.push(rowNode.data)
  })
  const paramData = {
    'className': this.props.className,
    'classList': data,
    'schoolName': this.props.schoolName
  }

  addRecords(paramData)
  }

  // Submit record for Teacher
  getSubmitAttendanceButton() {
    return (
    <SubmitAttendance
      disableButton={this.state.disableButton}
      submitAttendance={this.submitAttendance.bind(this)}
      classStartHour={this.props.classStartHour}
    />
    )
  }

  render() {
    const notifyParentsButton = this.props.currentUser === 'Secretary' ? this.getNotifyParents() : null;
    const submitAttendanceTeacher = this.props.currentUser === 'Teacher-Record' ? this.getSubmitAttendanceButton() : null;

    return (
      <div className='attendanceTableWrapper'>
        <div
          id="myGrid"
          style={{
            height: "60vh",
            width: this.props.currentUser === 'Teacher-Record' ? "385px" : "1075px"
          }}
          className="ag-theme-alpine"
        >
          <AgGridReact
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            frameworkComponents={this.state.frameworkComponents}
            onGridReady={this.onGridReady}
            rowData={this.props.rowData}
            onCellValueChanged={this.updateRecord}
            overlayNoRowsTemplate={this.state.overlayNoRowsTemplate}
          />
        </div>
        {notifyParentsButton}
        {submitAttendanceTeacher}
      </div>
    );
  }
}

AttendanceTable.propTypes = {
  notifyParents: Proptypes.func,
  rowData: Proptypes.array.isRequired,
  currentUser: Proptypes.string.isRequired,
  classStartHour: Proptypes.number,
  schoolName: Proptypes.string
}

export default AttendanceTable;
