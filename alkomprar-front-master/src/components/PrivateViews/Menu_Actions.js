import {
    setDataMenu,
} from '../../globalState/app';

export const SetMenuCss = data => async (dispatch, getState) => {
    dispatch({
        type: setDataMenu,
        payload: data,
      })
      
}

export const SetMenuManager = data => async (dispatch, getState) => {
    dispatch({
        type: setDataMenu,
        payload: data,
      })
      
}