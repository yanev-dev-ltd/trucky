import { InsertComment } from '@mui/icons-material'
import { FormattedMessage } from 'react-intl'
import { IconButton, Tooltip, Typography } from '@mui/material'

const Feedback = () => {
    return (
        <Tooltip
            title={
                <>
                    <Typography color="inherit">
                        <FormattedMessage id="app.Feedback" />
                    </Typography>
                    <FormattedMessage id="app.FeedbackMessage" />
                </>
            }
        >
            <IconButton color="inherit">
                <InsertComment />
            </IconButton>
        </Tooltip>
    )
}

export default Feedback
