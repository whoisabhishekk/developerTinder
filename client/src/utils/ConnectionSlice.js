import {createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "./constants";



export const ConnectionSlice = createSlice({
    name:"connection",
    initialState : null,
    reducers:{
        addConnections : (state, action) => action.payload,
        removeConnections :()=>null,
    }
})

export const {addConnections , removeConnections} = ConnectionSlice.actions;
export default ConnectionSlice.reducer;
