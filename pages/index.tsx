import Head from 'next/head'
import { createClient, MicroCMSDate, MicroCMSImage } from 'microcms-js-sdk'
import { GetStaticProps, NextPage } from 'next'
import Picture from '../components/MicroCMSPicture'

type MicroCMSApiImage = {
  default_image: MicroCMSImage
  art_directive_image: {
    fieldId: 'art_directive_image'
    default_image: MicroCMSImage
    md_image?: MicroCMSImage
    lg_image?: MicroCMSImage
    '2xl_image'?: MicroCMSImage
  }
}

type Props = MicroCMSApiImage & MicroCMSDate

export const getStaticProps: GetStaticProps<Props> = async () => {
  const content = await createClient({
    serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN ?? '',
    apiKey: process.env.MICROCMS_API_KEY ?? '',
  }).getObject<MicroCMSApiImage>({ endpoint: 'image' })

  return {
    props: {
      ...content,
    },
  }
}

const Home: NextPage<Props> = ({ default_image, art_directive_image }) => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h2>通常の画像</h2>
        <div style={{ overflow: 'hidden' }}>
          <Picture
            src={default_image.url}
            width={default_image.width ?? 0}
            height={default_image.height ?? 0}
            placeholder="blur"
            priority
            preloadFormat="image/avif"
            alt=""
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        <h2>アートディレクション画像</h2>
        <div style={{ overflow: 'hidden' }}>
          <Picture
            src={art_directive_image.default_image.url}
            width={art_directive_image.default_image.width ?? 0}
            height={art_directive_image.default_image.height ?? 0}
            placeholder="blur"
            alt=""
            style={{ width: '100%', height: 'auto', display: 'block' }}
            artDirevtives={[
              art_directive_image.md_image !== undefined
                ? {
                    src: art_directive_image.md_image.url,
                    media: '(min-width: 768px)',
                  }
                : null,
              art_directive_image.lg_image !== undefined
                ? {
                    src: art_directive_image.lg_image.url,
                    media: '(min-width: 1024px)',
                  }
                : null,
              art_directive_image['2xl_image'] !== undefined
                ? {
                    src: art_directive_image['2xl_image'].url,
                    media: '(min-width: 1536px)',
                  }
                : null,
            ].flatMap((item) => (item !== null ? [item] : []))}
          />
        </div>
      </main>
    </div>
  )
}

export default Home
