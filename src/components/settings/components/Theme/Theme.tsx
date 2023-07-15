import { RadioGroup, FormControlLabel, Radio } from '@mui/material'
import useTheme from './hooks/useTheme'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { FormattedMessage } from 'react-intl'

const Theme = () => {
    const { settings } = useSelector((state: RootState) => state.settings)
    const { handleChange } = useTheme()
    return (
        <>
            <RadioGroup
                aria-label="theme"
                name="theme"
                value={settings.theme}
                onChange={handleChange}
            >
                <FormControlLabel
                    value="light"
                    control={<Radio />}
                    label={<FormattedMessage id="app.Light" />}
                />
                <FormControlLabel
                    value="dark"
                    control={<Radio />}
                    label={<FormattedMessage id="app.Dark" />}
                />
            </RadioGroup>
        </>
    )
}

export default Theme
