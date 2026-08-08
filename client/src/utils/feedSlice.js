import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: null,
    reducers: {
        addFeed: (state, action) => {
            return action.payload;
        },
        removeFeed: (state) => {
            return null;
        },
        removeUserFromFeed: (state, action) => {
            return state.filter((user) => user._id !== action.payload);
        }
    }
})
export default feedSlice.reducer;
export const { addFeed, removeFeed, removeUserFromFeed } = feedSlice.actions;
