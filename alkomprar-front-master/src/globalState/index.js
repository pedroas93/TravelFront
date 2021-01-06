import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { pendingTasksReducer } from 'react-redux-spinner'
import app from './app'
import PDF from '../components/Reducers/PDF/PDF_Reducer'
import perfil from '../components/Reducers/Perfil/Perfil_Reducer'
import menu from '../components/Reducers/Menu/Menu_Reducer'
import landing from '../components/Reducers/Landing/Landing_Reducer'

export default combineReducers({
  routing: routerReducer,
  pendingTasks: pendingTasksReducer,
  app,
  PDF,
  perfil,
  menu,
  landing,
})
