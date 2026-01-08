import React from 'react'

const CommonButton = ({ onClick, children }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick}>
      {children}
    </Button>
  )
}

export default commonButton