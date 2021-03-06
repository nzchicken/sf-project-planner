import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'

import * as actionCreators from '../actions/project'

import ProjectTableDatePicker from '../components/project-table-date-picker'
import ProjectTableHeader from '../components/project-table-header'
import ProjectTableRow from '../components/project-table-row'
import Button from '../components/button'

class Projects extends Component {

  constructor() {
    super()
    this.addProject = this.addProject.bind(this)
    this.removeProjectHandler = this.removeProjectHandler.bind(this)
    this.discardChanges = this.discardChanges.bind(this)
    this.saveToServer = this.saveToServer.bind(this)
    this.updateResourceValue = this.updateResourceValue.bind(this)
    this.updateProjectUuidToId = this.updateProjectUuidToId.bind(this)
    this.changeDate = this.changeDate.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(actionCreators.getProjectPageData())
  }

  addProject() {
    this.props.dispatch(actionCreators.addProject())
  }

  removeProjectHandler(projectId) {
    this.props.dispatch(actionCreators.removeProject(projectId))
  }

  discardChanges() {
    this.props.dispatch(actionCreators.getResources())
  }

  saveToServer() {
    this.props.dispatch(actionCreators.saveToServer())
  }

  updateResourceValue(hours, projectId, week) {
    this.props.dispatch(actionCreators.updateResourceValue(+hours, projectId, week))
  }

  updateProjectUuidToId(uuid, projectId) {
    this.props.dispatch(actionCreators.updateProjectUuidToId(uuid, projectId))
  }

  changeDate(weekFrom, weekTo) {
    if (this.props.dirty) {
      alert('Computer says no, you need to refresh the form before you can set the date')
      return
    }
    this.props.dispatch(actionCreators.updateWeeks(weekFrom, weekTo))
  }

  render() {
    const { availableProjects, projects, weekFrom, weekTo } = this.props
    const numberOfWeeks = weekTo.diff(weekFrom, 'week')
    const weeksArray = Array.from({ length: numberOfWeeks }, (value, index) => moment(weekFrom).add(index, 'week').format('YYYY-MM-DD'))

    const projectData = projects.map(project => {
      const displayValues = weeksArray.map(week => {
        if (project.values.hasOwnProperty(week)) {
          return project.values[week];
        }
        return {
          Week_Start__c: week,
          Hours__c: 0
        }
      })

      return {
        ...project,
        displayValues
      }
    })

    return (
      <div>
        <ProjectTableDatePicker
          weekFrom={moment(weekFrom).format('YYYY-MM-DD')}
          weekTo={moment(weekTo).format('YYYY-MM-DD')}
          submit={this.changeDate}
        />
        <table className='slds-table slds-table--bordered slds-table--cell-buffer' role='grid'>
          <ProjectTableHeader weeksArray={weeksArray} />
          <tbody>
            {
              projectData.map(project => {
                return <ProjectTableRow
                  availableProjects={availableProjects}
                  project={project}
                  key={project.uuid}
                  removeHandler={this.removeProjectHandler}
                  updateProjectUuidToId={this.updateProjectUuidToId}
                  updateResourceValue={this.updateResourceValue}
                />
              })
            }
          </tbody>
        </table>
        <div className="slds-grid slds-m-around--small">
          <Button label="Add" onClick={this.addProject} iconName='add' iconPosition='left' type="neutral" />
          <div className="slds-col"></div>
          <Button label="Discard Changes" onClick={this.discardChanges} type="neutral" />
          <Button label="Save Resources" onClick={this.saveToServer} type="brand" />
        </div>
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  const projects = Object.values(state.projects.projectData);

  //Contains list from the api, minus projects already on screen unless they are hidden
  const availableProjects = state.projects.availableProjects.filter(avPrj => {
    return !projects.some(prj => {
      if (prj.isHidden) return false;
      return prj.Id === avPrj.Id
    });
  });

  return {
    ...state.projects,
    projects: projects.filter(proj => !proj.isHidden),
    availableProjects
  }
}


export default connect(mapStateToProps)(Projects)
