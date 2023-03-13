import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { ITask, User, Format, RequestError } from '../../types/types'
import dayjs, { Dayjs } from 'dayjs'
import { User as FBUser } from 'firebase/auth'
import { onSnapshot, collection, getDocs, setDoc, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { IRootState } from '../store'

interface InitialState {
	tasks: ITask[],
	selectedDay: Dayjs // - current day by default
	selectedWeek: Dayjs[] // - current week by default 
	format: Format
}

const currentWeek = (): Dayjs[] => {
	return new Array(7).fill(0).map((_, idx) => dayjs().startOf('week').add(idx, 'day'))
}

const initialState: InitialState = {
	tasks: [] as ITask[],
	selectedDay: dayjs(),
	selectedWeek: currentWeek(),
	format: Format.week,
}

export const getTasksForUser = createAsyncThunk<ITask[], FBUser, {rejectValue: RequestError}>(
	'calendar/getTasksForUser',
	async (user: FBUser, { rejectWithValue }) => {
		try {
			const querySnapshot = await getDocs(collection(db, `${user.displayName}`))
			const tasks: ITask[] = []
			querySnapshot.forEach(doc => {
				const task = {
					...doc.data(),
					startDate: dayjs(doc.data().startDate),
					endDate: dayjs(doc.data().endDate),
				} as ITask
				tasks.push(task)
			})
			return tasks
		} catch (error) {
			return rejectWithValue({
				message: error as string
			})
		}
	}
)

export const saveNewTask = createAsyncThunk<ITask, ITask, {state: IRootState, rejectValue: RequestError}>(
	'calendar/saveNewTask',
	async (task: ITask, { getState, rejectWithValue }) => {
		const user = (getState() as IRootState).auth.user as FBUser
		const startDate = task.startDate.format('YYYY-MM-DD HH:mm Z')
		const endDate = task.endDate.format('YYYY-MM-DD HH:mm Z')
		try	{
			
			await setDoc(doc(db, user.displayName!, task.id), {
				...task,
				startDate,
				endDate,
			})

			if (task.invitations.length > 0) {
				for (const invitation of task.invitations) {
					// - common tasks have the same id
					const receiverDisplayName = `${invitation.name} ${invitation.surname}`
					try {
						await setDoc(doc(db, receiverDisplayName, task.id), {
							...task,
							from: user.displayName,
							startDate,
							endDate,
							invitations: [{
								name: user.displayName?.split(' ')[0],
								surname: user.displayName?.split(' ')[1],
							}, ...task.invitations.filter(i => `${i.name} ${i.surname}` !== receiverDisplayName)]
						})
					} catch (error) {
						console.log(error)
					}
				}
			}
			
			return task
		} catch (error) {
			return rejectWithValue({
				message: error as string
			})
		}
	}
)

export const deleteTask = createAsyncThunk<string, ITask, {state: IRootState, rejectValue: RequestError}>(
	'calendar/deleteTask',
	async (task: ITask, { getState, rejectWithValue }) => {
		try {
			const user = (getState() as IRootState).auth.user as FBUser

			// - if I receive task from someone and its has/has't got other users
			if (task.from) {

				// - remove user from inviter's invitations array
				const docSnap = await getDoc(doc(db, task.from, task.id))
				if (docSnap.exists()) {
					// - array of all invited users except the current one
					const otherUsers = docSnap.data().invitations 
						.filter((userObj: User) => `${userObj.name} ${userObj.surname}` !== user.displayName)
					
					await updateDoc(doc(db, task.from, task.id), {
						invitations: otherUsers
					})

			 		// - remove user from other's invitations array
					for (const otherUser of otherUsers) {
						try {
							const docSnap = await getDoc(doc(db, `${otherUser.name} ${otherUser.surname}`, task.id))
							if (docSnap.exists()) {
								const invs = docSnap.data().invitations.filter((userObj: User) => `${userObj.name} ${userObj.surname}` !== user.displayName)
								await updateDoc(doc(db, `${otherUser.name} ${otherUser.surname}`, task.id), {
									invitations: invs
								})
							}
						} catch (error) {
							console.log(error)
						}
						
					}
				}

			// - if I create task and invite someone, task will be deleted on each user
			} else if (task.invitations.length > 0) {
				for (const invitation of task.invitations) {

					// - common tasks have the same id
					const receiverDisplayName = `${invitation.name} ${invitation.surname}`
					try {
						await deleteDoc(doc(db, receiverDisplayName, task.id))
					} catch (error) {
						console.log(error)
					}
				}
			} 

			await deleteDoc(doc(db, user.displayName!, task.id))
			return task.id

		} catch (error) {
			return rejectWithValue({
				message: error as string
			})
		}
	}
)

type IEditedTask = {
	prevTask: ITask
	editedTask: ITask
}

export const editTask = createAsyncThunk<ITask, IEditedTask, {state: IRootState, rejectValue: RequestError}>(
	'calendar/editTask',
	async (task: IEditedTask, { getState, rejectWithValue }) => {
		try {

			const { prevTask, editedTask } = task
			const user = (getState() as IRootState).auth.user as FBUser
			
			const startDate = editedTask.startDate.format('YYYY-MM-DD HH:mm Z')
			const endDate = editedTask.endDate.format('YYYY-MM-DD HH:mm Z')
			
			await updateDoc(doc(db, user.displayName!, editedTask.id), {
				...editedTask,
				startDate,
				endDate,
			})

			if (editedTask.invitations.length > 0 || prevTask.invitations.length !== editedTask.invitations.length) {
				for (const prevUser of prevTask.invitations) {
					const prevUserDisplayName = `${prevUser.name} ${prevUser.surname}`
					try {
						await deleteDoc(doc(db, prevUserDisplayName, editedTask.id))
					} catch (error) {
						console.log(error)
					}
				}

				for (const newUser of editedTask.invitations) {
					const newUserDisplayName = `${newUser.name} ${newUser.surname}`
					try {
						await setDoc(doc(db, newUserDisplayName, editedTask.id), {
							...editedTask,
							startDate,
							endDate,
							from: user.displayName,
							invitations: [{
								name: user.displayName?.split(' ')[0],
								surname: user.displayName?.split(' ')[1],
							}, ...editedTask.invitations.filter(i => `${i.name} ${i.surname}` !== newUserDisplayName)]
						})
					} catch (error) {
						console.log(error)
					}
				}
			}

			return editedTask
		} catch (error) {
			return rejectWithValue({
				message: error as string
			})
		}
	}
)

export const calendarSlice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {

		// - day that is selected now (current day by default)
		setSelectedDay: (state, action: PayloadAction<((prev: Dayjs) => Dayjs)>) => {
			const day = action.payload(state.selectedDay)
			state.selectedDay = day
		},

		// - week of the selected day (current day by default)
		setSelectedWeek: (state, action: PayloadAction<((prev: Dayjs[]) => Dayjs[])>) => {
			const week = action.payload(state.selectedWeek)
			state.selectedWeek = week
		},

		// - format of calendar state (day, week, month)
		setFormat: (state, action: PayloadAction<Format>) => {
			state.format = action.payload
		},

		// - clear calendar from tasks when sign out
		clearCalendar: (state, action: PayloadAction<undefined>) => {
			state.tasks.length = 0
		},

		// save: (state, action: PayloadAction<ITask>) => {
		// 	state.tasks.push(action.payload)
		// },

		// remove: (state, action: PayloadAction<string>) => {
		// 	state.tasks = state.tasks.filter(task => task.id !== action.payload)
		// },

		// edit: (state, action: PayloadAction<ITask>) => {
		// 	state.tasks = state.tasks.map(task => {
		// 		return (task.id === action.payload.id) ? action.payload : task
		// 	})
		// }
	},

	extraReducers: (builder) => {
		builder.addCase(getTasksForUser.fulfilled, (state, action) => {
			state.tasks = action.payload
		})
		builder.addCase(saveNewTask.fulfilled, (state, action) => {
			state.tasks.push(action.payload)
		})
		builder.addCase(deleteTask.fulfilled, (state, action) => {
			state.tasks = state.tasks.filter(task => task.id !== action.payload)
		})
		builder.addCase(editTask.fulfilled, (state, action) => {
			state.tasks = state.tasks.map(task => {
				return (task.id === action.payload.id) ? action.payload : task
			})
		})
	}

})

export const calendarReducer = calendarSlice.reducer
export const { 
	setSelectedDay, 
	setSelectedWeek, 
	setFormat, 
	clearCalendar
} = calendarSlice.actions









