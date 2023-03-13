import React, { useState, useEffect, useMemo, useRef, Dispatch, SetStateAction } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { ITask, Format } from '../types/types'
import { setSelectedDay, setSelectedWeek, setFormat, editTask } from '../store/slices/calendar.slice'
import { useTypedSelector, useTypedDispatch } from '../hooks/redux'
import { useCalendar } from '../hooks/useCalendar'

import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import { alpha, colors } from '@mui/material'

import { Task } from '../components/task/Task'
import { TaskTitle } from '../components/task/TaskTitle'
import { TaskTitleGroup } from '../components/task/TaskTitleGroup'

import { DragDropContext, Droppable, Draggable, DropResult, ResponderProvided } from 'react-beautiful-dnd'

import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

type CalendarProps = {
	openModal: (isOpen: boolean, task?: ITask | null) => void 
}

export const Calendar: React.FC<CalendarProps> = ({ openModal }) => {

	const theme = useTheme()
	const isXlScreen = useMediaQuery(theme.breakpoints.up('xl'))

	// - connect to store 
	const dispatch = useTypedDispatch()
	const { calendar } = useTypedSelector(state => state)

	const { user } = useTypedSelector(state => state.auth)

	const { hours_arr, dayMatrix, weekMatrix, monthMatrix } = useCalendar(calendar.selectedDay, calendar.selectedWeek)
	
    const selectDay = (day: Dayjs) => {
    	dispatch(setSelectedDay(() => day))
    	dispatch(setFormat(Format.day))
    }

    const handleAddTask = (date: Dayjs, offset: number | null = null) => {
    	dispatch(setSelectedDay(() => date)) // - set time to selected day
    	openModal(true)
    }

    const isEqualToTime = (date: Dayjs): boolean => {
    	const now = dayjs()
    	return now.isBefore(date.add(1, 'hour')) && now.isAfter(date)
    }

    const cellHeight = 40

    const getDiffHours = (date: Dayjs) => {
		return cellHeight / 60 * dayjs().diff(date, 'minutes')
    }

    const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
    	if (!result.destination) return 

    	// - don't edit, if task has an owner
    	const prevTask = calendar.tasks.find(task => task.id === result.draggableId)
    	if (prevTask?.from) {
    		setIsAlertOpen(true)
    		return 
    	}

	    const fromDate = dayjs(result.source.droppableId)
	    const toDate = dayjs(result.destination.droppableId)
	   	if (!fromDate.isSame(toDate)) {
	    	if (prevTask) {
	   			dispatch(editTask({
		    		prevTask,
		    		editedTask: {
		    			...prevTask, 
		   				startDate: toDate,
		   				endDate: toDate.add(prevTask.endDate.diff(prevTask.startDate, 'minutes'), 'minutes'),
		   			}
		   		}))
	  		}
	   	}	
    }

    const [isTimeVisible, setIsTimeVisisble] = useState(false)

    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const handleCloseAlert = () => {
    	setIsAlertOpen(false)
    }
    
	return (
		<>
			<Snackbar 
				open={isAlertOpen} 
				onClose={handleCloseAlert} 
				autoHideDuration={3000}
				anchorOrigin={{ 
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<Alert onClose={handleCloseAlert} severity="warning" sx={{ width: '100%' }}>
					You can't edit receiving tasks!
				</Alert>
			</Snackbar>	
			<Box className={`calendar calendar--${calendar.format}`}>
				<Box className='calendar__header' bgcolor={'background.default'}>
					<div className='calendar__header-content'>
						{
							calendar.format === 'week' && calendar.selectedWeek.map((day: Dayjs, idx: number) => {
				    			return (
					    	 		<Box 
					    				key={idx}
					    				className={`calendar__weekday`}
					    				sx={{
											...(dayjs().isSame(day, 'day') && {
												'& span': {
													color: '#fff',
													bgcolor: 'primary.main'
												}
											}) 
										}} 
					    				bgcolor={'background.default'}
					    			>
					    				<div>{day.format('ddd')}</div>
					    				<span onClick={() => selectDay(day)}>{day.date()}</span>
					    				<div className='calendar__weekday-border'></div>
					    			</Box>
				    			)
				    		})
						}
						{
							calendar.format === 'day' && 
								<div style={{width: '80px'}}>
									<Box 
										className={`calendar__weekday`}
										sx={{
											...(dayjs().isSame(calendar.selectedDay, 'day') && {
												'& span': {
													color: '#fff',
													bgcolor: 'primary.main'
												}
											}) 
										}}
										bgcolor={'background.default'}
									>
										<div>{calendar.selectedDay.format('ddd')}</div>
						    			<span>{calendar.selectedDay.date()}</span>
						    			<div className='calendar__weekday-border'></div>
									</Box>
								</div>
						}
						{
							calendar.format === 'month' && null
						}
					</div>
				</Box>
				<Box className='calendar__aside' bgcolor={'background.default'}>
					{
						(calendar.format === 'day' || calendar.format === 'week') && hours_arr.map((hour: string, idx: number) => {
							return (
								<div key={idx} className='calendar__hour'>{hour}</div>
							)
						})
					}
					{
						calendar.format === 'month' && null
					}
				</Box>
				<DragDropContext onDragEnd={handleDragEnd}>
				<div className={`calendar__body calendar__body--${calendar.format}`}>
					{
						calendar.format === 'week' &&
							weekMatrix.map(week => {
								return week.map(date => {
									return (
										<Droppable droppableId={date.format('YYYY-MM-DD HH:mm')}>
											{(provided, snapshot) => (
												<Box 
													ref={provided.innerRef}
													{...provided.droppableProps}
													className={`calendar__cell ${isEqualToTime(date) && 'calendar__cell--today'}`}
													onClick={(event) => handleAddTask(date)}
												>
													{
														calendar.tasks
															.filter(task => task.startDate.isSame(date, 'hour'))
															.map((task, index) => (
																<Draggable key={task.id} draggableId={task.id} index={index}>
																	{(provided, snapshot) => (
																		<div
																			ref={provided.innerRef} 
																			{...provided.draggableProps} 
																			{...provided.dragHandleProps}
																		>
																			<Task 
																				task={task} 
																				format={calendar.format} 
																				openModal={openModal} 
																				currentUser={user} 
																			/>
																		</div>
																	)}
																</Draggable>
															))
													}
													{
														isEqualToTime(date) && (
															<Box 
																sx={{
																	top: `${getDiffHours(date)}px`
																}} 
																onMouseOver={() => setIsTimeVisisble(true)}
																onMouseOut={() => setIsTimeVisisble(false)}
																className='calendar__cell-line'
															>
															{
																isTimeVisible && (
																	<Typography sx={{color: 'rgb(239, 64, 59)', textAlign: 'center'}}>{dayjs().format('HH:mm')}</Typography>
																)
															}
															</Box>
														)
													}
													{provided.placeholder}
												</Box>
											)}
										</Droppable>
									)
								})
							})
					}
					{
						calendar.format === 'day' && 
							dayMatrix.map(date => {
								return (
									<Droppable droppableId={date.format('YYYY-MM-DD HH:mm')}>
										{(provided, snapshot) => (
											<Box 
												ref={provided.innerRef}
												{...provided.droppableProps}
												className={`calendar__cell ${isEqualToTime(date) && 'calendar__cell--today'}`}
												onClick={(event: React.MouseEvent<HTMLDivElement>) => {
													const offset = event.pageX - (event.target as HTMLDivElement).offsetLeft
													handleAddTask(date, offset)
												}}
											>
												{
													calendar.tasks
														.filter(task => task.startDate.isSame(date, 'hour'))
														.map((task, index) => (	
															<Draggable key={task.id} draggableId={task.id} index={index}>
																{(provided, snapshot) => (
																	<div
																		ref={provided.innerRef} 
																		{...provided.draggableProps} 
																		{...provided.dragHandleProps}
																	>			
																		<Task task={task} format={calendar.format} openModal={openModal} currentUser={user} />
																	</div>
																)}
															</Draggable>
														))
												}
												{
													isEqualToTime(date) && (
														<Box 
															sx={{
																top: `${getDiffHours(date)}px`
															}} 
															onMouseOver={() => setIsTimeVisisble(true)}
															onMouseOut={() => setIsTimeVisisble(false)}
															className='calendar__cell-line'
														>
														{
															isTimeVisible && (
																<Typography sx={{color: 'rgb(239, 64, 59)', textAlign: 'center'}}>{dayjs().format('HH:mm')}</Typography>
															)
														}
														</Box>
													)
												}
												{provided.placeholder}
											</Box>
										)}
									</Droppable>
								)
							})
					}
					{
						calendar.format === 'month' && 
							monthMatrix.map((date, idx) => {
								return (
									<div 
										style={{color: 'grey'}} 
										className='calendar__cell'
										onClick={() => selectDay(date)}
									>
										{
											idx < 7 && (
												<Typography sx={{
													fontSize: '11px', 
													textTransform: 'uppercase', 
													mt: '8px',
													color: 'text.primary',
													lineHeight: '12px',
												}}>
													{date.format('ddd')}
												</Typography>
											)
										}
										<Box sx={{
											padding: '5px 5px 1px',
											display: 'flex', 
											alignItems: 'center', 
											justifyContent: 'center',
											fontSize: '14px',
											color: 'text.secondary',
											...(calendar.selectedDay.isSame(date, 'month') && {
												color: 'text.primary',
											}),
										}}>
											<Typography 
												sx={{fontSize: 'inherit',}} 
												className={`calendar__date ${dayjs().isSame(date, 'day') && 'calendar__date--today'}`}
											>
												{date.format('D')}
											</Typography>
											<Typography sx={(theme) => ({
												fontSize: 'inherit',
												[theme.breakpoints.down('md')]: {
													display: 'none',
												}
											})}>
												{date.format('D') === '1' && date.format(' MMM')}
											</Typography>
										</Box>
										<div className='calendar__tasks'>
											<TaskTitleGroup
												tasks={calendar.tasks.filter(task => task.startDate.isSame(date, 'day'))}
												maxLength={isXlScreen ? 5 : 3}
												taskTitleProps={{
													tagHeight: '12px',
													openModal,
													currentUser: user,
													sx: {
														fontSize: 14,
														height: '16px'
													}
												}}
											/>
										</div>
									</div>
								)
							})
					}
				</div>
				</DragDropContext>
			</Box>
		</>
	)
}







