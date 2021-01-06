import React, {Component} from 'react';
import Logger from "../models/Logger";
import Router from "./Router";
//Redux
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import reducer from '../globalState'
import { composeWithDevTools } from 'redux-devtools-extension'
import createHistory from 'history/createHashHistory'
import { routerMiddleware } from 'react-router-redux'


// import store from './Store/store';
const history = createHistory()
const router = routerMiddleware(history)
const middlewares = [router, thunk]

const store = createStore(reducer, composeWithDevTools(applyMiddleware(...middlewares)))

class App extends Component {
  constructor(props) {
    super(props);
    Logger.setLogger(this.constructor.name);
  }

  render() {
    Logger.info('Starting app');
    return (
      <Provider store={store}>
        <React.Fragment>
          <Router/>
        </React.Fragment>
      </Provider>
    );
  }
}

export default App;
