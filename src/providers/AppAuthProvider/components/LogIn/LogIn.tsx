import React, { useState, useCallback } from 'react'
import { Box, Typography, TextField, Container } from '@mui/material'
import LoadingButton from '../../../../components/common/LoadingButton/LoadingButton'
import { auth } from '../../../../services/firebase'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from '../../types'
import { useDispatch } from 'react-redux'
import { login, logout } from '../../redux'

const LogIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const onSubmit = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault()
      setLoading(true)
      try {
        const user = await signInWithEmailAndPassword(auth, email, password)
        dispatch(login( user.user.uid ))
        setLoading(false)
      } catch (error) {
        setError((error as FirebaseError).code)
        dispatch(logout())
        setLoading(false)
      }
    }, [email, password]
  );

  return (
    <Container component='main' maxWidth='xs'>
      <Box display='flex' flexDirection='column' alignItems='center' mt={6}>
        <Typography component='h1' variant='h5'>Log In</Typography>
        <form noValidate onSubmit={onSubmit}>
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email'
            name='email'
            autoComplete='email'
            autoFocus
            InputProps={{
              type: 'email'
            }}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            variant='outlined'
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <Typography>{error}</Typography>}
          <LoadingButton
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            isLoading={loading}
          >
            Log In
          </LoadingButton>
        </form>
      </Box>
    </Container>
  );
};

export default LogIn;
