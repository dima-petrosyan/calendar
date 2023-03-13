import React from 'react'
import { ITask } from '../../types/types'
import { TaskTitleProps, TaskTitle } from './TaskTitle'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

type TaskTitleGroupProps = {
	maxLength: number
	tasks: ITask[]
	taskTitleProps: Omit<TaskTitleProps, 'task'>
	textStyle?: React.CSSProperties
}

export const TaskTitleGroup: React.FC<TaskTitleGroupProps> = ({ tasks, maxLength, taskTitleProps, textStyle }) => {  
	return (
		<Box>
			{
				tasks.map((task, idx, allTasks) => {
					if (idx > maxLength ) { return }
					if (idx === maxLength) {
						return (
							<Typography sx={{
								fontSize: 14,
								textAlign: 'left',
								ml: '3px',
								overflow: 'hidden', 
								whiteSpace: 'nowrap', 
								textOverflow: 'ellipsis',
								cursor: 'pointer',
								...textStyle,
							}}> 
								{`${allTasks.length - maxLength} more`}
							</Typography>
						)
					}
					return (
						<TaskTitle 
							task={task}
							{...taskTitleProps}
						/>
					)
				})
			}
		</Box>
	)
}