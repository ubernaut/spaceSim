import React from 'react'
import HudElement from './HudElement'

const style = (props) => ({
  fontSize: '0.8em',
  display: 'flex',
  alignItems: 'start',
  flexFlow: 'column',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  padding: '1em',
})

const Selection = ({ data }) => {
  return !data || data === '' ? null : (
    <HudElement>
      {data.name === 'spaceShip' && data.userData && data.userData.ship ? (
        <ShipInfo data={data} />
      ) : (
        <Default data={data} />
      )}
    </HudElement>
  )
}

const Default = ({ data }) => (
  <div style={style()}>
    <label style={{ fontWeight: 'bold' }}>Selected Object</label>
    <pre style={{ width: '100%', height: '100%' }}>
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
)

const ShipInfo = ({ data }) => (
  <div style={style()}>
    <label style={{ fontWeight: 'bold' }}>{data.userData.displayName}</label>
    <ul style={{ listStyle: 'none', padding: 0 }}>
      <li>
        <b>Ship Hull Type</b>: {data.userData.ship.hull.type}
      </li>
      <li>
        <b>Ship Thruster Type</b>: {data.userData.ship.thrust.type}
      </li>
      <li>
        <b>Distance</b>: {data.distance.km} km
      </li>
      <li>
        <b>Speed</b>: {data.userData.ship.movementSpeed} m/s
      </li>
    </ul>
  </div>
)

export default Selection
