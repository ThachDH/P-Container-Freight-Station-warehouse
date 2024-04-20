import { configureStore } from "@reduxjs/toolkit";
import menuReducers from "./reducers/menuReducers";

export default configureStore({
  reducer: {
    menu: menuReducers,
  },
});
