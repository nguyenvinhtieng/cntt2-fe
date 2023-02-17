import Zoom from 'react-medium-image-zoom'
export default function ZoomImage({children}) {
  return (
  <Zoom>
    {children}
  </Zoom>
  )
}
