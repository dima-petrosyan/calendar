import { createSelector, Selector } from '@reduxjs/toolkit'
import { Filter, ITask } from '../../types/types'
import { IRootState } from '../store'

export const selectAllTasks = (state: IRootState) => state.calendar.tasks
export const selectFilter = (state: IRootState) => state.tasks.filter

export const selectTasksByFilter = createSelector(
	[selectAllTasks, selectFilter],
	(allTasks: ITask[], filter: Filter | null) => {
		const tasksCopy = allTasks.slice()
		switch (filter) {
			case Filter.date: 
				return tasksCopy.sort((a, b) => a.startDate.diff(b.startDate))
			case Filter.tag:
				return tasksCopy.sort((a, b) => (a.color.label.length - b.color.label.length))
			case Filter.invitations:
				return tasksCopy.sort((a, b) => (a.invitations.length - b.invitations.length))
			default: 
				return allTasks
		}
	}
)