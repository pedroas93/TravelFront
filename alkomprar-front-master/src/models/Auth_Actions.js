import {
    setDataUserData,
} from '../globalState/app';

export const SetAuth = data => async (dispatch, getState) => {
    dispatch({
        type: setDataUserData,
        payload: data,
      })
}