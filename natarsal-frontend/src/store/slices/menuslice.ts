import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "appetizer" | "main" | "dessert" | "beverage";
  image: string;
  isRecommended?: boolean;
  isSpicy?: boolean;
  isVegetarian?: boolean;
}

interface MenuState {
  items: MenuItem[];
  selectedCategory: string | null;
  searchQuery: string;
  isLoading: boolean;
}

const initialState: MenuState = {
  items: [],
  selectedCategory: null,
  searchQuery: "",
  isLoading: false,
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuItems: (state, action: PayloadAction<MenuItem[]>) => {
      state.items = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setMenuItems, setCategoryFilter, setSearchQuery, setLoading } =
  menuSlice.actions;
export default menuSlice.reducer;
