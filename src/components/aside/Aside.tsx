import React from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AssignmentIcon from '@mui/icons-material/Assignment'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import { NavLink, useLocation } from 'react-router-dom'
import { onSignOut } from '../../store/slices/auth.slice'
import { clearCalendar } from '../../store/slices/calendar.slice'
import { setSelectedColor } from '../../store/slices/analytics.slice'
import { setFilter } from '../../store/slices/tasks.slice'
import { useTypedDispatch } from '../../hooks/redux'

type AsideProps = {
    isHide: boolean
}

type ItemType = {
    name: string
    link: string
    icon: React.ReactNode
    handler?: (...args: any[]) => void
}

export const Aside: React.FC<AsideProps> = ({ isHide }) => {
 
    const dispatch = useTypedDispatch()

    const location = useLocation()
    const items = [
        {
            name: 'calendar',
            link: 'calendar',
            icon: <CalendarMonthIcon />,
        },
        {
            name: 'tasks',
            link: 'tasks',
            icon: <AssignmentIcon />,
        },
        {
            name: 'analytics',
            link: 'analytics',
            icon: <LeaderboardIcon />,
        },
        {
            name: 'logout',
            link: 'login',
            icon: <LogoutIcon />,
            handler: () => {
                dispatch(onSignOut())
                dispatch(clearCalendar())
                dispatch(setSelectedColor(null))
                dispatch(setFilter(null))
            },
        },
    ]

    const Layout = (item: ItemType) => {
        return (
            <ListItemButton 
                sx={{ 
                    m: 1,
                    borderRadius: 2,
                    ...(location.pathname === `/${item.link}` && {
                        bgcolor: 'action.selected',
                    }),
                }}
                onClick={item.handler}
            >
                <ListItemIcon>
                    {item.icon}
                </ListItemIcon>
                <Typography sx={{ 
                    textTransform: 'capitalize', 
                    fontWeight: '500',
                    fontSize: '18px',
                    pt: 0.25,
                    pl: 3,
                }} color='text.secondary'>
                    {item.name}
                </Typography>
            </ListItemButton>
        )
    }

    return (
        <List
            sx={(theme) => ({
                // position: 'fixed',
                // width: '280px',
                flex: '0 0 280px', 
                height: 'calc(100vh - 70px)',
                transition: '0.3s ease all',
                transform: 'translateX(0)',
                ...(isHide && {
                    transform: 'translateX(-300px)',
                }),
            })}
            component='nav'
        >
            {
                items.map(item => item.handler ? Layout(item) : (
                    <NavLink to={`/${item.link}`}>
                        {Layout(item)}
                    </NavLink>
                ))
            }
        </List>
      
    )
}



