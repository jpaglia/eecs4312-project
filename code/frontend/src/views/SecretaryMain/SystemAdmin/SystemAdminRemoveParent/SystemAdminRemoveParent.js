import React, { Component } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Proptypes from 'prop-types';
import Button from '@material-ui/core/Button';
import SearchField from '../../../../components/SearchField';
import { ThemeProvider } from '@material-ui/styles';
import { COLOUR_THEME } from '../../../../constants';
import { searchRecords, removePerson } from '../../../../utils/sockets';
class SystemAdminRemoveParent extends Component {


  constructor() {
    super();
    this.state = {
      parentNameQuery: '',
      parentName: '',
      errorSearch: false
    }
  }

  getSearchField(defaultValue, label) {
    return (
      <SearchField
        id={defaultValue}
        defaultValue={defaultValue}
        label={label}
        onSearch={this.handleSearch.bind(this)}
        searchResult={this.state.parentName}
        onBlur={this.handleSearchBlur.bind(this)}
        onSelect={this.handleSearch.bind(this)}
        error={this.state.errorSearch}
      />)
  }

  handleSearchBlur(e) {
    const textInput = e.target.value;
    this.setState({
      'parentNameQuery': textInput
    });
  }

  handleSearch() {
    // Do search endpoint here
    // Add type
    const data = {
      'name': this.state.parentNameQuery,
      'schoolName': this.props.schoolName,
      'type': this.props.removeParentBool ? 'Parent' : 'Teacher'
    }
    searchRecords(data).then(result => {
      if (result.data) {
          this.setState({
            parentName: this.state.parentNameQuery,
            errorSearch: false
          })
      } else {
        this.setState({
          errorSearch: true,
          parentName: '',
        })
      }
    })
  }

  render() {
    const searchRemove = this.props.removeParentBool ? this.getSearchField('RemoveParent', 'Remove Parent') : this.getSearchField('RemoveTeacher', 'Remove Teacher')
    const title = this.props.removeParentBool ? 'SEARCH FOR A PARENT' : 'SEARCH FOR A TEACHER' 
    const buttonText = this.props.removeParentBool ? 'Remove Parent' : 'Remove Teacher'
    const accordionText = this.props.removeParentBool ? 'Remove a Parent' : 'Remove a Teacher'

    return (
      <div>
        <ThemeProvider theme={COLOUR_THEME}>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="removeParent-content"
              id="removeParent-header"
            >
              <Typography className="RemoveParent" component={'span'}>{accordionText}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="accordionWrapper">
                {title}
                  <div className="searchBarWrapper">
                  {searchRemove}
                </div>
                <div className="buttonWrapper">
                  <Button
                    onClick={this.removePerson.bind(this)}
                    color="primary"
                    variant="contained"
                    disabled={this.state.parentName === ''}
                    autoFocus>
                    {buttonText}
                    </Button>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
        </ThemeProvider>
      </div>
    );
  }


  removePerson() {
   
    const data = {
      'Name': this.state.parentName,
      'schoolName': this.props.schoolName
    }
    removePerson(data).then(result => {
      if (result.data.valid) {
        this.setState({
          parentNameQuery: '',
          parentName: '',
          errorSearch: false
        })
      }
    })
  }

}

SystemAdminRemoveParent.defaultProps = {
  removeParentBool: true,
}
SystemAdminRemoveParent.propTypes = {
  removeParentBool: Proptypes.bool,
  schoolName: Proptypes.bool,
}

export default SystemAdminRemoveParent;

