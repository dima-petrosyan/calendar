import { createSlice, PayloadAction, createAsyncThunk, SerializedError } from '@reduxjs/toolkit'
import { collection, getDocs, setDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase'
import { User, RequestError } from '../../types/types'

interface InitialState {
	users: User[]
	// error: string | null
}

const initialState: InitialState = {
	users: [],
	// error: null,
}

export const getUsers = createAsyncThunk<User[], undefined, {rejectValue: RequestError}>(
	'users/getUsers',
	async (_, { rejectWithValue }) => {
		try {
			const querySnapshot = await getDocs(collection(db, `users`))
			const users: Array<User> = []
			querySnapshot.forEach(doc => {
				const user = {
					name: doc.data().name,
					surname: doc.data().surname,
				} as User
				users.push(user)
			})
			return users 
		} catch (error) {
			return rejectWithValue({
				message: error as string
			}) 
		}
	}
)

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {
		
	},

	extraReducers: (builder) => {
		builder.addCase(getUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
			state.users = action.payload
			// state.error = null
		})
		builder.addCase(getUsers.rejected, (state, { payload }) => {
			state.users = [] 
			// if (payload) state.error = payload.message
		})
	}

})

export const usersReducer = usersSlice.reducer



















