import {
  ImageConfig,
  ImageConfigComplete,
  imageConfigDefault,
} from 'next/dist/shared/lib/image-config'
import Image, { ImageLoaderProps, ImageProps } from 'next/future/image'
import Head from 'next/head'
import { DetailedHTMLProps, SourceHTMLAttributes, useMemo } from 'react'
import useImageConfig from '../hooks/useImageConfig'

type ArtDirective = {
  src: string
  media: string
  width?: number
  height?: number
}

const AVIF = 'image/avif'
const WEBP = 'image/webp'
const FORMATS = [AVIF, WEBP]

type GetSourcesArgs = {
  config: ImageConfig
  src: string
  width?: number
  height?: number
  quality?: number
  formats?: string[]
  artDirevtives?: ArtDirective[]
  preloadFormat: typeof WEBP | typeof AVIF
}
type GetSourcesResult = {
  sources: DetailedHTMLProps<
    SourceHTMLAttributes<HTMLSourceElement>,
    HTMLSourceElement
  >[]
  preloadLinks: { srcSet: string; type: string; media?: string }[]
}
export const getSources = ({
  config,
  src,
  width,
  height,
  quality = 75,
  formats = FORMATS,
  artDirevtives,
  preloadFormat,
}: GetSourcesArgs): GetSourcesResult => {
  const getFotmatParam = (format: string): string =>
    format.replace(/^image\//, '')
  const getSrcSet = (src: string, format?: string): string =>
    config.deviceSizes
      ?.map(
        (deviceSize) =>
          `${loader({
            src,
            width: deviceSize,
            quality,
            format: format !== undefined ? getFotmatParam(format) : undefined,
          })} ${deviceSize}w`
      )
      .join(', ') ?? ''

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

    const artDirectivesPreloadLinks = artDirevtives.map(({ src, media }) => ({
      srcSet: getSrcSet(src, getFotmatParam(preloadFormat)),
      type: preloadFormat,
      media,
    }))
    const defaultPreloadLink = {
      srcSet: getSrcSet(src, getFotmatParam(preloadFormat)),
      type: preloadFormat,
      media: 'not all and ' + artDirectivesPreloadLinks.at(-1)?.media,
    }

    return {
      sources: [...artDirectivesSources, ...defaultSources].flat(),
      preloadLinks: [...artDirectivesPreloadLinks, defaultPreloadLink],
    }
  }

  return {
    sources: formats.map((format) => ({
      srcSet: getSrcSet(src, format),
      type: format,
    })),
    preloadLinks: [
      {
        srcSet: getSrcSet(src, getFotmatParam(preloadFormat)),
        type: preloadFormat,
      },
    ],
  }
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

type SourcesProps = GetSourcesResult & Pick<ImageProps, 'sizes' | 'priority'>

export const Sources = ({
  sources,
  sizes = '100vw',
  priority,
  preloadLinks,
}: SourcesProps) => {
  return (
    <>
      {sources.map((sourceProps) => (
        <source
          {...(process.env.NODE_ENV === 'test'
            ? { 'data-testid': 'source' }
            : {})}
          key={sourceProps.srcSet}
          {...sourceProps}
        />
      ))}

      {priority &&
        preloadLinks.map((linkProps) => (
          <Head key={linkProps.srcSet}>
            <link
              {...(process.env.NODE_ENV === 'test'
                ? { 'data-testid': 'link' }
                : {})}
              key={'__nimg-' + linkProps.srcSet + linkProps.media + sizes}
              rel="preload"
              as="image"
              type={linkProps.type}
              media={linkProps.media}
              imageSrcSet={linkProps.srcSet}
              imageSizes={sizes}
            />
          </Head>
        ))}
    </>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const configEnv = process.env.__NEXT_IMAGE_OPTS as any as ImageConfigComplete

type Props = Omit<
  ImageProps,
  'src' | 'width' | 'height' | 'blurDataURL' | 'loader' | 'alt'
> & {
  src: string
  width: number
  height: number
  alt: string
  artDirevtives?: ArtDirective[]
  preloadFormat?: typeof WEBP | typeof AVIF
}

const MicroCMSPicture = ({
  src,
  width,
  height,
  quality,
  priority,
  artDirevtives,
  preloadFormat = 'image/webp',
  ...props
}: Props) => {
  const configContext = useImageConfig()
  const config: ImageConfig = useMemo(() => {
    const c = configEnv || configContext || imageConfigDefault
    const allSizes = [...c.deviceSizes, ...c.imageSizes].sort((a, b) => a - b)
    const deviceSizes = c.deviceSizes.sort((a, b) => a - b)
    return { ...c, allSizes, deviceSizes }
  }, [configContext])

  const sources = getSources({
    src,
    width,
    height,
    quality: Number(quality),
    config,
    artDirevtives,
    preloadFormat,
  })

  return (
    <picture>
      <Sources {...sources} sizes={props.sizes} priority={priority} />
      <Image
        {...props}
        {...{ src, width, height, quality }}
        sizes={props.sizes ?? '100vw'}
        loader={loader}
        blurDataURL={
          props.placeholder === 'blur'
            ? loader({ src, width: 8, quality: 10 })
            : undefined
        }
        alt={props.alt}
        loading={priority ? 'eager' : props.loading}
      />
    </picture>
  )
}

export default MicroCMSPicture
