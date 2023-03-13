import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import { useTypedDispatch } from '../hooks/redux'
import { loginUser } from '../store/slices/auth.slice'

import { useFormik } from 'formik'
import * as yup from 'yup'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'

import { AuthLayout } from '../components/HOCs/AuthLayout'

const validationSchema = yup.object({
	login: yup.string().email('Enter a valid email').required('Login is required'),
	password: yup.string().required('Password is required'),
})

export const Login = AuthLayout(() => {

	const dispatch = useTypedDispatch()

	const formik = useFormik({
		initialValues: {
			login: '' as string,
			password: '' as string,
		},
		onSubmit: (values) => {
			dispatch(loginUser(values))
		},
		validationSchema,
	})

	const [showPassword, setShowPassword] = useState(false)

  	const handleClickShowPassword = () => setShowPassword((show) => !show)
  	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
   		event.preventDefault()
  	}

	return (
		<Box sx={{height: '100vh'}}>
			<form onSubmit={formik.handleSubmit}>
				<Box sx={(theme) => ({
					position: 'absolute',
		            top: '50%',
		            left: '50%',
		            transform: 'translate(-50%, -50%)',
		            width: 500,
		            bgcolor: 'background.paper',
		            boxShadow: 24,
		            p: 4,
		            borderRadius: theme.shape.borderRadius,
		           	display: 'flex',
		           	flexDirection: 'column',
		           	gap: 2
				})}>
					<Typography variant='h5' sx={{
						textAlign: 'center',
						fontWeight: 600,
					}}>Welcome back!</Typography>
					<TextField
						name='login'
						label='Login'
						value={formik.values.login}
						onChange={formik.handleChange}
						error={formik.touched.login && Boolean(formik.errors.login)}
						helperText={formik.touched.login && formik.errors.login}
						onBlur={formik.handleBlur}
					/>	
					<TextField 
						name='password'
						label='Password'
						value={formik.values.password}
						onChange={formik.handleChange}
						error={formik.touched.password && Boolean(formik.errors.password)}
						helperText={formik.touched.password && formik.errors.password}
						onBlur={formik.handleBlur}
						type={showPassword ? 'text' : 'password'}
						InputProps={{
							endAdornment: (
								<InputAdornment position='end'>
			               			<IconButton
			                			onClick={handleClickShowPassword}
			                 			onMouseDown={handleMouseDownPassword}
			                  			edge='end'
			                		>
			                  			{showPassword ? <VisibilityOff /> : <Visibility />}
			                		</IconButton>
			              		</InputAdornment>
			              	)
						}}
					/>
					<Typography sx={{fontSize: 14}}>
						If you don't have an account, please 
						<Link style={{ color: 'coral', textDecoration: 'underline' }} to='/register'>
							{' register'}
						</Link>
					</Typography>
					<Button 
						type='submit' 
						variant='contained'
					>Login</Button>		
				</Box>
			</form>
		</Box>
	)
})




