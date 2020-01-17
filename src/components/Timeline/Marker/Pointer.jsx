import React from 'react'
import PropTypes from 'prop-types'

import { getDayMonth } from '../../../utils/formatDate'
import Marker from '.'

const PointerMarker = ({ time, date, visible, highlighted, dateFormatter, style }) => (
  <Marker modifier="pointer" x={time.toX(date)} visible={visible} highlighted={highlighted} style={style}>
    <div>
      <div>
        <strong>{dateFormatter ? dateFormatter(date) : getDayMonth(date)}</strong>
      </div>
    </div>
  </Marker>
)

PointerMarker.propTypes = {
  time: PropTypes.shape({
    toX: PropTypes.func.isRequired,
  }).isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  dateFormatter: PropTypes.func,
  visible: PropTypes.bool,
  highlighted: PropTypes.bool,
  style: PropTypes.shape({}),
}

export default PointerMarker
