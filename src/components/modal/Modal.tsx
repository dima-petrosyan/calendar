import React, { useState, useEffect } from 'react'
import Backdrop from '@mui/material/Backdrop'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Chip from '@mui/material/Chip'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Autocomplete from '@mui/material/Autocomplete'
import EventIcon from '@mui/icons-material/Event'
import NotesIcon from '@mui/icons-material/Notes'
import PaletteIcon from '@mui/icons-material/Palette'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import { Theme } from '@mui/material/styles'

import dayjs, { Dayjs } from 'dayjs'
import { uid } from 'uid'
import { stringAvatar } from '../../utils/utils'

import { ITask, Format, IColor, User } from '../../types/types'
import { saveNewTask, editTask, deleteTask } from '../../store/slices/calendar.slice'
import { getUsers } from '../../store/slices/users.slice'
import { useTypedSelector, useTypedDispatch } from '../../hooks/redux'
 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { TimeValidationError } from '@mui/x-date-pickers/internals/hooks/validation/useTimeValidation'

type CreateTaskModalProps = {
    isOpen: boolean
    handleOpen: (isOpen: boolean, task?: ITask | null) => void 
    taskToEdit: ITask | null
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ handleOpen, isOpen, taskToEdit }) => {
    
    const dispatch = useTypedDispatch()
    const { selectedDay } = useTypedSelector(state => state.calendar)

    const colors_arr: IColor[] = [
        {
            label: 'tomato',
            code: 'rgb(218, 0, 17)',
        },
        {
            label: 'flamingo',
            code: 'rgb(234, 123, 118)',
        },
        {
            label: 'tangerine',
            code: 'rgb(249, 78, 46)',
        },
        {
            label: 'banana',
            code: 'rgb(249, 190, 75)',
        },
        {
            label: 'sage',
            code: 'rgb(26, 182, 128)',
        },
        {
            label: 'basil',
            code: 'rgb(0, 128, 75)',
        },
        {
            label: 'peacock',
            code: 'rgb(0, 157, 223)',
        },
        {
            label: 'blueberry',
            code: 'rgb(62, 83, 173)',
        },
        {
            label: 'lavender',
            code: 'rgb(121, 135, 197)',
        },
        {
            label: 'grape',
            code: 'rgb(136, 38, 154)',
        },
        {
            label: 'graphite',
            code: 'rgb(96, 96, 96)',
        },
    ]

    const initialInputData = {
        title: taskToEdit ? taskToEdit.title : '',
        startDate: (taskToEdit ? taskToEdit.startDate : null) as Dayjs | null,
        endDate: (taskToEdit ? taskToEdit.endDate : null) as Dayjs | null,
        description: taskToEdit ? taskToEdit.description : '',
        invitations: (taskToEdit ? taskToEdit.invitations : []) as User[],
        color: (taskToEdit ? taskToEdit.color : colors_arr[7]) as IColor,
    }

    type InputDataType = typeof initialInputData

    const [inputData, setInputData] = useState<InputDataType>(initialInputData)
    const [error, setError] = useState<TimeValidationError>(null)

    const { users } = useTypedSelector(state => state.users) // - all users in database
    const { user } = useTypedSelector(state => state.auth) // - current user

    useEffect(() => {
        setInputData(prev => ({
            ...prev,
            startDate: selectedDay,
            endDate: selectedDay.add(1, 'hour')
        }))
    }, [selectedDay])

    useEffect(() => {
        setInputData(initialInputData)
    }, [taskToEdit])

    const handleCreate = () => {
        const task = {
            id: uid(),
            ...inputData,
        } as ITask
        dispatch(saveNewTask(task))
        setInputData(initialInputData)
        handleOpen(false)
    }
    
    const handleEdit = () => {
        const editedTask = {
            id: taskToEdit!.id,
            ...inputData,
        } as ITask
        dispatch(editTask({ 
            prevTask: taskToEdit!, 
            editedTask, 
        }))
        handleOpen(false)
    }

    const handleDelete = () => {
        dispatch(deleteTask(taskToEdit!))
        handleOpen(false)
    }

    const handleReset = () => {
        setInputData(initialInputData)
    }

    const handleChange = (event: any) => {
        const name = event.target.name
        const value = event.target.value
        setInputData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    useEffect(() => {
        return () => {
            handleReset()
        }
    }, [])

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
            <Modal
                open={isOpen}
                onClose={() => handleOpen(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={isOpen}>
                    <Box sx={(theme: Theme) => ({
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        pt: 3,
                        borderRadius: theme.shape.borderRadius,
                        '& > * + * + *': { 
                            mt: 3 
                        },
                        maxHeight: 650,
                        overflow: 'scroll',
                    })}>
                        <Stack direction='row' sx={{ justifyContent: 'flex-end' }}>
                            <IconButton onClick={() => handleOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Stack>
                        <TextField 
                            name='title'
                            value={inputData.title} 
                            onChange={handleChange} 
                            fullWidth 
                            sx={{
                                '& .MuiInputBase-input': {
                                    fontSize: 22,
                                }
                            }} 
                            placeholder='Add Title' 
                            variant='standard' 
                            autoFocus
                            InputProps={{
                                readOnly: !!taskToEdit?.from,
                            }}
                        />
                        <Stack direction='row' sx={{ justifyContent: 'space-between', gap: 2, alignItems: 'start' }}>
                            <EventIcon sx={{ color: 'grey', fontSize: 28 }} />
                            <Box sx={{ flex: 1 }}>
                                <Stack direction='row' sx={{ mt: 1, justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                                    <DesktopDatePicker
                                        label='Start date'
                                        inputFormat='DD/MM/YYYY'
                                        value={inputData.startDate}
                                        onChange={(newValue: Dayjs | null) => setInputData(prev => ({...prev, startDate: newValue}))}
                                        renderInput={(params) => <TextField {...params} />}
                                        readOnly={!!taskToEdit?.from}
                                    />
                                    <TimePicker
                                        label='Start time'
                                        value={inputData.startDate}
                                        onChange={(newValue: Dayjs | null) => setInputData(prev => ({...prev, startDate: newValue}))}
                                        renderInput={(params) => <TextField {...params} />}
                                        readOnly={!!taskToEdit?.from}
                                    />
                                </Stack>
                                <Stack direction='row' sx={{ mt: 3, justifyContent: 'space-between', gap: 2, alignItems: 'center' }}>
                                    <DesktopDatePicker
                                        label='Finish date'
                                        inputFormat='DD/MM/YYYY'
                                        value={inputData.endDate}
                                        onChange={(newValue: any) => setInputData(prev => ({...prev, endDate: newValue}))}
                                        minDate={inputData.startDate}
                                        onError={(reason) => setError(reason as TimeValidationError)}
                                        renderInput={(params) => <TextField {...params} />}
                                        readOnly={!!taskToEdit?.from}
                                    />
                                    <TimePicker
                                        label='Finish time'
                                        value={inputData.endDate}
                                        onChange={(newValue: any) => setInputData(prev => ({...prev, endDate: newValue}))}
                                        minTime={inputData.startDate}
                                        onError={(reason) => setError(reason as TimeValidationError)}
                                        renderInput={(params) => <TextField {...params} />}
                                        readOnly={!!taskToEdit?.from}
                                    />
                                </Stack>
                            </Box>
                        </Stack>
                        <Stack direction='row' sx={{ justifyContent: 'space-between', gap: 2, alignItems: 'start' }}>
                            <NotesIcon sx={{ color: 'grey', fontSize: 28 }} />
                            <TextField
                                name='description' 
                                label='Description'
                                value={inputData.description} 
                                onChange={handleChange}
                                fullWidth 
                                multiline
                                maxRows={3}
                                variant='outlined' 
                                InputProps={{
                                    readOnly: !!taskToEdit?.from,
                                }}
                            />
                        </Stack>
                        <Stack direction='row' sx={{ justifyContent: 'space-between', gap: 2, alignItems: 'start' }}>
                            <AccountBoxIcon sx={{ color: 'grey', fontSize: 28 }} />
                            <Autocomplete
                                value={inputData.invitations}
                                onChange={(event: any, newValue: User[]) => {
                                    setInputData(prev => ({...prev, invitations: [...newValue]}))
                                }} 
                                renderTags={(tagValue, getTagProps) => {
                                    return tagValue.map((option, index) => (
                                        <Chip
                                            label={`${option.name[0]}. ${option.surname}`}
                                            {...getTagProps({ index })}
                                            avatar={
                                                <Avatar {...stringAvatar(`${option.name[0]}. ${option.surname}`)} />
                                            }
                                        />
                                    ))
                                }}
                                multiple
                                limitTags={1}
                                options={users?.filter(item => `${item.name} ${item.surname}` !== user?.displayName)}
                                getOptionLabel={(option) => `${option.name} ${option.surname}` }
                                fullWidth
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant='outlined'
                                        label='Invitation'
                                    />
                                )}
                                ListboxProps={{
                                    style: {
                                        maxHeight: '100px'
                                    }
                                }}
                                readOnly={!!taskToEdit?.from}
                            />
                        </Stack>
                        <Stack direction='row' sx={{ gap: 2, alignItems: 'start' }}>
                            <PaletteIcon sx={{ color: 'grey', fontSize: 28 }} />
                            <Autocomplete
                                value={inputData.color}
                                onChange={(event: any, newValue: IColor | null) => {
                                    setInputData(prev => ({...prev, color: newValue ?? colors_arr[7]}))
                                }} 
                                disablePortal={false}
                                options={colors_arr}
                                sx={{ flexBasis: '43%' }}
                                renderOption={(props, option) => (
                                    <Box component='li' sx={{
                                        height: 40, 
                                        '&:hover': {
                                            color: '#fff',
                                            opacity: 0.8,
                                            bgcolor: `${option.code}!important`,
                                        },
                                        textTransform: 'capitalize',
                                    }} style={{backgroundColor: option.code}} {...props}>
                                        {option.label}
                                    </Box>
                                )}
                                renderInput={(params) => <TextField {...params} label='Color' />}
                                ListboxProps={{
                                    style: {
                                        maxHeight: '120px'
                                    }
                                }}
                                readOnly={!!taskToEdit?.from}
                            />
                            <Box sx={{ 
                                width: 30, 
                                height: 30, 
                                bgcolor: `${inputData.color.code ? inputData.color.code : '#fff'}`,
                                mt: 1.5,
                                borderRadius: '50%', 
                            }}></Box>
                        </Stack>
                        <Stack direction='row' sx={{ justifyContent: 'flex-end', gap: 2 }}>
                            <Button 
                                onClick={taskToEdit ? handleDelete : handleReset} 
                                sx={{width: 120}} 
                                variant='contained' 
                                color={`${taskToEdit ? 'error' : 'primary'}`}
                            >{taskToEdit ? 'Delete' : 'Clear'}</Button>
                            {
                                !taskToEdit?.from && (
                                    <Button 
                                        onClick={taskToEdit ? handleEdit : handleCreate} 
                                        sx={{width: 120}} 
                                        variant='contained'
                                        disabled={!inputData.title || !inputData.startDate || !inputData.endDate || !!error}
                                    >{taskToEdit ? 'Save' : 'Create'}</Button>
                                )
                            }
                        </Stack>
                    </Box>
                </Fade>
            </Modal>
        </LocalizationProvider>
    )
}







