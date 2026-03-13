import { type ComponentType } from 'react'
import TpuV1 from './TpuV1'
import TpuV2 from './TpuV2'
import TpuV3 from './TpuV3'
import TpuV4 from './TpuV4'
import TpuV5e from './TpuV5e'
import TpuV5p from './TpuV5p'
import TpuTrillium from './TpuTrillium'
import TpuIronwood from './TpuIronwood'

export const tpuModels: Record<string, ComponentType> = {
  v1: TpuV1,
  v2: TpuV2,
  v3: TpuV3,
  v4: TpuV4,
  v5e: TpuV5e,
  v5p: TpuV5p,
  trillium: TpuTrillium,
  ironwood: TpuIronwood,
}

export { TpuV1, TpuV2, TpuV3, TpuV4, TpuV5e, TpuV5p, TpuTrillium, TpuIronwood }
