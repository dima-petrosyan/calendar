import React, { useState } from 'react'
import { ITask } from '../../types/types'
import { colors } from '@mui/material'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { SxProps } from '@mui/system'
import { TaskTooltip } from './TaskTooltip'
import { User as FBUser } from 'firebase/auth'

export type TaskTitleProps = {
    task: ITask
    subtitle?: boolean | (() => void)
    sx?: SxProps
    tagHeight?: number | string
    openModal?: (isOpen: boolean, task?: ITask | null) => void 
    currentUser?: FBUser | null 
}

export const TaskTitle: React.FC<TaskTitleProps> = React.forwardRef((props, ref) => {
    
    const { task, subtitle, sx, tagHeight, openModal, currentUser } = props
    // <div {...props} ref={ref}>

    const [open, setOpen] = useState(false)
    
    return (
        <TaskTooltip
            open={open}
            setOpen={setOpen}
            task={task}
            openModal={openModal}
            currentUser={currentUser}
        >
            <Stack 
                onClick={() => setOpen(prev => !prev)}
                direction='row' 
                spacing={1} 
                alignItems='center'
                sx={{ 
                    py: '1px', 
                    px: '4px',
                    ...sx, 
                    borderRadius: 2,
                    '&:hover': {
                        bgcolor: (theme) => theme.palette.action.hover
                    },
                    cursor: 'pointer',
                }}
            >
                <Box sx={{ 
                    bgcolor: task.color.code, 
                    borderRadius: 1,
                    flexBasis: 15, 
                    flexShrink: 0,
                    height: 15, 
                    ...(tagHeight && {
                        flexBasis: tagHeight,
                        height: tagHeight,
                    })
                }}></Box>
                <Stack 
                    sx={{
                        overflow: 'hidden', 
                        whiteSpace: 'nowrap', 
                        textOverflow: 'ellipsis',
                        width: '100%',
                    }} 
                    direction='row' 
                    justifyContent='space-between' 
                    alignItems='center'
                >
                    <Typography sx={{ 
                        overflow: 'hidden', 
                        whiteSpace: 'nowrap', 
                        textOverflow: 'ellipsis',
                        color: 'text.primary',
                        '&::first-letter': {
                            textTransform: 'capitalize',
                        },
                        fontSize: 'inherit',
                    }}>{task.title}</Typography>
                    { 
                        subtitle && (
                            <Typography sx={{
                                color: 'text.secondary', 
                                display: 'inline'
                            }}>
                                {`(${task.startDate.format('DD.MM.YY')})`}
                            </Typography>
                        )
                    }
                </Stack>
            </Stack>
        </TaskTooltip>
    )
})


















