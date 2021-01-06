import {    
    setPDFInformation,
    setPDFNavigation
} from '../../globalState/app'

export const SetPDFNavigateState = id => async (dispatch, getState) => {
    dispatch({
        type: setPDFNavigation,
        payload: id,
      })
}

export const setPDFInformationState = id => async dispatch => {
    dispatch({
      type: setPDFInformation,
      payload: id,
    })
}
