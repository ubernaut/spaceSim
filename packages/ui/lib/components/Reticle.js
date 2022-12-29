import React from 'react'
import PropTypes from 'prop-types'

const style = (props) => ({
  fontSize: '1em',
  display: 'flex',
  alignItems: 'center',
  flexFlow: 'column',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  minWidth: '100px',
  minHeight: '100px',
  borderRadius: '100px',
  border: '1px dashed #44ee4455',
})

const BodyCounter = ({ bodies }) => {
  return <div style={style()} />
}

BodyCounter.propTypes = {
  bodies: PropTypes.arrayOf(PropTypes.object),
}

export default BodyCounter
