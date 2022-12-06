import React from 'react';
import Link from 'next/link';
import { MenuList, MenuItem, Paper, Typography, ListItemIcon } from '@mui/material';
import { LocalShipping, People, ListAlt, Room, Receipt, AccountBox, BarChart, Settings } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl'
import sx from './styles/Navigation.sx'
import { useRouter } from 'next/router'

const Navigation = () => {
    const router = useRouter()
    return (
        <Paper sx={sx.root}>
            <MenuList sx={sx.list}>
            <MenuItem
                component={Link}
                href='/vehicles'
                sx={router.asPath.startsWith('/vehicles') ? sx.itemCurrent : sx.item}
            >
                <ListItemIcon>
                <LocalShipping fontSize='large' sx={sx.icon} />
                </ListItemIcon>
                <Typography variant='inherit'><FormattedMessage id='app.Vehicles' /></Typography>
            </MenuItem>
            <MenuItem
                component={Link}
                href='/drivers'
                sx={router.asPath.startsWith('/drivers') ? sx.itemCurrent : sx.item}
            >
                <ListItemIcon>
                <People fontSize='large' sx={sx.icon} />
                </ListItemIcon>
                <Typography variant='inherit'><FormattedMessage id='app.Drivers' /></Typography>
            </MenuItem>
            <MenuItem
                component={Link}
                href='/orders'
                sx={router.asPath.startsWith('/orders') ? sx.itemCurrent : sx.item}
            >
                <ListItemIcon>
                <ListAlt fontSize='large' sx={sx.icon} />
                </ListItemIcon>
                <Typography variant='inherit'><FormattedMessage id='app.Orders' /></Typography>
            </MenuItem>
            <MenuItem
                component={Link}
                href='/routes'
                sx={router.asPath.startsWith('/routes') ? sx.itemCurrent : sx.item}
            >
                <ListItemIcon>
                <Room fontSize='large' sx={sx.icon} />
                </ListItemIcon>
                <Typography variant='inherit'><FormattedMessage id='app.Routes' /></Typography>
            </MenuItem>
            <MenuItem
                component={Link}
                href='/invoices'
                sx={router.asPath.startsWith('/invoices') ? sx.itemCurrent : sx.item}
            >
                <ListItemIcon>
                <Receipt fontSize='large' sx={sx.icon} />
                </ListItemIcon>
                <Typography variant='inherit'><FormattedMessage id='app.Invoices' /></Typography>
            </MenuItem>
            <MenuItem
                component={Link}
                href='/clients'
                sx={router.asPath.startsWith('/clients') ? sx.itemCurrent : sx.item}
            >
                <ListItemIcon>
                <AccountBox fontSize='large' sx={sx.icon} />
                </ListItemIcon>
                <Typography variant='inherit'><FormattedMessage id='app.Clients' /></Typography>
            </MenuItem>
            {/* <MenuItem
                className={path.startsWith('/users') ? classes.itemCurrent : classes.item}
                component={Link}
                to='/users'
                onClick={() => setPath('/users')}
            >
                <ListItemIcon>
                <ContactsIcon fontSize='large' className={classes.icon} />
                </ListItemIcon>
                <Typography variant='inherit'><FormattedMessage id='app.Users' /></Typography>
            </MenuItem> */}
            <MenuItem
                component={Link}
                href='/stats'
                sx={router.asPath.startsWith('/stats') ? sx.itemCurrent : sx.item}
            >
                <ListItemIcon>
                <BarChart fontSize='large' sx={sx.icon} />
                </ListItemIcon>
                <Typography variant='inherit'><FormattedMessage id='app.Stats' /></Typography>
            </MenuItem>
            <MenuItem
                component={Link}
                href='/settings'
                sx={router.asPath.startsWith('/settings') ? sx.itemCurrent : sx.item}
            >
                <ListItemIcon>
                <Settings fontSize='large' sx={sx.icon} />
                </ListItemIcon>
                <Typography variant='inherit'><FormattedMessage id='app.Settings' /></Typography>
            </MenuItem>
            </MenuList>
        </Paper>
    )
}

export default Navigation;
