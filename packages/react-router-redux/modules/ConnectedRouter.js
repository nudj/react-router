import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Router } from 'react-router'

import { LOCATION_CHANGE } from './reducer'

class ConnectedRouter extends Component {
  static propTypes = {
    store: PropTypes.object,
    history: PropTypes.object,
    onChange: PropTypes.func,
    children: PropTypes.node
  }

  static contextTypes = {
    store: PropTypes.object
  }

  handleLocationChange = location => {
    const dispatch = this.store.dispatch
    const onChange = this.props.onChange || function () { return Promise.resolve() }
    const action = this.props.history.action
    onChange(dispatch, location, action).then(function () {
      dispatch({
        type: LOCATION_CHANGE,
        payload: location
      })
    })
  }

  componentWillMount() {
    const { store:propsStore, history } = this.props
    this.store = propsStore || this.context.store

    this.unsubscribeFromHistory = history.listen(this.handleLocationChange)
  }

  componentWillUnmount() {
    if (this.unsubscribeFromHistory) this.unsubscribeFromHistory()
  }

  render() {
    return <Router {...this.props} />
  }
}

export default ConnectedRouter
