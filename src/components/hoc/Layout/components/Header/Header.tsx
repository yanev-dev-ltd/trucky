import { FC } from 'react'
import { wrap } from '../../../../../utils/globalUtils'
import useHeader from './hooks/useHeader'
import { HeaderView } from './views/HeaderView'
import { HeaderWrap } from './types'

const Header: FC<HeaderWrap> = wrap(HeaderView, useHeader)
export default Header
