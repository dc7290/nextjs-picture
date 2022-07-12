import { renderHook } from '@testing-library/react'
import { imageConfigDefault } from 'next/dist/shared/lib/image-config'
import useImageConfig from './useImageConfig'

describe('useImageConfig', () => {
  it('型ImageConfigCompleteの値を返す', () => {
    const { result } = renderHook(() => useImageConfig())
    expect(result.current).toStrictEqual(imageConfigDefault)
  })
})
