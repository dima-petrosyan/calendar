import { Dayjs } from 'dayjs'

// Aside types 

export type IData = {
    id: number
    parentId: number | null
    name: string
    children?: Array<IData>
}

// Calendar types

export type User = {
    name: string
    surname: string
}

export type IColor = {
    label: string
    code: string
}

export type ITask = {
	id: string
	title: string
	description?: string
	color: IColor
	startDate: Dayjs
	endDate: Dayjs
    invitations: User[]
    from?: string
	offset?: number | null
}

export enum Format {
    month = 'month',
    week = 'week',
    day = 'day',
}

export enum Filter {
    date = 'date',
    tag = 'tag',
    invitations = 'invitations'
}

export type RequestError = {
    message: string
}


