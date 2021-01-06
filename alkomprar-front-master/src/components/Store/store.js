import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
//importar los reducers
import reducerPrincipal from '../Reducers/PDF/PDF_Reducer';

const initialState = {};

const middleware = [thunk];

const store = createStore(reducerPrincipal, initialState, compose(applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
));

export default store;