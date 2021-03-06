import React from 'react';
import thunk from 'redux-thunk';

import { applyMiddleware, combineReducers, createStore } from 'redux';
import { render } from 'react-dom';
import { IndexRoute, Router, Route, browserHistory } from 'react-router';
import { routerMiddleware, routerReducer, syncHistoryWithStore } from 'react-router-redux';

import MainTemplate from './templates/main/Main';

import HomePage from './pages/home/Home';
import PersonalPage from './pages/personal/Personal';
import FormationPage from './pages/formation/Formation';
import AttendancePage from './pages/attendance/Attendance';
import EmployeesPage from './pages/employee/Employee';

import './App.css';

const router = routerMiddleware(browserHistory);

const store = createStore(
  combineReducers({
    routing: routerReducer
  }),
  applyMiddleware(
    thunk,
    router
  )
);

const history = syncHistoryWithStore(browserHistory, store);

render(
  <Router history={history}>
    <Route path={CONFIG.baseHref} component={MainTemplate}>
      <IndexRoute component={HomePage} />
      <Route component={PersonalPage} path="personal" />
      <Route component={FormationPage} path="formation" />
      <Route component={AttendancePage} path="attendance" />
      <Route component={EmployeesPage} path="employee" />
    </Route>
  </Router>,
  document.getElementById('app')
);
