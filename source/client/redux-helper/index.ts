import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function* rootSaga() {
    yield [];
}

const rootReducer = combineReducers({
    default: (state = {}) => {
        return state;
    },
});
class ReduxStoreCreator {
    public createStore(initialState = {}) {
        const sagaMiddleware = createSagaMiddleware();
        const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
        sagaMiddleware.run(rootSaga);
        return store;
    }
}

export const storeCreator = new ReduxStoreCreator();
