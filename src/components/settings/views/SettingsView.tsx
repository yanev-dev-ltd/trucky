import { useMemo } from 'react'
import {
    Box,
    Paper,
    MenuList,
    MenuItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material'

import {
    CreditCard,
    Language as LanguageIcon,
    Palette,
    OneK,
    DeleteForever,
} from '@mui/icons-material'
import { SettingsViewProps } from '../types'
import sx from '../styles/Settings.sx'
import Link from 'next/link'
import { FormattedMessage } from 'react-intl'
import Payment from '../components/Payment/Payment'
import Language from '../components/Language/Language'
import Theme from '../components/Theme/Theme'
import Units from '../components/Units/Units'
import Delete from '../components/Delete/Delete'

export const SettingsView = ({ section }: SettingsViewProps) => {
    const component = useMemo(() => {
        switch (section) {
            case 'payment':
                return <Payment />
            case 'language':
                return <Language />
            case 'theme':
                return <Theme />
            case 'units':
                return <Units />
            case 'delete':
                return <Delete />
            default:
                return null
        }
    }, [section])

    return (
        <Box sx={sx.root}>
            <Paper sx={sx.menu}>
                <MenuList>
                    <MenuItem
                        component={Link}
                        href={'/settings/payment'}
                        sx={section === 'payment' ? sx.active : undefined}
                    >
                        <ListItemIcon>
                            <CreditCard fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <FormattedMessage id="app.Payment" />
                        </ListItemText>
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        href={'/settings/language'}
                        sx={section === 'language' ? sx.active : undefined}
                    >
                        <ListItemIcon>
                            <LanguageIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <FormattedMessage id="app.Language" />
                        </ListItemText>
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        href={'/settings/theme'}
                        sx={section === 'theme' ? sx.active : undefined}
                    >
                        <ListItemIcon>
                            <Palette fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <FormattedMessage id="app.Theme" />
                        </ListItemText>
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        href={'/settings/units'}
                        sx={section === 'units' ? sx.active : undefined}
                    >
                        <ListItemIcon>
                            <OneK fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <FormattedMessage id="app.DefaultUnits" />
                        </ListItemText>
                    </MenuItem>
                    <MenuItem
                        component={Link}
                        href={'/settings/delete'}
                        sx={section === 'delete' ? sx.active : undefined}
                    >
                        <ListItemIcon>
                            <DeleteForever fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <FormattedMessage id="app.DeleteAccount" />
                        </ListItemText>
                    </MenuItem>
                </MenuList>
            </Paper>
            <Box sx={sx.section}>{component}</Box>
        </Box>
    )
}
