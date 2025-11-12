import { RenderTopHeader } from './TopHeader'
import { RenderMainHeader } from './MainHeader'

export const RenderHeader = () => {
  return (
    <header>
      <RenderTopHeader />
      <RenderMainHeader />
    </header>
  )
}

