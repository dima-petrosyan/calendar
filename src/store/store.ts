import { configureStore, combineReducers, createListenerMiddleware } from '@reduxjs/toolkit'
import { calendarReducer } from './slices/calendar.slice'
import { authReducer, setUserData } from './slices/auth.slice'
import { usersReducer } from './slices/users.slice'
import { tasksReducer } from './slices/tasks.slice'
import { analyticsReducer } from './slices/analytics.slice'

import { ITask } from '../types/types'

// import { save, remove, edit } from './slices/calendar.slice'
// import dayjs from 'dayjs'
// import { onSnapshot, collection } from 'firebase/firestore'
// import { db } from '../firebase'

// const listenerMiddleware = createListenerMiddleware()

// - add event listener for case, when someone send an invitation render it online
// listenerMiddleware.startListening({
// 	actionCreator: setUserData,
// 	effect: (action, listenerApi) => {
// 		listenerApi.cancelActiveListeners()
// 		if (action.payload) {
// 			onSnapshot(collection(db, action.payload.displayName!), (snapshot) => {
// 		   		snapshot.docChanges().forEach((change) => {
// 		   			console.log(change.doc.data())
// 		   			if (change.type === 'added') {
// 		   				listenerApi.dispatch(save({
// 		   					...change.doc.data(),
// 		   					startDate: dayjs(change.doc.data().startDate),
// 		   					endDate: dayjs(change.doc.data().endDate),
// 		   				} as ITask))
// 		   			}
// 		   			if (change.type === 'modified') {
// 		   				listenerApi.dispatch(edit({
// 		   					...change.doc.data(),
// 		   					startDate: dayjs(change.doc.data().startDate),
// 		   					endDate: dayjs(change.doc.data().endDate),
// 		   				} as ITask))
// 		   			}
// 		   			if (change.type === 'removed') {
// 		   				listenerApi.dispatch(remove(change.doc.data().id))
// 		   			}
// 		   		})
// 			})
// 		} 
// 	}
// })

const rootReducer = combineReducers({
	calendar: calendarReducer,
	auth: authReducer,
	users: usersReducer,
	tasks: tasksReducer,
	analytics: analyticsReducer,
})

export const store = configureStore({
	reducer: rootReducer,
	// middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(listenerMiddleware.middleware)
})

export type IDispatch = typeof store.dispatch
export type IRootState = ReturnType<typeof store.getState>






