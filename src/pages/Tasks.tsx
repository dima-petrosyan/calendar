import React, { useState, Dispatch, SetStateAction } from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Fade from '@mui/material/Fade'
import FilterListIcon from '@mui/icons-material/FilterList'
import DeleteIcon from '@mui/icons-material/Delete'
import AutoDeleteIcon from '@mui/icons-material/AutoDelete'
import Tooltip from '@mui/material/Tooltip'
import Check from '@mui/icons-material/Check'

import { setFilter } from '../store/slices/tasks.slice'
import { deleteTask } from '../store/slices/calendar.slice'
import { selectTasksByFilter } from '../store/selectors/tasks.selectors'

import { useTypedSelector, useTypedDispatch } from '../hooks/redux'
import { ITask, Filter } from '../types/types'
import { TaskItem } from '../components/task/TaskItem'
import { User as FBUser } from 'firebase/auth'

import dayjs from 'dayjs'

type TasksProps = {
	openModal: (isOpen: boolean, task?: ITask | null) => void
	currentUser: FBUser | null
}

export const Tasks: React.FC<TasksProps> = ({ openModal, currentUser }) => {

	const tasks = useTypedSelector(selectTasksByFilter)
	const dispatch = useTypedDispatch()

	const [searchText, setSearchText] = useState('')

	const searchingTasks = () => {
		if (searchText !== '') return tasks.filter(task => task.title.includes(searchText))
	}

	const handleFilterBy = (filter: Filter) => {
		dispatch(setFilter(filter))
	}

    const handleDeleteOverdue = () => {
        tasks.forEach(task => {
            if (task.endDate.isBefore(dayjs())) {
                dispatch(deleteTask(task))
            }
        })
    }

	return (
		<Box>
            {
                (tasks.length > 0) ? (
                    <>
                        <Stack direction='row' justifyContent='space-between' alignItems='center' spacing={2}> 
                            <Search searchText={searchText} setSearchText={setSearchText} />
                            <Stack direction='row'>
                                <Tooltip title={'Clear all overdue tasks'}>
                                    <IconButton onClick={handleDeleteOverdue}>
                                        <AutoDeleteIcon sx={{ color: 'text.secondary', fontSize: '30px' }} />
                                    </IconButton>
                                </Tooltip>
                                <FilterMenu handleFilterBy={handleFilterBy} />
                            </Stack>
                        </Stack>
                        <Grid container spacing={3} sx={{pt: 3}} alignItems='flex-start'>
                            {
                                (searchingTasks() ?? tasks).map(task => {
                                    return (
                                        <Grid item xs={12} lg={6}>
                                            <Paper sx={{
                                                p: 2, 
                                                borderRadius: 5, 
                                                boxShadow: (theme) => theme.shadows[2],
                                            }}>
                                                <TaskItem 
                                                    style={{
                                                        width: '100%',
                                                        minWidth: '200px'
                                                    }}
                                                    description={task.description}
                                                    variant='separately'
                                                    task={task} 
                                                    openModal={openModal} 
                                                    currentUser={currentUser} 
                                                />
                                            </Paper>    
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </>
                ) : (
                    <Typography variant='h5' sx={{textAlign: 'center'}}>Ops... You have no tasks!</Typography>
                )
            }
		</Box>
	)
}

type SearchProps = {
	searchText: string
	setSearchText: Dispatch<SetStateAction<string>>
}

const Search: React.FC<SearchProps> = ({ searchText, setSearchText }) => {
	return (
		<TextField
			value={searchText}
			onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
			    setSearchText(event.target.value)
			}}
			placeholder='Enter task'
			sx={{width: '300px'}}
			label='Search'
			InputProps={{
          		startAdornment: (
            		<InputAdornment position='start'>
              			<SearchIcon sx={{ color: 'text.secondary' }} />
            		</InputAdornment>
          		),
        	}}
		/>
	)
}

type FilterMenuProps = {
    handleFilterBy: (filter: Filter) => void
}

const FilterMenu: React.FC<FilterMenuProps> = ({ handleFilterBy }) => {

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const handleClick = (event: any) => setAnchorEl(event.currentTarget) 
    const handleSelect = (filter: Filter) => {
        handleFilterBy(filter)
        closeMenu()
    }

    const closeMenu = () => setAnchorEl(null)
    const filters = [Filter.date, Filter.tag, Filter.invitations]

    return (
        <>
            <Tooltip title='Filter' placement='bottom'>
                <IconButton onClick={handleClick}>
                    <FilterListIcon sx={{ color: 'text.secondary', fontSize: '30px' }} />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={closeMenu}
                TransitionComponent={Fade}
            >
                <Typography sx={{ml: 2, pt: 1, color: 'text.secondary'}}>Filter by:</Typography>
                {
                    filters.map(filter => {
                        return (
                            <FilterMenuItem 
                                title={filter}
                                handleSelect={handleSelect} 
                            />
                        )
                    })
                }
            </Menu>
        </>
    )
}

type FilterMenuItemProps = {
    handleSelect: (filter: Filter) => void
    title: Filter
}

const FilterMenuItem: React.FC<FilterMenuItemProps> = ({ handleSelect, title }) => {
    
    const filter = useTypedSelector(state => state.tasks.filter)
    
    return (
        <MenuItem 
            sx={{
            	width: 180, 
            	display: 'flex', 
            	alignItems: 'center', 
            	justifyContent: 'space-between',
            }} 
            onClick={() => handleSelect(title)}
        >
            <Typography sx={{
                '&::first-letter': {
                    textTransform: 'capitalize',
                },
            }}>{title}</Typography>
            {
            	filter === title && (
            		<Check sx={{ color: 'secondary.main' }}></Check>
            	)
            }
        </MenuItem>
    )
}















