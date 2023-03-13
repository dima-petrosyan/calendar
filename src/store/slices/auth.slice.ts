import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import {
  createAction,
  AsyncThunk,
  AnyAction,
} from '@reduxjs/toolkit'
import { Dayjs } from 'dayjs' 
import { 
	createUserWithEmailAndPassword, 
	signInWithEmailAndPassword,
	updateProfile,
	onAuthStateChanged, 
	signOut,
	User 
} from 'firebase/auth'
import { auth, db } from '../../firebase'
import { doc, setDoc } from 'firebase/firestore'

import { getTasksForUser } from './calendar.slice'
import { getUsers } from './users.slice'

interface LoginUserData {
	login: string
	password: string
}

interface RegisterUserData extends LoginUserData {
	name: string
	surname: string
}

const initialState = {
	user: null as User | null,
	isError: false,
	isLoading: false,
}

export const registerUser = createAsyncThunk(
	'auth/registerUser',
	async (userData: RegisterUserData, { rejectWithValue, dispatch }) => {
		try {

			// - create new user
			const response = await createUserWithEmailAndPassword(auth, userData.login, userData.password)
			
			// - set user's displayName 
			await updateProfile(response.user, {
				displayName: `${userData.name} ${userData.surname}`
			})

			// - add new user to users db
			await setDoc(doc(db, `users`, response.user.uid), {
				...userData,
			})

			dispatch(setUserData(response.user))
			dispatch(getUsers())
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const loginUser = createAsyncThunk(
	'auth/loginUser',
	async (userData: LoginUserData, { rejectWithValue, dispatch }) => {
		try {
			const response = await signInWithEmailAndPassword(auth, userData.login, userData.password)
			dispatch(setUserData(response.user))
			dispatch(getUsers())
		} catch (error) {
			return rejectWithValue(error)
		}
	}
)

export const onAuthChanged = createAsyncThunk(
	'auth/onAuthChanged',
	async (_, { dispatch }) => {
		onAuthStateChanged(auth, (user) => {
			dispatch(setUserData(user))
			if (user) {
				dispatch(getUsers())
				dispatch(getTasksForUser(user))
			} 
		})
	}
)

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUserData: (state, action: PayloadAction<User | null>) => {
			state.user = action.payload
		},
		onSignOut: (state) => {
			signOut(auth)
		},
	},
	extraReducers: (builder) => {
		builder
			.addMatcher<FulfilledAction>(
				(action) => action.type.endsWith('/fulfilled'),
				(state, action) => {
					state.isLoading = false
					state.isError = false
				}
			)
			.addMatcher<RejectedAction>(
				(action) => action.type.endsWith('/rejected'),
				(state, action) => {
					state.isLoading = false
					state.isError = true
				}
			)
			.addMatcher<RejectedAction>(
				(action) => action.type.endsWith('/pending'),
				(state, action) => {
					state.isLoading = true
					state.isError = false
				}
			)

	}
})

export const authReducer = authSlice.reducer
export const { 
	setUserData, 
	onSignOut
} = authSlice.actions








