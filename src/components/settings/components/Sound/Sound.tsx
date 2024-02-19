import { RadioGroup, FormControlLabel, Radio } from '@mui/material'
import useSound from './hooks/useSound'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { FormattedMessage } from 'react-intl'

const Sound = () => {
    const { settings } = useSelector((state: RootState) => state.settings)
    const { handleChange } = useSound()
    return (
        <>
            <RadioGroup
                aria-label="theme"
                name="theme"
                value={settings.sound}
                onChange={handleChange}
            >
                <FormControlLabel
                    value="on"
                    control={<Radio />}
                    label={<FormattedMessage id="app.On" />}
                />
                <FormControlLabel
                    value="off"
                    control={<Radio />}
                    label={<FormattedMessage id="app.Off" />}
                />
            </RadioGroup>
        </>
    )
}

export default Sound
