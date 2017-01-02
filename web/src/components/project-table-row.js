import React, { PropTypes } from 'react'

const ProjectTableRow = (props) => {
  return (
    <tr>
      <td>
        <div className='slds-truncate'>{props.id}</div>
      </td>
      <td>
        <div className='slds-truncate'>{props.name}</div>
      </td>
      <td>
        <div className='slds-truncate'>{props.customer}</div>
      </td>
      <td>
        <div className='slds-truncate'>{props.resources}</div>
      </td>
    </tr>
  )
}

ProjectTableRow.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  customer: PropTypes.string,
  resources: PropTypes.array
}

export default ProjectTableRow
