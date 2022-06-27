import Image, { ImageProps } from 'next/image'
import { ImageConfigContext } from 'next/dist/shared/lib/image-config-context'
import { useContext } from 'react'

type ArtDirective = {
  media: string
}

type Props = {
  artDirevtives?: ArtDirective[]
} & Omit<ImageProps, 'blurDataURL' | 'loader'>

const MicroCMSPicture = ({ src, ...props }: Props) => {
  const nextImageConfig = useContext(ImageConfigContext)

  return (
    <picture>
      <Image src={src} {...props} />
    </picture>
  )
}

export default MicroCMSPicture
