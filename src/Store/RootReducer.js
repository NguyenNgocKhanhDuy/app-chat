import {createReducer} from "@reduxjs/toolkit";


const initState = {
    user: "",
    code: "",
}

export const root = createReducer(initState, (builder) => {
    builder
        .addCase('user.get', (state, action) => {
            return { ...state, user: action.payload.user }
        })
        .addCase('user.set', (state, action) => {
            return { ...state, user: action.payload.user }
        })
        .addCase('code.get', (state, action) => {
            return { ...state, code: action.payload.code }
        })
        .addCase('code.set', (state, action) => {
            return { ...state, code: action.payload.code }
        });
});
