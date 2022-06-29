import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { NextConfig } from 'next'
import { IMAGECONFIG_DEFAULT } from '../utils/constants'

import MicroCMSPicture, { getSources } from './MicroCMSPicture'

const createConfig = (customConfig?: NextConfig['images']) => {
  return Object.assign(IMAGECONFIG_DEFAULT, customConfig)
}

describe('MicroCMSPicture', () => {
  describe('getSources', () => {
    it('デフォルトの動作', () => {
      const sources = getSources({
        config: createConfig({
          deviceSizes: [640, 1200],
        }),
        src: 'https://remote-image/image.png',
      })

      expect(sources).toStrictEqual([
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
    })
    it('アートディレクションの動作', () => {
      const sources = getSources({
        config: createConfig({
          deviceSizes: [640, 1200],
        }),
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
      })
      expect(sources).toStrictEqual([
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
        // {
        //   height: undefined,
        //   srcSet:
        //     'https://remote-image/image.png?fit=max&w=640&q=75&fm=avif 640w, https://remote-image/image.png?fit=max&w=1200&q=75&fm=avif 1200w',
        //   type: 'image/avif',
        //   width: undefined,
        // },
        // {
        //   height: undefined,
        //   srcSet:
        //     'https://remote-image/image.png?fit=max&w=640&q=75&fm=webp 640w, https://remote-image/image.png?fit=max&w=1200&q=75&fm=webp 1200w',
        //   type: 'image/webp',
        //   width: undefined,
        // },
      ])
    })
  })

  it.todo('デフォルトの動作')
  it.todo('アートディレクションの動作')
})
