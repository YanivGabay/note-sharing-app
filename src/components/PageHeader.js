import React from 'react'



export const PageHeader = ({pageHeader}) => {
  return (
  <div className="card">
        <div className="card-body">
            <h1 className="display-1 text-center">{pageHeader}</h1>
        </div>
  

     
    </div>
  )
}

export default PageHeader
