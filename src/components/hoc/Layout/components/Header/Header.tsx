import { FC } from 'react'
import { wrap } from '../../../../../utils/globalUtils'
import useHeader from './hooks/useHeader'
import { HeaderView } from './views/HeaderView'

// @ts-ignore
const Header: FC = wrap(HeaderView, useHeader)
export default Header
