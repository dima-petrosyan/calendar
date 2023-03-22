import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Line } from '../components/charts/Line.chart'
import { Pie } from '../components/charts/Pie.chart'
import { TimeRange } from '../components/charts/TimeRange.chart'
import { Serie, Datum } from '@nivo/line'
import { CalendarDatum } from '@nivo/calendar'
import dayjs, { Dayjs, OpUnitType } from 'dayjs'
import { User as FBUser } from 'firebase/auth'
import { setSelectedColor } from '../store/slices/analytics.slice'

import { useTypedSelector, useTypedDispatch } from '../hooks/redux'
import { useCalendar } from '../hooks/useCalendar'
import { Format, ITask, IColor } from '../types/types'
import { TaskTitle } from '../components/task/TaskTitle'
import { TaskTitleGroup } from '../components/task/TaskTitleGroup'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { joinByProperty, JoinedObject } from '../utils/utils'

import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent, { timelineOppositeContentClasses, } from '@mui/lab/TimelineOppositeContent'

type AnalyticsProps = {
    openModal: (isOpen: boolean, task?: ITask | null) => void
    currentUser: FBUser | null
}

export const Analytics: React.FC<AnalyticsProps> = (props) => {

    const { calendar } = useTypedSelector(state => state)
    const { analytics } = useTypedSelector(state => state)

    const dispatch = useTypedDispatch()

    const { dayMatrix, weekMatrix, monthMatrix } = useCalendar(calendar.selectedDay, calendar.selectedWeek, false)

    React.useLayoutEffect(() => {
        if (!calendar.tasks.some(task => task.color.label === analytics.selectedColor?.label)) {
            dispatch(setSelectedColor(null))
        }
    }, [calendar.tasks])

    // - convert tasks to object with key - color label, value - array of tasks with such color
    const splitTasksByColor = (tasks: ITask[]): JoinedObject<ITask> => {
        return joinByProperty<ITask>(tasks, 'color', 'label')
    }

    // - get options for autocomplete
    const options = Object.entries(splitTasksByColor(calendar.tasks)).map(([key, value]) => ({
        label: key,
        code: value[0].color.code,
    }))

    const pointsFor = (arrOfTasks: ITask[], period: Dayjs[], filterValue: OpUnitType, formatValue: string): Datum[] => {
        return period.map(date => {
            const tasks = (arrOfTasks ?? []).filter(task => task.startDate.isSame(date, filterValue))
            return {
                x: date.format(formatValue),
                y: tasks.length,
                tasks: tasks,
            }
        })
    }

    // - get points for line chart 
    const getPoints = (arrOfTasks: ITask[]): Datum[] => {
        switch (calendar.format) {
            case Format.day: {
                return pointsFor(arrOfTasks, dayMatrix, 'hour', 'HH')
            }
            case Format.week: {
                return pointsFor(arrOfTasks, calendar.selectedWeek, 'day', 'DD.MM')
            }
            case Format.month: {
                return pointsFor(arrOfTasks, monthMatrix, 'day', 'D')
            }
        }
    }

    // - get data for line chart, depends on selected color
    const lineChartData = (tasks: ITask[], color: IColor | null): Serie[] => {
        if (color) {
            const colorsObj = splitTasksByColor(tasks)
            const splitLineData = [{
                id: color.label,
                color: color.code,
                data: getPoints(colorsObj[color.label])
            }]
            return splitLineData
        }
        // - if no color selected, return all colors data
        return [{
            id: 'tasks',
            color: 'rgb(140, 203, 245)',
            data: getPoints(tasks)
        }]
    }

    // - get data for pie chart
    const pieChartData = (tasks: ITask[]) => {
        const colorsObj = splitTasksByColor(tasks)
        return Object.entries(colorsObj).map(([key, value]) => {
            return {
                id: key,
                color: value[0].color.code,
                value: value.length,
            }
        })
    }

    // - get data for time range chart (calendar)
    const getTimeRangeData = (tasks: ITask[]): CalendarDatum[] => {
        return tasks.map((task, idx, allTasks) => ({
            value: allTasks.filter(item => task.startDate.isSame(item.startDate, 'day')).length,
            day: task.startDate.format('YYYY-MM-DD'),
        }))
    }

    return ( 
        <Box sx={{minWidth: '500px'}}>
            <Stack direction='row' justifyContent='flex-end'>
                <Autocomplete
                    value={analytics.selectedColor}
                    onChange={(event: any, newValue: IColor | null) => {
                        dispatch(setSelectedColor(newValue))
                    }} 
                    size='small'
                    disablePortal={false}
                    options={options}
                    sx={{ width: '200px' }}
                    renderOption={(props, option) => (
                        <Box component='li' sx={{
                            '&:hover': {
                                color: '#fff',
                                opacity: 0.8,
                                bgcolor: `${option.code}!important`,
                            },
                            textTransform: 'capitalize',
                        }} style={{backgroundColor: option.code}} {...props}>
                            {option.label}
                        </Box>
                    )}
                    renderInput={(params) => <TextField {...params} label='Color' />}
                />
            </Stack>
            <Stack 
                direction='row' 
                sx={{
                    gap: 2,
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    // height: '350px',
                    alignItems: 'stretch',
                }}>
                <Box sx={{ flex: 2, minWidth: '500px', height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Line data={lineChartData(calendar.tasks, analytics.selectedColor)} />
                </Box>
                <Paper sx={{ flex: 1, my: 4, p: 3, pt: 2, overflow: 'hidden', borderRadius: 5, minWidth: '300px', }}>
                    <Typography variant='h6' sx={{ textAlign: 'center', color: 'text.secondary' }}>Tasks</Typography>
                    <Box sx={{ maxHeight: '220px', overflow: 'hidden' }}>
                    {
                        calendar.tasks.length > 0 ? (
                            <TaskTitleGroup
                                tasks={analytics.selectedColor ? calendar.tasks.filter(task => task.color.label === analytics.selectedColor!.label) : calendar.tasks}
                                maxLength={7}
                                taskTitleProps={{
                                    subtitle: true, 
                                    ...props,
                                }}
                                textStyle={{
                                    fontSize: 16,
                                    marginTop: '1px',
                                }}
                            />
                        ) : <Typography color='secondary'>No tasks...</Typography>
                    }
                    </Box>
                </Paper>
            </Stack> 
            <Stack
                direction='row' 
                sx={{
                    gap: 2,
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    ...(calendar.tasks.length === 0 && {
                        display: 'none',
                    })
                }}
            >
                <Box sx={{flex: 1, minWidth: '500px', height: '350px',}}>
                    <Pie data={pieChartData(calendar.tasks)} />
                </Box>
                <Paper sx={{ flex: 1, my: 4, p: 3, pt: 2, pl: 0, pb: 0, overflow: 'hidden', borderRadius: 5, minWidth: '300px', height: 'auto', }}>
                    <Typography variant='h6' sx={{ textAlign: 'center', color: 'text.secondary' }}>Upcoming tasks</Typography>
                    <TasksTimeline tasks={calendar.tasks} />
                </Paper>
            </Stack>
            <Stack
                direction='row' 
                sx={{
                    gap: 2,
                    height: '350px',
                    justifyContent: 'space-between',
                }}
            >
                <Box sx={{flex: 1, minWidth: '200px',}}>
                    <TimeRange data={getTimeRangeData(calendar.tasks)} />
                </Box>
            </Stack>
        </Box>
    )
}

type TasksTimelineProps = {
    tasks: ITask[]
}

export const TasksTimeline: React.FC<TasksTimelineProps> = ({ tasks }) => {
    
    const now = dayjs()
    const closestTask = tasks.reduce((acc, task) => {
        if (task.startDate.diff(now) < acc.startDate.diff(now)) {
            return task
        }
        return acc
    }, tasks[0])

    const tasksInOrder = tasks.slice().sort((a, b) => a.startDate.diff(b.startDate))
    const currentTasks = tasksInOrder.filter(task => task.startDate.isAfter(now)).slice(0, 4)
    
    return (
        <>
            {
                (currentTasks.length === 0) ? (
                    <Typography 
                        variant='h6' 
                        sx={{ 
                            textAlign: 'left', 
                            color: 'text.secondary',
                            p: 3,
                            pl: 4, 
                        }}
                    >
                        No planned tasks...
                    </Typography>
                ) : (
                    <Timeline
                        sx={{
                            [`& .${timelineOppositeContentClasses.root}`]: {
                                flex: 0,
                            },
                        }}
                    >
                        {
                            currentTasks.map((task, index, allTasks) => {
                                return (
                                    <TimelineItem>
                                        <TimelineOppositeContent color='text.secondary'>
                                            {task.startDate.format('HH:mm')}
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot sx={{ bgcolor: task.color.code }} />
                                            {index !== (allTasks.length - 1) && <TimelineConnector />}
                                        </TimelineSeparator>
                                        <TimelineContent>
                                            <Typography>{task.title}</Typography>
                                        </TimelineContent>
                                    </TimelineItem>  
                                )
                            })
                        }
                    </Timeline>
                )
            }
        </>
    )
}





