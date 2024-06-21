// import {createReducer} from "@reduxjs/toolkit";
//
// const initState= {
//     user: "",
// };
//
// export const root= createReducer(initState,{
//     'user.get': (state, action) => ({
//         ...state,
//         user: action.payload.user
//     }),
//
//     'user.set': (state, action) => ({
//         ...state,
//         user: action.payload
//     }),
// })
//
//


import { createReducer } from "@reduxjs/toolkit";

const initState = {
    user: "",
};

export const root = createReducer(initState, (builder) => {
    builder
        .addCase('user.get', (state, action) => {
            state.user = action.payload.user;
        })
        .addCase('user.set', (state, action) => {
            state.user = action.payload;
        });
});
