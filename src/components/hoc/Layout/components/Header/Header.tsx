import React, { useState } from 'react';
import { Box, makeStyles, Button, Typography, Popover, List, ListItem, ListItemText, ListItemAvatar, Avatar, Tooltip } from '@mui/material';
import { NotificationsActive, ReceiptLong, Fullscreen, FullscreenExit } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl';
import { formatRelative } from 'date-fns';
import Link from 'next/link'

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

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleFullscreen = () => {
    const body = document.querySelector('body');
    const fullscreenChange = () => {
      if (!document.fullscreenElement) {
        setFullscreen(false);
      }
    };
    if (!document.fullscreenElement) {
      body?.requestFullscreen();
      document.addEventListener('fullscreenchange', fullscreenChange);
      document.addEventListener('webkitfullscreenchange', fullscreenChange);
      document.addEventListener('mozfullscreenchange', fullscreenChange);
      document.addEventListener('MSFullscreenChange', fullscreenChange);
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const renderItem = (item: Item) => {
    const { id, title, message, timeCreated, url } = item;

    return (
      <ListItem key={id}>
        <ListItemAvatar>
          <Link href={url}>
            <Avatar><ReceiptLong /></Avatar>
            <Typography>
              {formatRelative(new Date(timeCreated), new Date())}
              {/* {formatDistance(new Date(timeCreated), new Date(), { locale: settings.locale || 'en' })} */}
            </Typography>
          </Link>
        </ListItemAvatar>
        <Link href={url} style={{ flex: 1 }}>
          <ListItemText primary={title} secondary={message} />
        </Link>
      </ListItem>
    );
  };

  const unread = unreadMsgs.map(renderItem);
  const read = readMsgs.map(renderItem);

  const open = Boolean(anchorEl);

  return (
    <Box display='flex' justifyContent='space-between' alignItems='center'>
      <Link href='/'><img src='/icons/fleetrule.svg' alt='Fleetrule - manage your fleet' /></Link>
      <Typography variant='h5'>test</Typography>
      <Box>
        <Tooltip title={fullscreen ? <FormattedMessage id='app.ExitFullscreen' /> : <FormattedMessage id='app.Fullscreen' />}>
          <Button onClick={handleFullscreen}>{fullscreen ? <FullscreenExit /> : <Fullscreen />}</Button>
        </Tooltip>
        <Tooltip title={<FormattedMessage id='app.Notifications' />}>
          <Button><NotificationsActive /><Typography>3</Typography></Button>
        </Tooltip>
        <Popover
          id='notifications'
          open={open}
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
          <List>
            {unread.length > 0 && (
              <>
                <ListItem>
                  <ListItemText secondary={<FormattedMessage id='app.Recent' />} />
                </ListItem>
                {unread}
              </>
            )}
            {read.length > 0 && (
              <>
                <ListItem>
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
        <Button><FormattedMessage id='app.Logout' /></Button>
      </Box>
    </Box>
  );
};

export default Header;
