import React, { useState, Dispatch, SetStateAction } from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import dayjs, { Dayjs } from 'dayjs'
import { Format, ITask } from '../../types/types'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import Button from '@mui/material/Button'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import { useTypedSelector, useTypedDispatch } from '../../hooks/redux'
import { setSelectedDay, setFormat, editTask } from '../../store/slices/calendar.slice'

type DrawerProps = {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}

export const RightDrawer: React.FC<DrawerProps> = ({ isOpen, setIsOpen }) => {

    const { calendar } = useTypedSelector(state => state)
    const dispatch = useTypedDispatch()

    return (
        <div>
            <Drawer
                anchor={'right'}
                open={isOpen}
                onClose={() => setIsOpen(false)}
            >
                <Box
                    sx={{ width: 320, bgcolor: 'red!important' }}
                    role='presentation'
                    onKeyDown={() => setIsOpen(false)}
                >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <StaticDatePicker
                            displayStaticWrapperAs='desktop'
                            openTo='day'
                            value={dayjs()}
                            onChange={(value: Dayjs | null) => { 
                                dispatch(setSelectedDay(() => value!))
                                dispatch(setFormat(Format.day)) 
                                setIsOpen(false)
                            }}
                            renderInput={(params) => <TextField {...params} />}
                            renderDay={(day, _value, DayComponentProps) => {
                                return (calendar.tasks.find(task => task.startDate.isSame(day, 'day'))) ? (
                                    <Badge
                                        key={day.toString()}
                                        overlap='circular'
                                        badgeContent={calendar.tasks.filter(task => task.startDate.isSame(day, 'day')).length}
                                        color='secondary'
                                        sx={{mt: 1}}
                                    >
                                        <PickersDay {...DayComponentProps} sx={{fontSize: 14}} />
                                    </Badge>
                                ) : (<PickersDay {...DayComponentProps} sx={{mt: 1, fontSize: 14}} />)
                            }}
                            showDaysOutsideCurrentMonth
                        />
                    </LocalizationProvider>
                    <Box sx={{bgcolor: 'background.default', position: 'absolute', top: 0, bottom: 0, width: '100%', zIndex: -1,}}>
                        
                    </Box>
                </Box>
            </Drawer>
        </div>
    )
}





