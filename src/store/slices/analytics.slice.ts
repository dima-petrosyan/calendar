import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Serie, Datum } from '@nivo/line'
import { ITask, IColor } from '../../types/types'

type InitialState = {
	selectedColor: IColor | null
}

const initialState: InitialState = {
	selectedColor: null,
}

const analyticsSlice = createSlice({
	name: 'analytics',
	initialState,
	reducers: {
		setSelectedColor: (state, action: PayloadAction<IColor | null>) => {
			state.selectedColor = action.payload
		},
	}

})

export const analyticsReducer = analyticsSlice.reducer
export const { setSelectedColor } = analyticsSlice.actions