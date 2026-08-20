import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ReservationFormData {
  date: string;
  time: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  notes: string;
  occasion?: "birthday" | "anniversary" | "business" | "other";
}

interface ReservationState {
  formData: ReservationFormData;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: ReservationState = {
  formData: {
    date: "",
    time: "",
    guests: 2,
    name: "",
    email: "",
    phone: "",
    notes: "",
    occasion: undefined,
  },
  isLoading: false,
  isSuccess: false,
  error: null,
};

const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    updateFormData: (
      state,
      action: PayloadAction<Partial<ReservationFormData>>,
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.isSuccess = false;
      state.error = null;
    },
    submitStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    submitSuccess: (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    },
    submitFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  updateFormData,
  resetForm,
  submitStart,
  submitSuccess,
  submitFailure,
} = reservationSlice.actions;
export default reservationSlice.reducer;
