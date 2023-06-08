import { configureStore } from '@reduxjs/toolkit'
import accountReducer from './reducers/accountReducer'
import priceReducer from './reducers/priceReducer'
import historiqueReducer from './reducers/historiqueReducer'
import balanceReducer from './reducers/balanceReducer'


const store = configureStore({
    reducer: {
        account: accountReducer,
        balance: balanceReducer,
        historique: historiqueReducer,
        price: priceReducer,
    }
  })

export default store