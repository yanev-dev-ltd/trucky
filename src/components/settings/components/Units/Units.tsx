import { RadioGroup, FormControlLabel, Radio } from '@mui/material'
import useUnits from './hooks/useUnits'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { FormattedMessage } from 'react-intl'

const Units = () => {
    const { settings } = useSelector((state: RootState) => state.settings)
    const { handleChange } = useUnits()
    return (
        <>
            <RadioGroup
                aria-label="units"
                name="units"
                value={settings.units}
                onChange={handleChange}
            >
                <FormControlLabel
                    value="km"
                    control={<Radio />}
                    label={<FormattedMessage id="app.Kilometers" />}
                />
                <FormControlLabel
                    value="m"
                    control={<Radio />}
                    label={<FormattedMessage id="app.Miles" />}
                />
                <FormControlLabel
                    value="h"
                    control={<Radio />}
                    label={<FormattedMessage id="app.Hours" />}
                />
            </RadioGroup>
        </>
    )
}

export default Units
