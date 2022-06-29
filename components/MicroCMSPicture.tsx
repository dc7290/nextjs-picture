import { ImageConfigComplete } from 'next/dist/shared/lib/image-config'
import Image, { ImageLoaderProps, ImageProps } from 'next/future/image'
import { DetailedHTMLProps, SourceHTMLAttributes } from 'react'
import useImageConfig from '../hooks/useImageConfig'

type ArtDirective = {
  src: string
  media: string
  width?: number
  height?: number
}

const FORMATS = ['image/avif', 'image/webp']

type GetSourcesArgs = {
  config: ImageConfigComplete
  src: string
  width?: number
  height?: number
  quality?: number
  formats?: string[]
  artDirevtives?: ArtDirective[]
}
type GetSourcesResult = DetailedHTMLProps<
  SourceHTMLAttributes<HTMLSourceElement>,
  HTMLSourceElement
>[]
export const getSources = ({
  config,
  src,
  width,
  height,
  quality = 75,
  formats = FORMATS,
  artDirevtives,
}: GetSourcesArgs): GetSourcesResult => {
  const getFotmatParam = (format: string) => format.replace(/^image\//, '')
  const getSrcSet = (src: string, format?: string) =>
    config.deviceSizes
      .map(
        (deviceSize) =>
          `${loader({
            src,
            width: deviceSize,
            quality,
            format: format !== undefined ? getFotmatParam(format) : undefined,
          })} ${deviceSize}w`
      )
      .join(', ')

  if (artDirevtives !== undefined) {
    if (!Array.isArray(artDirevtives)) {
      throw Error('`artDirevtives`には配列を指定してください。')
    }

    const artDirectivesSources = artDirevtives.map(
      ({ src, media, width, height }) => [
        ...formats.map((format) => ({
          srcSet: getSrcSet(src, format),
          type: format,
          media,
          width,
          height,
        })),
        { srcSet: getSrcSet(src), media, width, height },
      ]
    )
    const defaultSources = formats.map((format) => ({
      srcSet: getSrcSet(src, format),
      type: format,
      width,
      height,
    }))

    return [...artDirectivesSources, ...defaultSources].flat()
  }

  return formats.map((format) => ({
    srcSet: getSrcSet(src, format),
    type: format,
    width,
    height,
  }))
}

const normalizeSrc = (src: string): string => {
  return src[0] === '/' ? src.slice(1) : src
}

const loader = ({
  src,
  width,
  quality,
  format,
}: ImageLoaderProps & { format?: string }) => {
  const url = new URL(normalizeSrc(src))
  const params = url.searchParams

  params.set('fit', params.get('fit') || 'max')
  params.set('w', params.get('w') || width.toString())

  if (quality) {
    params.set('q', quality.toString())
  }

  if (format) {
    params.set('fm', format)
  }

  return url.href
}

type Props = Omit<
  ImageProps,
  'src' | 'width' | 'height' | 'blurDataURL' | 'loader'
> & {
  src: string
  width: number
  height: number
  artDirevtives?: ArtDirective[]
}

const MicroCMSPicture = ({
  src,
  width,
  height,
  quality,
  artDirevtives,
  ...props
}: Props) => {
  const nextImageConfig = useImageConfig()

  const sources = getSources({
    src,
    width: width,
    height: height,
    quality: Number(quality),
    config: nextImageConfig,
    artDirevtives,
  })

  return (
    <picture>
      <Image
        src={src}
        loader={loader}
        alt={props.alt}
        blurDataURL={
          props.placeholder === 'blur'
            ? loader({ src, width: 8, quality: 10 })
            : undefined
        }
        {...props}
      />
    </picture>
  )
}

export default MicroCMSPicture
