import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { ReactElement } from 'react'

import { getSources, Sources } from './MicroCMSPicture'

jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }: { children: Array<ReactElement> }) => {
      return <>{children}</>
    },
  }
})

const defaultSources = getSources({
  deviceSizes: [640, 1200],
  src: 'https://remote-image/image.png',
  preloadFormat: 'image/webp',
})
const artDirevtionSources = getSources({
  deviceSizes: [640, 1200],
  artDirevtives: [
    {
      src: 'https://remote-image/image_lg.png',
      media: '(min-width: 1024px)',
      width: 1920,
      height: 1200,
    },
    {
      src: 'https://remote-image/image_md.png',
      media: '(min-width: 768px)',
      width: 1920,
      height: 800,
    },
  ],
  src: 'https://remote-image/image.png',
  preloadFormat: 'image/webp',
})

describe('MicroCMSPicture', () => {
  describe('getSources', () => {
    it('デフォルトの動作で期待通りの値が返ってくることを確認する', () => {
      expect(defaultSources.sources).toStrictEqual([
        {
          srcSet:
            'https://remote-image/image.png?fit=max&w=640&q=75&fm=avif 640w, https://remote-image/image.png?fit=max&w=1200&q=75&fm=avif 1200w',
          type: 'image/avif',
        },
        {
          srcSet:
            'https://remote-image/image.png?fit=max&w=640&q=75&fm=webp 640w, https://remote-image/image.png?fit=max&w=1200&q=75&fm=webp 1200w',
          type: 'image/webp',
        },
      ])
      expect(defaultSources.preloadLinks).toStrictEqual([
        {
          srcSet:
            'https://remote-image/image.png?fit=max&w=640&q=75&fm=webp 640w, https://remote-image/image.png?fit=max&w=1200&q=75&fm=webp 1200w',
          type: 'image/webp',
        },
      ])
    })
    it('アートディレクションの動作で期待通りの値が返ってくることを確認する', () => {
      expect(artDirevtionSources.sources).toStrictEqual([
        {
          srcSet:
            'https://remote-image/image_lg.png?fit=max&w=640&q=75&fm=avif 640w, https://remote-image/image_lg.png?fit=max&w=1200&q=75&fm=avif 1200w',
          type: 'image/avif',
          media: '(min-width: 1024px)',
          width: 1920,
          height: 1200,
        },
        {
          srcSet:
            'https://remote-image/image_lg.png?fit=max&w=640&q=75&fm=webp 640w, https://remote-image/image_lg.png?fit=max&w=1200&q=75&fm=webp 1200w',
          type: 'image/webp',
          media: '(min-width: 1024px)',
          width: 1920,
          height: 1200,
        },
        {
          srcSet:
            'https://remote-image/image_lg.png?fit=max&w=640&q=75 640w, https://remote-image/image_lg.png?fit=max&w=1200&q=75 1200w',
          media: '(min-width: 1024px)',
          width: 1920,
          height: 1200,
        },
        {
          srcSet:
            'https://remote-image/image_md.png?fit=max&w=640&q=75&fm=avif 640w, https://remote-image/image_md.png?fit=max&w=1200&q=75&fm=avif 1200w',
          type: 'image/avif',
          media: '(min-width: 768px)',
          width: 1920,
          height: 800,
        },
        {
          srcSet:
            'https://remote-image/image_md.png?fit=max&w=640&q=75&fm=webp 640w, https://remote-image/image_md.png?fit=max&w=1200&q=75&fm=webp 1200w',
          type: 'image/webp',
          media: '(min-width: 768px)',
          width: 1920,
          height: 800,
        },
        {
          srcSet:
            'https://remote-image/image_md.png?fit=max&w=640&q=75 640w, https://remote-image/image_md.png?fit=max&w=1200&q=75 1200w',
          media: '(min-width: 768px)',
          width: 1920,
          height: 800,
        },
        {
          height: undefined,
          srcSet:
            'https://remote-image/image.png?fit=max&w=640&q=75&fm=avif 640w, https://remote-image/image.png?fit=max&w=1200&q=75&fm=avif 1200w',
          type: 'image/avif',
          width: undefined,
        },
        {
          height: undefined,
          srcSet:
            'https://remote-image/image.png?fit=max&w=640&q=75&fm=webp 640w, https://remote-image/image.png?fit=max&w=1200&q=75&fm=webp 1200w',
          type: 'image/webp',
          width: undefined,
        },
      ])
      expect(artDirevtionSources.preloadLinks).toStrictEqual([
        {
          media: '(min-width: 1024px)',
          srcSet:
            'https://remote-image/image_lg.png?fit=max&w=640&q=75&fm=webp 640w, https://remote-image/image_lg.png?fit=max&w=1200&q=75&fm=webp 1200w',
          type: 'image/webp',
        },
        {
          media: '(min-width: 768px)',
          srcSet:
            'https://remote-image/image_md.png?fit=max&w=640&q=75&fm=webp 640w, https://remote-image/image_md.png?fit=max&w=1200&q=75&fm=webp 1200w',
          type: 'image/webp',
        },
        {
          media: 'not all and (min-width: 768px)',
          srcSet:
            'https://remote-image/image.png?fit=max&w=640&q=75&fm=webp 640w, https://remote-image/image.png?fit=max&w=1200&q=75&fm=webp 1200w',
          type: 'image/webp',
        },
      ])
    })
  })

  it('デフォルトの動作をスナップショットテストで確認する', () => {
    render(<Sources {...defaultSources} />)
    expect(screen.getAllByTestId('source')).toMatchSnapshot()
  })
  it('アートディレクションの動作をスナップショットテストで確認する', () => {
    render(<Sources {...artDirevtionSources} />)
    expect(screen.getAllByTestId('source')).toMatchSnapshot()
  })

  it('デフォルトの動作でpriorityを設定した時に生成したpreloadLinksと一致するかを確認する', () => {
    render(<Sources {...defaultSources} priority />)
    const preloadLink = defaultSources.preloadLinks[0]
    expect(screen.getByTestId('link')).toHaveAttribute(
      'imagesrcset',
      preloadLink.srcSet
    )
    expect(screen.getByTestId('link')).toHaveAttribute('type', preloadLink.type)
  })
  it('アートディレクションの動作でpriorityを設定した時に生成したpreloadLinksと一致するかを確認する', () => {
    render(<Sources {...artDirevtionSources} priority />)
    const links = screen.getAllByTestId('link')

    artDirevtionSources.preloadLinks.forEach((preloadLink, i) => {
      const link = links[i]
      expect(link).toHaveAttribute('imagesrcset', preloadLink.srcSet)
      expect(link).toHaveAttribute('type', preloadLink.type)
    })
  })
})
