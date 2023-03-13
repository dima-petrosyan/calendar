import React, { useState, Dispatch, SetStateAction } from 'react'
import { ITask, Format } from '../../types/types'
import { stringAvatar } from '../../utils/utils'
import { useTypedDispatch } from '../../hooks/redux'
import { User as FBUser } from 'firebase/auth'
import { deleteTask } from '../../store/slices/calendar.slice'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Badge from '@mui/material/Badge'
import Zoom from '@mui/material/Zoom'

import { TaskTooltip } from './TaskTooltip'

type TaskProps = {
	task: ITask
	format: Format
	openModal: (isOpen: boolean, task?: ITask | null) => void
	currentUser: FBUser | null
}

export const Task: React.FC<TaskProps> = ({ task, format, openModal, currentUser }) => {

	const cellHeight = 40
	const getTaskHeight = (task: ITask): number => {
    	return cellHeight * ((task.endDate.hour() - task.startDate.hour()) + (task.endDate.minute() / 60) - (task.startDate.minute() / 60)) - 1
    }

    const getTopOffset = (task: ITask): number => {
    	return cellHeight * (task.startDate.minute() / 60)
    }

	// - state and props for tooltip, that is opened by click
	const [open, setOpen] = useState(false)

	return (
		<TaskTooltip 
			setOpen={setOpen}
			open={open}
			task={task}
			openModal={openModal}
			currentUser={currentUser}
		>
			<Box 
			 	className='calendar__task'
				sx={{
					position: 'absolute',
					top: `${getTopOffset(task)}px`,
					left: 0,
		       		bgcolor: task.color.code,
		       		height: `${getTaskHeight(task)}px`,
		       		minHeight: `${cellHeight - 1}px`,
		    	}}
				onClick={(event) => {
			        event.stopPropagation()
			        setOpen(prev => !prev) 
			    }}
			>
				<Typography className='calendar__task-title' sx={{fontSize: '14px', lineHeight: '16px'}}>
					{task.title}
				</Typography>
				<Typography sx={{fontSize: '11px', p: 0, m: 0}}>
					{task.startDate.format('HH:mm')} - {task.endDate.format('HH:mm')}
				</Typography>	
				{	
					(task.invitations.length > 0) && (
						<>
							<AvatarGroup 
								className='calendar__task-avatars'
								sx={{ 
									position: 'absolute', 
									bottom: -5, 
									right: -8, 
									'& .MuiAvatar-root': {
										width: (format === Format.week) ? 18 : 21, 
										height: (format === Format.week) ? 18 : 21,
										border: '1px solid #e0e0e0',
										color: '#fff',
										fontSize: (format === Format.week) ? 11 : 12,
									}
								}} 
								max={format === Format.week ? 4 : 5}
								spacing={format === Format.week ? 5 : 4}
								slotProps={{
									additionalAvatar: {
										sx: {
											transition: '0.8s ease all',
											opacity: 0,
											...(open && {
												opacity: 1,
											}),
										},
									}
								}}
							>
								{
									task.invitations.map((user, index) => {
										return (
											<Tooltip arrow TransitionComponent={Zoom} title={`${user.name} ${user.surname}`}>
												<Zoom in={open} style={{ transitionDelay: `${index * 300}ms` }}>
													<Avatar
														{...stringAvatar(`${user.name[0]}. ${user.surname}`)} 
													/>
												</Zoom>
											</Tooltip>
										)
									})
								}
							</AvatarGroup>
						</>
					)
				}		
			</Box>
		</TaskTooltip>
	)
}











