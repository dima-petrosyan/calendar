import React, { Dispatch, SetStateAction } from 'react'
import { ITask } from '../../types/types'
import { useTypedDispatch } from '../../hooks/redux'
import { User as FBUser } from 'firebase/auth'
import { deleteTask } from '../../store/slices/calendar.slice'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation'
import NotesIcon from '@mui/icons-material/Notes'
import Tooltip from '@mui/material/Tooltip'

type TaskItemVariant = 'separately' 

type TaskItemProps = {
	task: ITask
	openModal?: (isOpen: boolean, task?: ITask | null) => void
	setOpen?: Dispatch<SetStateAction<boolean>>
	currentUser?: FBUser | null
	style?: React.CSSProperties
	description?: string
	variant?: TaskItemVariant
}
	
export const TaskItem: React.FC<TaskItemProps> = ({ task, openModal, setOpen, currentUser, style, description, variant }) => {
	
	const dispatch = useTypedDispatch()

	const listOfUsers = () => {
		if (task.invitations) {
			return task.invitations.reduce((acc, item) => {
				return `${acc}, ${item.name}`
			}, `${currentUser?.displayName?.split(' ')[0]}`)
		}
	}

	return (
		<Box 
			sx={{ 
				minWidth: '450px', 
				px: 1, 
				pb: 2,
				'& > * + * + *': {
					mt: 1
				}
			}}
			style={style}
			onClick={(event) => {
				event.stopPropagation()
			}}
		>
			<Stack direction='row' sx={{ justifyContent: 'flex-end' }}>
				<Stack direction='row'>
					<Tooltip placement='top' title={'Edit'}>
						<IconButton onClick={() => openModal?.(true, task)} disabled={!!task.from}>
							<EditIcon />
						</IconButton>
					</Tooltip>
					<Tooltip placement='top' title={!!task.from ? 'Deny' : 'Delete'}>
						<IconButton>
							<DeleteIcon onClick={() => dispatch(deleteTask(task))} />
						</IconButton>
					</Tooltip>
					{
						variant !== 'separately' && (
							<IconButton onClick={() => setOpen?.(false)}>
								<CloseIcon />
							</IconButton>
						)
					}
				</Stack>				
			</Stack>
			<Stack direction='row' sx={{ alignItems: 'start' }} gap={4}>
				<Box sx={{
					flex: '0 0 18px', 
					height: '18px', 
					bgcolor: task.color.code,
					borderRadius: '30%',
					mt: '7px',
					ml: '3px'
				}}></Box>
				<Stack direction='column' sx={{ alignItems: 'start' }}>
					<Typography sx={{ 
						color: 'text.primary', 
						fontSize: 22, 
						maxWidth: '370px', 
						overflow: 'scroll', 
						'&::-webkit-scrollbar': {
							display: 'none'
						}, 
						'&::first-letter': {
							textTransform: 'capitalize',
						},
					}}>{task.title}</Typography>
					<Typography sx={{ color: 'text.secondary', fontSize: 16 }}>{task.startDate.format('dddd, D MMMM HH:mm')} - {task.endDate.format('HH:mm')}</Typography>
				</Stack>
			</Stack>
			{
				!!description && (
					<Stack direction='row' sx={{ alignItems: 'start'}} gap={4}>
						<NotesIcon sx={{ color: 'text.secondary', }}/>
						<Typography sx={{ color: 'text.secondary',  fontSize: 16, '&::first-letter': {textTransform: 'capitalize'}, ml: '-2px' }}>
							{description}
						</Typography>
					</Stack>
				)
			}
			<Stack direction='row' sx={{ alignItems: 'start'}} gap={4}>
				<InsertInvitationIcon sx={{ color: 'text.secondary', }} />
				<Typography sx={{ color: 'text.secondary',  fontSize: 16, textTransform: 'capitalize', ml: '-2px' }}>
					{listOfUsers()}
				</Typography>
			</Stack>
			{
				!!task.from && (
					<Stack direction='row' sx={{ justifyContent: 'flex-end', pr: 2 }} gap={4}>
						<Typography sx={{ color: 'text.primary', fontSize: 15 }}>
							From: {task?.from}
						</Typography>
					</Stack>
				)
			}
		</Box>
	)
}
