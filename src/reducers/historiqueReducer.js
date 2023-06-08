import { createSlice } from '@reduxjs/toolkit'
import contractsService from '../services/contractsService';
const historiqueSlice = createSlice({
    name: 'historique',
    initialState: "",
    reducers:{
        setHistorique(state, action){
            return action.payload
        }
    }
})

export const {setHistorique} = historiqueSlice.actions

export const loadHistorique = (acc) => {
    return async dispatch =>{
        const historique = await contractsService.historique(acc)
        dispatch(setHistorique(historique))
    }
}

export default historiqueSlice.reducer