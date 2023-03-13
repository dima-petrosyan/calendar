import React, { useState, useEffect, ComponentType } from 'react'

import { useNavigate } from 'react-router-dom'
import { useTypedSelector, useTypedDispatch } from '../../hooks/redux'

import Box from '@mui/material/Box'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

export const AuthLayout = (Component: ComponentType) => {

	const AuthLayoutComponent = () => {

		const { user, isError, isLoading } = useTypedSelector(state => state.auth)
		const dispatch = useTypedDispatch()
		
		const navigate = useNavigate()
		if (user) {
			navigate('/')
		}

		// - show snackbar when receiving an error
		const [open, setOpen] = useState(false)
		const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
	    	if (reason === 'clickaway') return
	    	setOpen(false)
	  	}

	  	useEffect(() => {
	  		if (isError) {
	  			setOpen(true)
	  		}
	  	}, [isError])

	  	return (
	  		<>
		  		{
		  			(isLoading) ? (
						<Box sx={{ 
							height: '100vh',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
	      					<CircularProgress />
	    				</Box>
					) : (
						<>
							<Snackbar 
								open={open} 
								onClose={handleClose} 
								autoHideDuration={3000}
								anchorOrigin={{ 
									vertical: 'top',
									horizontal: 'center',
								}}
							>
				        		<Alert onClose={handleClose} severity='error' sx={{ width: '100%' }}>
				         			Something went wrong!
				      			</Alert>
	     					</Snackbar>	
		  					<Component />
	  					</>
	  				)
		  		}
		  	</>
	  	)
	}

	return AuthLayoutComponent

}











