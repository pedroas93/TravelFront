const redux = import('redux');

const createStore = redux.createStore;


//state inicial
const stateInicial ={
    usuarios: []
}

// Reducer
//State y accion
const reducerPrincipal = (state = stateInicial, action) =>{
    if(action.type === 'AGREGAR_USUARIO'){
        return{
            ...state,
            usuarios: action.nombre
        }
    }
    return state;
}

// CREATE STORE Y STORE
// 3 parametros, reducer, state inicial, applymiddleware
const store = createStore(reducerPrincipal);

//Suscribe o suscripcion

store.subscribe(() => {
})

// Dispatch: es la forma de cambiar el state
store.dispatch({type: 'AGREGAR_USUARIO', nombre: 'JUAN'});

