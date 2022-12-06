import React from 'react';
import { Box, Button, Typography, Popover, List, ListItem, ListItemText, ListItemAvatar, Avatar, Tooltip } from '@mui/material';
import { NotificationsActive, ReceiptLong, Fullscreen, FullscreenExit } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl';
import { formatRelative } from 'date-fns';
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '../../../../../../services/firebase'
import sx from '../styles/Header.sx'
import Image from 'next/image'
import { enGB, bg } from 'date-fns/locale';
import { HeaderProps } from '../types'

const unreadMsgs = [
  {
    id: 1,
    title: 'Title',
    message: 'Message',
    timeCreated: 1633005167213,
    url: '/invoices'
  },
  {
    id: 2,
    title: 'Title 2',
    message: 'Message 2',
    timeCreated: 1633005234878,
    url: '/invoices'
  },
  {
    id: 3,
    title: 'Title 3',
    message: 'Message 3',
    timeCreated: 1633005321168,
    url: '/invoices'
  }
];

const readMsgs = [
  {
    id: 1,
    title: 'Title',
    message: 'Message',
    timeCreated: 1586774169772,
    url: '/invoices'
  },
  {
    id: 2,
    title: 'Title 2',
    message: 'Message 2',
    timeCreated: 1586774169772,
    url: '/invoices'
  },
  {
    id: 3,
    title: 'Title 3',
    message: 'Message 3',
    timeCreated: 1586774169772,
    url: '/invoices'
  }
];

type Item = {
    id: number
    title: string
    message: string
    timeCreated: number
    url: string
}

export const HeaderView = ({ anchorEl, handleFullscreen, fullscreen, handleClose, handleClick }: HeaderProps): JSX.Element => {
  const renderItem = (item: Item) => {
    const { id, title, message, timeCreated, url } = item;

    return (
      <ListItem key={id} sx={sx.item}>
        <ListItemAvatar sx={sx.avatar}>
          <Box sx={sx.link}>
            <Avatar><ReceiptLong /></Avatar>
            <Typography sx={sx.time}>
              {formatRelative(new Date(timeCreated), new Date())}
              {/* {formatDistance(new Date(timeCreated), new Date(), { locale: settings.locale || 'en' })} */}
            </Typography>
          </Box>
        </ListItemAvatar>
        <Box style={{ flex: 1 }}>
          <ListItemText primary={title} secondary={message} />
        </Box>
      </ListItem>
    );
  };

  const unread = unreadMsgs.map(renderItem);
  const read = readMsgs.map(renderItem);

  return (
    <Box sx={sx.header}>
      <Box sx={sx.logo}><Link href='/'><Image src='/icons/logo.svg' alt='Trucky.one - manage your fleet' width={150} height={24} /></Link></Box>
      <Box>
        <Tooltip title={fullscreen ? <FormattedMessage id='app.ExitFullscreen' /> : <FormattedMessage id='app.Fullscreen' />}>
          <Button onClick={handleFullscreen}>{fullscreen ? <FullscreenExit /> : <Fullscreen />}</Button>
        </Tooltip>
        <Tooltip title={<FormattedMessage id='app.Notifications' />}>
          <Button onClick={handleClick} sx={sx.notifications}><NotificationsActive /><Typography sx={sx.notificationsCount}>3</Typography></Button>
        </Tooltip>
        <Popover
          id='notifications'
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
        >
          <List sx={sx.notificationsList}>
            {unread.length > 0 && (
              <>
                <ListItem sx={sx.gray}>
                  <ListItemText secondary={<FormattedMessage id='app.Recent' />} />
                </ListItem>
                {unread}
              </>
            )}
            {read.length > 0 && (
              <>
                <ListItem sx={sx.gray}>
                  <ListItemText secondary={<FormattedMessage id='app.Older' />} />
                </ListItem>
                {read}
              </>
            )}
            {!unread.length && !read.length && (
              <Box textAlign='center' m={1}>
                <Typography>No notifications yet...</Typography>
              </Box>
            )}
          </List>
        </Popover>
        <Button onClick={() => signOut(auth)}><FormattedMessage id='app.Logout' /></Button>
      </Box>
    </Box>
  );
}
