import React, { useState, useEffect } from 'react'

import { Aside } from './components/aside/Aside'
import { Header } from './components/header/Header'
import { CreateTaskModal } from './components/modal/Modal'

import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Calendar } from './pages/Calendar'
import { Tasks } from './pages/Tasks'
import { Analytics } from './pages/Analytics'

import { useTypedSelector, useTypedDispatch } from './hooks/redux'
import { onAuthChanged } from './store/slices/auth.slice'
import { ITask } from './types/types'

import Box from '@mui/material/Box'
import { 
	createTheme, 
	colors, 
	ThemeProvider, 
	PaletteMode
} from '@mui/material'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'

function App() {
	
	const dispatch = useTypedDispatch()
	const { user } = useTypedSelector(state => state.auth)

	const ProtectedRoute = ({ children }: { children: React.ReactNode }): any => {
		if (!user) {
			return <Navigate to='/login' />
		}
		return children
	}

	const [isAsideHide, setIsAsideHide] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const [modalTask, setModalTask] = useState<ITask | null>(null)

	const openModal = (isOpen: boolean, task: ITask | null = null) => {
		setIsModalOpen(isOpen)
		setModalTask(task)
	}

	const [mode, setMode] = useState<PaletteMode>('light')
	const darkTheme = createTheme({
		palette: {
			mode: mode,
			secondary: {
				main: colors.blueGrey[400],
			},
			tomato: {
				main: colors.red[700],
				contrastText: '#fff',
			},
		},
		components: {
			// MuiAvatarGroup: {
			// 	styleOverrides: {
			// 		root: {
			// 			transition: '1s ease all',
			// 		}
			// 	}
			// }
		},
	})

	useEffect(() => {
		dispatch(onAuthChanged())
	}, [])

	// - layout of home pages' windows
	const Layout = () => {
		return (
			<>
				<Header 
					hideAside={() => setIsAsideHide(prev => !prev)} 
					isAsideHide={isAsideHide}
					openModal={openModal}
					mode={mode}
					setMode={setMode}
					user={user}
				/>
				<Box sx={{
					display: 'flex',
				}}>
					<Aside isHide={isAsideHide} />
					<Box sx={{
						transition: '0.3s ease all',
						flexGrow: 1,
						...(isAsideHide && { ml: '-280px' }),

						// - when modal is opened or task is edited, child components scroll to the top
						// height: 'calc(100vh - 70px)',
						// overflow: 'scroll',

						// - no scroll to the top, but it's not current behavior
						// height: 'auto',
						overflowY: 'unset',
						overflowX: 'scroll',
					}}>
						<Outlet />
					</Box>
				</Box>
			</>
		)
	}

    return (
    	<BrowserRouter>
    		<ThemeProvider theme={darkTheme}>
		        <Box bgcolor={'background.default'} sx={{
		        	color: 'text.secondary',
		        }}>
		        	<Routes>

						<Route path='/login' element={<Login />} />
			   			<Route path='/register' element={<Register />} />
			   			<Route path='/' element={<Navigate to='/calendar' />} />
			        	<Route element={
			        		<ProtectedRoute>
			        			<Layout />
		       				</ProtectedRoute>
		     			}> 
		     				<Route path='/calendar' element={<Calendar openModal={openModal} />} />
		     				<Route element={
		     					<Box sx={{p: 3,}}>
		     						<Outlet />
		     					</Box>
		     				}>
		     					<Route path='/tasks' element={<Tasks openModal={openModal} currentUser={user} />} />
		     					<Route path='/analytics' element={<Analytics openModal={openModal} currentUser={user} />} />
		     				</Route>
		     			</Route>
		     	
			        </Routes>
		        </Box>
		        <CreateTaskModal 
			        isOpen={isModalOpen} 
			       	handleOpen={openModal} 
			       	taskToEdit={modalTask} 
			    />
	        </ThemeProvider>
        </BrowserRouter>
    )

}

export default App







