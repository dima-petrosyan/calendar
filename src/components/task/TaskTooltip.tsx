import React, { useState, Dispatch, SetStateAction } from 'react'
import { ITask } from '../../types/types'
import { User as FBUser } from 'firebase/auth'

import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { TaskItem } from './TaskItem'

type TaskTooltipProps = {
	children: React.ReactElement<any, any>
	setOpen: Dispatch<SetStateAction<boolean>>
	open: boolean
	task: ITask
	openModal?: (isOpen: boolean, task?: ITask | null) => void
	currentUser?: FBUser | null
}

export const TaskTooltip: React.FC<TaskTooltipProps> = (props) => {
		
	const { 
		children, 
		setOpen, 
		open,
		task,
		openModal,
		currentUser
	} = props

	return (
		<ClickAwayListener onClickAway={() => setOpen(false)}>
			<Box 
				onClick={(event) => event.stopPropagation()} 
				sx={(theme) => ({
					'& .MuiTooltip-tooltip': {
						bgcolor: theme.palette.background.default,
					    fontSize: theme.typography.pxToRem(12),
					    boxShadow: theme.shadows[5],
					    maxWidth: 'none',
					}
				})
			}>
				<Tooltip
					title={ 
						<TaskItem 
							task={task} 
							openModal={openModal} 
							setOpen={setOpen} 
							currentUser={currentUser}
						/> 
					}
					placement='right-start'
					disableHoverListener
					PopperProps={{
	            		disablePortal: true,
	            		modifiers: [{
	            			name: 'flip',
						    enabled: true,
						    options: {
						    	altBoundary: true,
						        rootBoundary: 'document',
						        padding: 8,
						    },
						},
						{
	      					name: 'preventOverflow',
	      					enabled: true,
	      					options: {
	        					altAxis: true,
						        altBoundary: true,
						        tether: true,
						        rootBoundary: 'document',
						        padding: 8,
	      					},
	    				}]
	        		}}
			        onClose={() => setOpen(false)}
			       	open={open}
				>
					{children}
				</Tooltip>
			</Box>
		</ClickAwayListener>
	)	
}