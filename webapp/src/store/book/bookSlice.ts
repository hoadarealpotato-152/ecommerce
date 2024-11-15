import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TBook } from "../../types/book";

export interface BookState {
  bookList: TBook[];
  currentPage: number;
  totalItems: number;
  searchValue: string;
  filterCategory?: string[];
}

const initialState: BookState = {
  bookList: [],
  currentPage: 1,
  totalItems: 1,
  searchValue: '',
  filterCategory: [],
};

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    updateBookState: (state, action: PayloadAction<Partial<BookState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

// this is for dispatch
export const { updateBookState } = bookSlice.actions;

// this is for configureStore
export default bookSlice.reducer;
