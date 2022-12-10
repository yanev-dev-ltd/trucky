import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { Fullscreen, FullscreenExit, Logout } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl';
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '../../../../../../services/firebase'
import sx from '../styles/Header.sx'
import Image from 'next/image'
import { HeaderProps } from '../types'
import Notifications from '../components/Notifications/Notifications'

export const HeaderView = ({ handleFullscreen, fullscreen}: HeaderProps): JSX.Element => {

  return (
    <Box sx={sx.header}>
      <Box sx={sx.logo}><Link href='/'><Image src='/icons/logo.svg' alt='Trucky.one - manage your fleet' width={150} height={24} priority /></Link></Box>
      <Box sx={sx.buttons}>
        <Tooltip title={fullscreen ? <FormattedMessage id='app.ExitFullscreen' /> : <FormattedMessage id='app.Fullscreen' />}>
          <IconButton onClick={handleFullscreen}>{fullscreen ? <FullscreenExit /> : <Fullscreen />}</IconButton>
        </Tooltip>
        <Notifications />
        <Tooltip title={<FormattedMessage id='app.Logout' />}>
          <IconButton onClick={() => signOut(auth)}><Logout /></IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
