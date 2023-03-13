import * as React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import { useDispatch } from 'react-redux'
import { useTypedSelector } from '../../hooks/redux'
import dayjs, { Dayjs } from 'dayjs'
import { setSelectedDay, setSelectedWeek, setFormat } from '../../store/slices/calendar.slice'
import { Format } from '../../types/types'

export const FormatMenu = () => {

    const dispatch = useDispatch()
    const { format } = useTypedSelector(state => state.calendar)

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: any) => setAnchorEl(event.currentTarget) 
    const handleSelect = (format: Format) => {
        dispatch(setFormat(format))
        closeMenu()
    }
    const closeMenu = () => setAnchorEl(null)

    return (
        <>
            <Button
                aria-controls={open ? 'fade-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                variant='contained'
                sx={{
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: 1,
                }}
            >
                {format}
                <ArrowDropDownIcon sx={{mb: 0.1}} />
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                TransitionComponent={Fade}
            >
                <MenuItem sx={{ width: 110 }} onClick={() => handleSelect(Format.day)}>Day</MenuItem>
                <MenuItem onClick={() => handleSelect(Format.week)}>Week</MenuItem>
                <MenuItem onClick={() => handleSelect(Format.month)}>Month</MenuItem>
            </Menu>
        </>
    )
}








