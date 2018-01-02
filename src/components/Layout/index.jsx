import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import Sidebar from '../Sidebar'
import Timeline from '../Timeline'
import { addListener, removeListener } from '../../utils/events'
import raf from '../../utils/raf'
import getNumericPropertyValue from '../../utils/getNumericPropertyValue'

const noop = () => {}

class Layout extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isSticky: false,
      headerHeight: 0,
      scrollLeft: 0
    }
  }

  componentDidMount() {
    if (this.props.enableSticky) {
      addListener('scroll', this.handleScrollY)
      this.updateTimelineHeaderScroll()
      this.updateTimelineBodyScroll()
    }

    addListener('resize', this.handleResize)
    this.handleLayoutChange(() => this.scrollToNow())
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.enableSticky) {
      if (this.state.isSticky) {
        if (!prevState.isSticky) {
          this.updateTimelineHeaderScroll()
        }
        if (this.state.scrollLeft !== prevState.scrollLeft) {
          this.updateTimelineBodyScroll()
        }
      }
    }

    if (this.props.isOpen !== prevProps.isOpen) {
      this.handleLayoutChange()
    }
  }

  componentWillUnmount() {
    if (this.props.enableSticky) {
      removeListener('scroll', this.handleScrollY)
      removeListener('resize', this.handleResize)
    }
  }

  setHeaderHeight = (headerHeight) => {
    this.setState({ headerHeight })
  }

  scrollToNow = () => {
    const { time, scrollToNow, now } = this.props
    if (scrollToNow) {
      this.timeline.scrollLeft = time.toX(now) - (0.5 * this.props.timelineViewportWidth)
    }
  }

  updateTimelineBodyScroll = () => {
    this.timeline.scrollLeft = this.state.scrollLeft
  }

  updateTimelineHeaderScroll = () => {
    const { scrollLeft } = this.timeline
    this.setState({ scrollLeft })
  }

  handleHeaderScrollY = (scrollLeft) => {
    raf(() => {
      this.setState({ scrollLeft })
    })
  }

  handleScrollY = () => {
    raf(() => {
      const { headerHeight } = this.state
      const markerHeight = 0
      const { top, bottom } = this.timeline.getBoundingClientRect()
      const isSticky = (top <= -markerHeight) && (bottom >= headerHeight)
      this.setState(() => ({ isSticky }))
    })
  }

  handleScrollX = () => {
    raf(this.updateTimelineHeaderScroll)
  }

  calculateSidebarWidth = () => this.sidebar.offsetWidth + getNumericPropertyValue(this.layout, 'margin-left')

  calculateTimelineViewportWidth = () => this.timeline.offsetWidth

  handleLayoutChange = (cb) => {
    const sidebarWidth = this.calculateSidebarWidth()
    const timelineViewportWidth = this.calculateTimelineViewportWidth()
    if (
      sidebarWidth !== this.props.sidebarWidth ||
      timelineViewportWidth !== this.props.timelineViewportWidth
    ) {
      this.props.onLayoutChange(
        {
          sidebarWidth: this.calculateSidebarWidth(),
          timelineViewportWidth: this.calculateTimelineViewportWidth()
        },
        cb
      )
    }
  }

  handleResize = () => this.handleLayoutChange()

  render() {
    const {
      isOpen,
      tracks,
      now,
      time,
      timebar,
      toggleTrackOpen,
      sidebarWidth,
      timelineViewportWidth
    } = this.props

    const {
      isSticky,
      headerHeight,
      scrollLeft
    } = this.state
    return (
      <div
        className={`rt-layout ${isOpen ? 'rt-is-open' : ''}`}
        ref={(layout) => { this.layout = layout }}
      >
        <div
          className="rt-layout__side"
          ref={(sidebar) => { this.sidebar = sidebar }}
        >
          <Sidebar
            timebar={timebar}
            tracks={tracks}
            toggleTrackOpen={toggleTrackOpen}
            sticky={{ isSticky, headerHeight, sidebarWidth }}
          />
        </div>
        <div className="rt-layout__main">
          <div
            className="rt-layout__timeline"
            ref={(timeline) => { this.timeline = timeline }}
            onScroll={isSticky ? this.handleScrollX : noop}
          >
            <Timeline
              now={now}
              time={time}
              timebar={timebar}
              tracks={tracks}
              sticky={{
                isSticky,
                setHeaderHeight: this.setHeaderHeight,
                viewportWidth: timelineViewportWidth,
                handleHeaderScrollY: this.handleHeaderScrollY,
                headerHeight,
                scrollLeft
              }}
            />
          </div>
        </div>
      </div>
    )
  }
}

Layout.propTypes = {
  enableSticky: PropTypes.bool.isRequired,
  timebar: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  time: PropTypes.shape({}).isRequired,
  tracks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  now: PropTypes.instanceOf(Date),
  isOpen: PropTypes.bool,
  toggleTrackOpen: PropTypes.func,
  scrollToNow: PropTypes.bool,
  onLayoutChange: PropTypes.func.isRequired,
  sidebarWidth: PropTypes.number,
  timelineViewportWidth: PropTypes.number
}

export default Layout
