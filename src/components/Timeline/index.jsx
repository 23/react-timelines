import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Header from './Header'
import Body from './Body'
import NowMarker from './Marker/Now'
import PointerMarker from './Marker/Pointer'
import getMouseX from '../../utils/getMouseX'
import getGrid from '../../utils/getGrid'

class Timeline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      pointerDate: null,
      pointerVisible: false,
      pointerHighlighted: false,
    }
  }

  handleMouseMove = e => {
    const { time } = this.props
    this.setState({ pointerDate: time.fromX(getMouseX(e)) })
  }

  handleMouseLeave = () => {
    this.setState({ pointerHighlighted: false })
  }

  handleMouseEnter = () => {
    this.setState({ pointerVisible: true, pointerHighlighted: true })
  }

  render() {
    const { now, time, timebar, tracks, sticky, clickElement, markers, pointerDateFormatter } = this.props

    const { pointerDate, pointerVisible, pointerHighlighted } = this.state

    const grid = getGrid(timebar)

    return (
      <div className="rt-timeline" style={{ width: time.timelineWidthStyle }}>
        {now && <NowMarker now={now} visible time={time} />}
        {markers &&
          markers.map(marker => (
            <PointerMarker date={marker.date} time={time} visible highlighted dateFormatter={() => marker.content} />
          ))}
        {pointerDate && (
          <PointerMarker
            date={pointerDate}
            time={time}
            visible={pointerVisible}
            highlighted={pointerHighlighted}
            dateFormatter={pointerDateFormatter}
          />
        )}
        <Header
          time={time}
          timebar={timebar}
          onMove={this.handleMouseMove}
          onEnter={this.handleMouseEnter}
          onLeave={this.handleMouseLeave}
          width={time.timelineWidthStyle}
          sticky={sticky}
        />
        <Body time={time} grid={grid} tracks={tracks} clickElement={clickElement} />
      </div>
    )
  }
}

Timeline.propTypes = {
  now: PropTypes.instanceOf(Date),
  markers: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node,
      date: PropTypes.date,
    })
  ),
  time: PropTypes.shape({
    fromX: PropTypes.func.isRequired,
    toStyleLeftAndWidth: PropTypes.func,
    timelineWidthStyle: PropTypes.string,
  }).isRequired,
  timebar: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string,
    }).isRequired
  ).isRequired,
  tracks: PropTypes.arrayOf(PropTypes.shape({})),
  sticky: PropTypes.shape({}),
  clickElement: PropTypes.func,
  pointerDateFormatter: PropTypes.func,
}

export default Timeline
