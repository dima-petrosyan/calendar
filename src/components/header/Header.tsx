import React, { useState, Dispatch, SetStateAction, useEffect } from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Badge from '@mui/material/Badge'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuOpenIcon from '@mui/icons-material/MenuOpen'
import MenuIcon from '@mui/icons-material/Menu'
import WestIcon from '@mui/icons-material/West'
import EastIcon from '@mui/icons-material/East'
import FilterListIcon from '@mui/icons-material/FilterList'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import Tooltip from '@mui/material/Tooltip'
import { FormatMenu } from './FormatMenu'
import { CreateTaskModal } from '../modal/Modal'
import { PaletteMode } from '@mui/material'

import { useTypedSelector, useTypedDispatch } from '../../hooks/redux'
import dayjs, { Dayjs } from 'dayjs'
import { setSelectedDay, setSelectedWeek, setFormat } from '../../store/slices/calendar.slice'
import { Format, ITask } from '../../types/types'
import { User as FBUser } from 'firebase/auth'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import { onSignOut } from '../../store/slices/auth.slice'

import { RightDrawer } from '../drawer/RightDrawer'

enum IWeekOrder {
    previous,
    next,
}

type HeaderProps = {
    hideAside: () => void
    isAsideHide: boolean
    openModal: (isOpen: boolean, task?: ITask | null) => void 
    mode: PaletteMode 
    setMode: Dispatch<SetStateAction<PaletteMode>>
    user: FBUser | null
}

export const Header: React.FC<HeaderProps> = ({ hideAside, isAsideHide, openModal, mode, setMode, user }) => {

    const dispatch = useTypedDispatch()
    const { calendar } = useTypedSelector(state => state)

    // - week (array of Dayjs) that is going on now (from Sun to Sat)
    const currentWeek: Dayjs[] = 
        new Array(7).fill(0).map((_, idx) => dayjs().startOf('week').add(idx, 'day'))

    const weekTitle = (week: Dayjs[]) => {
        if (week[0].month() !== week.at(-1)?.month()) {
            return `${week[0].format('MMM')}-${week.at(-1)?.format('MMM YYYY')}`
        }
        return `${week[0].format('MMMM YYYY') }`
    }

    const handleToday = () => {
        dispatch(setSelectedDay(() => dayjs()))
        dispatch(setSelectedWeek(() => currentWeek))
    }

    // - move to selected week (previous or next)
    const changeWeek = (weekOrder: IWeekOrder) => {
        switch (weekOrder) {
            case IWeekOrder.previous: 
                dispatch(setSelectedWeek(prev => prev.map(day => day.add(-7, 'day'))))
                break
            case IWeekOrder.next:
                dispatch(setSelectedWeek(prev => prev.map(day => day.add(7, 'day'))))
        }
    }

     // - move to previous date: day, week or month - depends on format
    const handleLeft = () => {
        switch (calendar.format) {
            case Format.week: 
                changeWeek(IWeekOrder.previous)
                break
            case Format.day:
                dispatch(setSelectedDay(prev => prev.add(-1, 'day')))
                break
            case Format.month:
                dispatch(setSelectedDay(prev => prev.add(-1, 'month').startOf('month')))
        }
    }

    // - move to next date: day, week or month - depends on format
    const handleRight = () => {
        switch (calendar.format) {
            case Format.week: 
                changeWeek(IWeekOrder.next)
                break
            case Format.day:
                dispatch(setSelectedDay(prev => prev.add(1, 'day')))
                break
            case Format.month:
                dispatch(setSelectedDay(prev => prev.add(1, 'month').startOf('month')))
        }
    }
    
    // - create new task
    const handleCreate = () => {
        openModal(true)
    }

    const changeMode = () => {
        setMode(mode === 'light' ? 'dark' : 'light')
    }

    // - drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    return (
        <Box sx={{ flexGrow: 1, }}>
      		<AppBar position='static' sx={(theme) => ({
                boxShadow: theme.shadows[0],
                height: '70px',
                pt: 0.5,
            })}>
        		<Toolbar>
          			<IconButton
            			size='large'
            			edge='start'
            			color='inherit'
            			sx={{ mr: 2 }}
                        onClick={hideAside}
          			>
            			{
                            isAsideHide ? 
                                <MenuIcon sx={{ fontSize: 28 }} /> :
                                <MenuOpenIcon sx={{ fontSize: 28 }} />
                        }
          			</IconButton>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
                            <Button 
                                variant='contained' 
                                sx={{
                                    minWidth: 130,
                                    display: {
                                        xs: 'none',
                                        sm: 'inline-block',
                                    } 
                                }} 
                                onClick={handleCreate}
                            >Create task</Button>
                            <Stack direction='row'>
                                <IconButton color='inherit' onClick={handleLeft}>
                                    <WestIcon />
                                </IconButton>
                                <IconButton color='inherit' onClick={handleRight}>
                                    <EastIcon />
                                </IconButton>
                            </Stack>
                            <Typography sx={{ 
                                fontSize: 26, 
                                minWidth: 220, 
                                display: {
                                    xs: 'none',
                                    md: 'inline-block',
                                } 
                            }} component="h5">
                                {
                                    calendar.format === 'week' && 
                                        weekTitle(calendar.selectedWeek)
                                }
                                {
                                    calendar.format === 'day' && 
                                        calendar.selectedDay.format('D MMMM YYYY')
                                }
                                {   
                                    calendar.format === 'month' && 
                                        calendar.selectedDay.format('MMMM YYYY')
                                }
                            </Typography>
                        </Box>
                        <Box sx={{
                            flexGrow: 1, 
                            display: 'flex',
                            justifyContent: 'flex-end', 
                            alignItems: 'center',
                            gap: 2,
                        }}>
                            <Tooltip title='Theme'>
                                <IconButton color='inherit' onClick={changeMode}>
                                {
                                    mode === 'dark' ? 
                                        <LightModeIcon sx={{ fontSize: 28 }} /> :
                                        <DarkModeIcon sx={{ fontSize: 28 }} />
                                }
                                </IconButton>
                            </Tooltip>
                            <Button sx={{
                                display: {
                                    xs: 'none',
                                    md: 'inline-block',
                                }
                            }} variant='contained' onClick={handleToday}>Today</Button>
                            <FormatMenu />
                            <Tooltip title={user?.displayName}>
                                <IconButton onClick={() => setIsDrawerOpen(true)}>
                                    <Avatar sx={{
                                        bgcolor: (theme) => theme.palette.primary.light,
                                        boxShadow: 3,
                                        textTransform: 'capitalize',
                                    }}>
                                        {user?.displayName?.[0]}
                                    </Avatar>
                                </IconButton>
                            </Tooltip>
                            <RightDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
                        </Box>
                    </Box>
        		</Toolbar>
      		</AppBar>
    	</Box>
    )
}





