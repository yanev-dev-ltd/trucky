import React from 'react';
import { Box, Button, Tooltip } from '@mui/material';
import { ReceiptLong, Fullscreen, FullscreenExit } from '@mui/icons-material'
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
      <Box>
        <Tooltip title={fullscreen ? <FormattedMessage id='app.ExitFullscreen' /> : <FormattedMessage id='app.Fullscreen' />}>
          <Button onClick={handleFullscreen}>{fullscreen ? <FullscreenExit /> : <Fullscreen />}</Button>
        </Tooltip>
        <Notifications />
        <Button onClick={() => signOut(auth)}><FormattedMessage id='app.Logout' /></Button>
      </Box>
    </Box>
  );
}
