import { Box, Typography, TextField, Container } from '@mui/material'
import LoadingButton from '../../../../components/common/LoadingButton/LoadingButton'
import useLogin from './hooks/useLogin'
import sx from './styles/LogIn.sx'

const LogIn = () => {
  const { onSubmit, loading, error, emailRef, passwordRef } = useLogin()
  
  return (
    <Container component='main' maxWidth='xs' sx={sx.loginContainer}>
      <Box sx={sx.box} component='form' onSubmit={onSubmit}>
        <Typography component='h1' variant='h5'>Log In</Typography>
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
          inputRef={emailRef}
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
          inputRef={passwordRef}
        />
        {error && <Typography>{error}</Typography>}
        <LoadingButton
          type='submit'
          fullWidth
          variant='contained'
          color='primary'
          isLoading={loading}
          sx={sx.submit}
          size='large'
        >
          Log In
        </LoadingButton>
      </Box>
    </Container>
  );
};

export default LogIn;
