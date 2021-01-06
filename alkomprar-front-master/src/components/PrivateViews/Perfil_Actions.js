import {
    setDataPerfil,
} from '../../globalState/app';

export const SetPerfil = data => async (dispatch, getState) => {
    dispatch({
        type: setDataPerfil,
        payload: data,
      })
      
}


