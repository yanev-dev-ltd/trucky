import { RadioGroup, FormControlLabel, Radio } from '@mui/material'
import useLanguage from './hooks/useLanguage'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const Language = () => {
    const { settings } = useSelector((state: RootState) => state.settings)
    const { handleChange } = useLanguage()
    return (
        <>
            <RadioGroup
                aria-label="language"
                name="language"
                value={settings.locale}
                onChange={handleChange}
            >
                <FormControlLabel
                    value="en"
                    control={<Radio />}
                    label="English"
                />
                <FormControlLabel
                    value="bg"
                    control={<Radio />}
                    label="Български"
                />
            </RadioGroup>
        </>
    )
}

export default Language
