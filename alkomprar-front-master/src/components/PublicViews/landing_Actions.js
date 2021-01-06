import {
    setDataLanding,
} from '../../globalState/app';

export const setDataLandingTotal = (data) => async (dispatch, getState) => {
    dispatch({
        type: setDataLanding,
        payload: data,
      })
      
}   
