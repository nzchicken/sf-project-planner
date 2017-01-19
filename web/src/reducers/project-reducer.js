import actionTypes from '../actions/action-types'
import moment from 'moment'

const initialState = {
  projectData: [ ],
  weekFrom: moment().startOf('isoWeek'),
  weekTo: moment().add(5, 'week').startOf('isoWeek')
}

const projectReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_PROJECT:
      const newProjectData = state.projects.concat(action.payload.newProject);

      return {
        ...state,
        projectData: newProjectData
      }
    case actionTypes.REMOVE_PROJECT:
      //TODO, projectIndex should be the projectId, not the index (off by one errors inbound otherwise!)
      const { projectIndex } = action.payload
      const filteredProjects = state.projectArray.filter(project => project.Id !== projectIndex);

      return {
        ...state,
        projectData: filteredProjects
      }
    case actionTypes.UPDATE_WEEKS:
      return state
    case actionTypes.SET_RESOURCES:
      const { projectData } = action.payload
      return {
        ...state,
        projectData: Object.values(projectData)
      }
    default:
      return state
  }
}

export default projectReducer
