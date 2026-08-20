import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  isMobileMenuOpen: boolean;
  isScrolled: boolean;
  activeModal: string | null;
}

const initialState: UIState = {
  isMobileMenuOpen: false,
  isScrolled: false,
  activeModal: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    closeMobileMenu: (state) => {
      state.isMobileMenuOpen = false;
    },
    setScrolled: (state, action: PayloadAction<boolean>) => {
      state.isScrolled = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const {
  toggleMobileMenu,
  closeMobileMenu,
  setScrolled,
  openModal,
  closeModal,
} = uiSlice.actions;
export default uiSlice.reducer;
