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
import './AttendanceTable.scss';
class AttendanceTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          field: "Name",
          minWidth: 200
        },
        {
          field: "Attendance",
          cellRenderer: "attendanceDropdown",
          cellRendererParams: {
            clicked: this.updateAttendance.bind(this)
          },
          minWidth: 150
        },
        {
          field: "Class",
          minWidth: 75
        },
        {
          field: "Date",
          minWidth: 75
        },
        {
          field: "Reason For Absence",
          minWidth: 250,
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
      ],
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        wrapText: true,
        autoHeight: true
      },
      frameworkComponents: {
        attendanceDropdown: AttendanceDropdown,
        attendanceCheckbox: AttendanceCheckbox
      }
    };
  }

  updateAttendance(value, rowIndex) {
    const rowNode = this.gridApi.getRowNode(rowIndex);
    rowNode.setDataValue('Attendance', value)
    this.gridApi.redrawRows()
  }

  updateVerifiedReason(value, rowIndex) {
    const rowNode = this.gridApi.getRowNode(rowIndex);
    rowNode.setDataValue('Reason Verified', value)
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  notifyParents() {
    const childrenList = [];
    this.gridApi.forEachNode(function(rowNode, index) {
      if (rowNode.data['Parent Notified'] === 'N' && !rowNode.data['Reason Verified'] && (rowNode.data['Attendance'] === 'Late' || rowNode.data['Attendance'] === 'Absent')) {
        childrenList.append({'Name' : rowNode.data['Name'], 'Date': rowNode.data['Name'], 'Class': rowNode.data['Class']})
      }
    })
    // TODO: confirm date works.... may need to format it
    this.props.notifyParents(childrenList);
  }

  getNotifyParents() {
    return (
      <div>
        <ThemeProvider theme={COLOUR_THEME}>
          <Button className="secretaryFilterButton" onClick={this.notifyParents.bind(this)} color="primary" variant="contained" autoFocus>
            Search Records
        </Button>
        </ThemeProvider>
      </div>

    )
  }

  render() {
    const notifyParentsButton = this.getNotifyParents();

    return (
      <div className='attendanceTableWrapper'>
        <div
          id="myGrid"
          style={{
            height: "60vh",
            width: "1075px"
          }}
          className="ag-theme-alpine"
        >
          <AgGridReact
            className='test'
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            frameworkComponents={this.state.frameworkComponents}
            onGridReady={this.onGridReady}
            rowData={this.props.rowData}
          />
        </div>
        {notifyParentsButton}
      </div>
    );
  }
}

AttendanceTable.propTypes = {
  notifyParents: Proptypes.func.isRequired,
  rowData: Proptypes.array.isRequired
}

export default AttendanceTable;
