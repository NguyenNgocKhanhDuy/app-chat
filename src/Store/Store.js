import { configureStore } from '@reduxjs/toolkit'
import {root} from "./RootReducer";

const store = configureStore({reducer: root});

export default store;