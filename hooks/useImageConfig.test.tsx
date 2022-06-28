import { renderHook } from '@testing-library/react'
import { IMAGECONFIG_DEFAULT } from '../utils/constants'
import useImageConfig from './useImageConfig'

describe('useImageConfig', () => {
  it('型ImageConfigCompleteの値を返す', () => {
    const { result } = renderHook(() => useImageConfig())
    expect(result.current).toStrictEqual(IMAGECONFIG_DEFAULT)
  })
})
