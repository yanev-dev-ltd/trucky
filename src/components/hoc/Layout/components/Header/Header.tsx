import { FC } from 'react'
import { wrap } from '../../../../../utils/globalUtils'
import useHeader from './hooks/useHeader'
import { HeaderView } from './views/HeaderView'

const Header: FC<undefined> = wrap(HeaderView, useHeader)
export default Header
