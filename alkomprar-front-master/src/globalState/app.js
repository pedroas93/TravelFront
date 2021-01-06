import { createAction, createReducer } from 'redux-act'
import { push } from 'react-router-redux'
import { pendingTask, begin, end } from 'react-redux-spinner'
import { notification, message } from 'antd'
import TagManager from 'react-gtm-module'

const REDUCER = 'app'
const NS = `@@${REDUCER}/`

const _setFrom = createAction(`${NS}SET_FROM`)
const _setLoading = createAction(`${NS}SET_LOADING`)
const _setHideLogin = createAction(`${NS}SET_HIDE_LOGIN`)

export const setUserState = createAction(`${NS}SET_USER_STATE`)
export const setUpdatingContent = createAction(`${NS}SET_UPDATING_CONTENT`)
export const setActiveDialog = createAction(`${NS}SET_ACTIVE_DIALOG`)
export const deleteDialogForm = createAction(`${NS}DELETE_DIALOG_FORM`)
export const addSubmitForm = createAction(`${NS}ADD_SUBMIT_FORM`)
export const deleteSubmitForm = createAction(`${NS}DELETE_SUBMIT_FORM`)
export const setLayoutState = createAction(`${NS}SET_LAYOUT_STATE`)
//Metodos sobre LANDING
export const setDataLanding = createAction(`${NS}SET_DATA_LANDING`)
//Metodos sobre PERFIL
export const setDataPerfil = createAction(`${NS}SET_DATA_PERFIL`)
//Metodos sobre Auth
export const setDataUserData = createAction(`${NS}SET_DATA_USER`)
//Metodos sobre estilos
export const setDataMenu = createAction(`${NS}SET_DATA_MENU`)
//Metodos sobre PDF
export const setPDFNavigation = createAction(`${NS}SET_PDF_NAVIGATION`)
export const setPDFInformation = createAction(`${NS}SET_PDF_INFORMATION`)


export const setLoading = isLoading => {
  const action = _setLoading(isLoading)
  action[pendingTask] = isLoading ? begin : end
  return action
}

const tagManagerArgs = {
    gtmId: 'GTM-PD7NJCD'
}

TagManager.initialize(tagManagerArgs)

export const resetHideLogin = () => (dispatch, getState) => {
  const state = getState()
  if (state.pendingTasks === 0 && state.app.isHideLogin) {
    dispatch(_setHideLogin(false))
  }
  return Promise.resolve()
}

export const initAuth = roles => (dispatch, getState) => {
  // Use Axios there to get User Data by Auth Token with Bearer Method Authentication
  //const userRole = window.localStorage.getItem('app.Role')
  const token = window.localStorage.getItem('app.Authorization')
  const state = getState()
  if (!state.app.userState || !state.app.userState.ID) {
    const setUser = userState => {
      dispatch(
        setUserState({
          userState: {
            ...userState,
          },
        }),
      )

      return Promise.resolve(true)
    }

  }

  if (token) {
    return Promise.resolve(true)
  }
  const location = state.routing.location
  const from = location.pathname + location.search
  dispatch(_setFrom(from))
  dispatch(push('/login'))
  return Promise.reject()
}


export const logout = () => (dispatch, getState) => {
  dispatch(
    setUserState({
      userState: {
        email: '',
        role: '',
      },
    }),
  )

  window.localStorage.setItem('app.Authorization', '')
  window.localStorage.setItem('app.Role', '')
  dispatch(push('/login'))
}

export const register = () => (dispatch, getState) => {
  window.localStorage.setItem('app.Authorization', '')
  window.localStorage.setItem('app.Role', '')
  dispatch(push('/register'))
}
const initialState = {
  // APP STATE
  from: '',
  isUpdatingContent: false,
  isLoading: false,
  activeDialog: '',
  dialogForms: {},
  submitForms: {},
  isHideLogin: false,

  // LAYOUT STATE
  layoutState: {
    isMenuTop: false,
    menuMobileOpened: false,
    menuCollapsed: false,
    menuShadow: true,
    themeLight: true,
    squaredBorders: false,
    borderLess: true,
    fixedWidth: false,
    settingsOpened: false,
  },

  // USER STATE
  userState: {
    email: '',
    role: '',
  },
}

export default createReducer(
  {
    [_setFrom]: (state, from) => ({ ...state, from }),
    [_setLoading]: (state, isLoading) => ({ ...state, isLoading }),
    [_setHideLogin]: (state, isHideLogin) => ({ ...state, isHideLogin }),
    [setUpdatingContent]: (state, isUpdatingContent) => ({ ...state, isUpdatingContent }),
    [setUserState]: (state, { userState }) => ({ ...state, userState }),
    [setLayoutState]: (state, param) => {
      const layoutState = { ...state.layoutState, ...param }
      const newState = { ...state, layoutState }
      window.localStorage.setItem('app.layoutState', JSON.stringify(newState.layoutState))
      return newState
    },
    [setActiveDialog]: (state, activeDialog) => {
      const result = { ...state, activeDialog }
      if (activeDialog !== '') {
        const id = activeDialog
        result.dialogForms = { ...state.dialogForms, [id]: true }
      }
      return result
    },
    [deleteDialogForm]: (state, id) => {
      const dialogForms = { ...state.dialogForms }
      delete dialogForms[id]
      return { ...state, dialogForms }
    },
    [addSubmitForm]: (state, id) => {
      const submitForms = { ...state.submitForms, [id]: true }
      return { ...state, submitForms }
    },
    [deleteSubmitForm]: (state, id) => {
      const submitForms = { ...state.submitForms }
      delete submitForms[id]
      return { ...state, submitForms }
    },
  },
  initialState,
)
