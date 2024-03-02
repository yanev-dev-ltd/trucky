import { Divider, List, ListItemText, Tooltip, Typography } from '@mui/material'
import { Maintenance } from '../../types'
import { FormattedMessage, useIntl } from 'react-intl'
import {
    Check,
    NotificationsActive,
    NotificationsNone,
} from '@mui/icons-material'
import { format } from 'date-fns'
import { RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import sx from './styles/MaintenanceStatus.sx'

const MaintenanceStatus = ({ maintenance }: { maintenance: Maintenance }) => {
    const { settings } = useSelector((state: RootState) => state.settings)
    const intl = useIntl()
    const reminders = []
    if (maintenance.status !== 'completed' && maintenance.reminderMileage) {
        reminders.push(
            <ListItemText
                sx={sx.tooltip}
                secondary={`${intl.formatMessage({
                    id: 'app.Maintenance.AlarmMileage',
                })}: ${
                    +maintenance.reminderMileage +
                    (maintenance?.startMileage || 0)
                } ${
                    settings.units === 'm'
                        ? intl.formatMessage({ id: 'app.Mi' })
                        : settings.units === 'km'
                        ? intl.formatMessage({ id: 'app.Km' })
                        : intl.formatMessage({ id: 'app.Hr' })
                }`}
            />
        )
    } else if (
        maintenance.status === 'completed' &&
        maintenance.reminderMileage
    ) {
        reminders.push(
            <ListItemText
                sx={sx.tooltip}
                secondary={`${intl.formatMessage({
                    id: 'app.Maintenance.CompletedMileage',
                })}: ${
                    Number(maintenance.reminderMileage) +
                    Number(maintenance?.startMileage || 0)
                } ${
                    settings.units === 'm'
                        ? intl.formatMessage({ id: 'app.Mi' })
                        : settings.units === 'km'
                        ? intl.formatMessage({ id: 'app.Km' })
                        : intl.formatMessage({ id: 'app.Hr' })
                }`}
            />
        )
    }
    if (maintenance.dateStatus !== 'completed' && maintenance.reminderDate) {
        reminders.push(
            <ListItemText
                sx={sx.tooltip}
                secondary={`${intl.formatMessage({
                    id: 'app.Maintenance.AlarmDate',
                })}: ${format(maintenance.reminderDate, 'dd/MM/yyyy')}`}
            />
        )
    } else if (
        maintenance.dateStatus === 'completed' &&
        maintenance.reminderDate
    ) {
        reminders.push(
            <ListItemText
                sx={sx.tooltip}
                secondary={`${intl.formatMessage({
                    id: 'app.Maintenance.CompletedDate',
                })}: ${format(maintenance.reminderDate, 'dd/MM/yyyy')}`}
            />
        )
    }
    return (
        <Tooltip
            title={
                maintenance.reminderDate || maintenance.reminderMileage ? (
                    <List disablePadding>
                        {reminders.map((reminder, index) => (
                            <Fragment key={index}>
                                {reminder}
                                {index < reminders.length - 1 && <Divider />}
                            </Fragment>
                        ))}
                    </List>
                ) : !maintenance.reminderDate &&
                  !maintenance.reminderMileage ? (
                    <FormattedMessage id="app.Maintenance.NoAlarm" />
                ) : null
            }
        >
            {(maintenance.reminderDate &&
                maintenance.reminderMileage &&
                (maintenance.dateStatus !== 'completed' ||
                    maintenance.status !== 'completed')) ||
            (!maintenance.reminderDate &&
                maintenance.reminderMileage &&
                maintenance.status !== 'completed') ||
            (maintenance.reminderDate &&
                !maintenance.reminderMileage &&
                maintenance.dateStatus !== 'completed') ? (
                <NotificationsActive />
            ) : (maintenance.reminderDate &&
                  maintenance.reminderMileage &&
                  maintenance.dateStatus === 'completed' &&
                  maintenance.status === 'completed') ||
              (!maintenance.reminderDate &&
                  maintenance.reminderMileage &&
                  maintenance.status === 'completed') ||
              (maintenance.reminderDate &&
                  !maintenance.reminderMileage &&
                  maintenance.dateStatus === 'completed') ? (
                <Check />
            ) : (
                <NotificationsNone />
            )}
        </Tooltip>
    )
}

export default MaintenanceStatus
