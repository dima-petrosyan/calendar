import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ITask, Filter } from '../../types/types'

const initialState = {
	filter: null as Filter | null,
}

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		setFilter: (state, action: PayloadAction<Filter | null>) => {
			state.filter = action.payload
		}
	}
})

export const tasksReducer = tasksSlice.reducer
export const { setFilter } = tasksSlice.actions