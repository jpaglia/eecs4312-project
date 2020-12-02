import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '../../../../components/TextField';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Proptypes from 'prop-types';
import { FormControlLabel } from '@material-ui/core';
import { Checkbox as CheckBoxUI } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../../../constants';
import { getListOfClasses } from '../../../../utils/sockets';
import './SystemAdminAddTeacher.scss'

class SystemAdminAddTeacher extends Component {
  componentDidMount() {
    const data = {
      'schoolName': this.props.schoolName
    }
    getListOfClasses(data).then(result => {
      const classes = result.data['classes']
      const classObj = []
      for (let i = 0; i < classes.length; i++) {
        classObj.push({ 'value': classes[i], 'checked': false })
      }
      this.setState({
        classList: classObj,
      })
    })

  }

  constructor() {
    super();
    this.state = {
      teacherName: '',
      teacherEmail: '',
      teacherPassword: '',
      classList: [{ 'value': 'Math', 'checked': false }, { 'value': 'Sci', 'checked': false }]
    }
  }

  getTextField(defaultValue, label) {
    return <TextField
      id={defaultValue}
      defaultValue={defaultValue}
      label={label}
      onBlur={this.handleTextFieldBlur.bind(this)}
    />
  }

  handleTextFieldBlur(e) {
    const textInput = e.target.value;
    this.setState({
      [e.target.key]: textInput
    });
  }

  listOfClasses() {
    let i = -1;
    const options = this.state.classList.map((data) => {
      i++;
      const menuItem =
        <div
          id={data.value}
          className='SystemAdminListOfClasses'
        >
          <FormControlLabel
            control={
              <CheckBoxUI
                onChange={this.onCheckboxChange.bind(this, i)}
                color='primary'
                checked={data.checked}
              />
            }
          />
          {`${data.value}`}
        </div>
      return menuItem;
    }
    );
    return options;
  }

  onCheckboxChange(i) {
    const classList = [...this.state.classList]
    classList[i]['checked'] = !this.state.classList[i]['checked']
    this.setState({ classList: classList })
  }


  render() {
    const teacherName = this.getTextField('TeacherName', 'Teacher Name')
    const teacherEmail = this.getTextField('TeacherEmail', 'Teacher Email')
    const teacherPassword = this.getTextField('TeacherPassword', 'Teacher Password')
    const listofClasses = this.listOfClasses();

    return (
      <div>
        <ThemeProvider theme={COLOUR_THEME}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="addParent-content"
              id="addParent-header"
            >
              <Typography className="AddParent" component={'span'}>Add a New Teacher</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="accordionWrapper">
                <div className="textBoxWrapper">
                  {teacherName}
                  {teacherEmail}
                  {teacherPassword}
                </div>
                <div className='classListWrapper'>
                  List of Classes
                    <div className="classListSystemAdmin">
                    {listofClasses}
                  </div>
                </div>
                <div className="addTeachersButtonWrapper">
                  <div className="buttonWrapper">
                    <Button onClick={this.addTeacher.bind(this)} color="primary" variant="contained" autoFocus>
                      Add Teacher
                      </Button>
                  </div>
                  <div className="buttonWrapper">
                    <Button onClick={this.addSupplyTeacher.bind(this)} color="primary" variant="contained" autoFocus>
                      Add Supply Teacher
                      </Button>
                  </div>
                  </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </ThemeProvider>
      </div>
    );
  }

  addTeacher() {
    // Insert Endpoint Here
    // TODO
  }

  addSupplyTeacher() {

  }

}

SystemAdminAddTeacher.propTypes = {
  schoolName: Proptypes.string,
}

export default SystemAdminAddTeacher;

