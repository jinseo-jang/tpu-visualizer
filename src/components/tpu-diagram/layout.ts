import { type TpuArchitecture } from './architectures'

export interface Rect {
  x: number; y: number; w: number; h: number
}

export interface TpuLayout {
  arch: TpuArchitecture

  host: Rect
  chip1: Rect
  chip2: Rect | null       // null for v1 (no ICI)

  // Inside chip1 — per-core blocks (array of cores)
  cores: CoreLayout[]

  // Shared chip-level components
  hbm: Rect                // HBM (or DDR3 for v1)
  sparseCore: Rect | null  // SparseCore if present

  // Connection paths
  pciePath: [number, number][]
  iciPath: [number, number][] | null   // null for v1

  // Data flow paths — between chip-level components
  hostToMemPath: [number, number][]
  memToCorePaths: [number, number][][]   // HBM → each core's VMEM (one per core)
  coreToMemPaths: [number, number][][]   // each core's VMEM → HBM (one per core)
  memToIciPath: [number, number][] | null
}

export interface CoreLayout {
  outline: Rect            // core boundary
  label: string            // "TensorCore 0", "MegaCore", etc.
  scalar: Rect | null
  vmem: Rect | null        // VMEM or Unified Buffer
  vmemLabel: string
  mxus: Rect[]             // multiple MXUs possible
  acc: Rect | null
  vpu: Rect | null

  // Intra-core flow paths
  vmemToMxuPath: [number, number][]
  mxuToAccPath: [number, number][]
  accToVpuPath: [number, number][]
  vpuToVmemPath: [number, number][]
}

export function computeLayout(width: number, height: number, arch: TpuArchitecture): TpuLayout {
  const pad = Math.max(width * 0.03, 14)
  const hasSecondChip = arch.hasIci

  // --- Host block ---
  const hostW = width * 0.10
  const hostH = height * 0.08
  const host: Rect = { x: pad, y: pad + height * 0.04, w: hostW, h: hostH }

  // --- Chip 1 (main) ---
  const chip1Left = width * 0.16
  const chip1Right = hasSecondChip ? width * 0.76 : width - pad
  const chip1W = chip1Right - chip1Left
  const chip1Top = height * 0.06
  const chip1H = height * 0.88
  const chip1: Rect = { x: chip1Left, y: chip1Top, w: chip1W, h: chip1H }

  // --- Chip 2 (neighbor, if ICI exists) ---
  let chip2: Rect | null = null
  if (hasSecondChip) {
    const c2W = width * 0.16
    const c2H = height * 0.42
    chip2 = { x: width - pad - c2W, y: height * 0.27, w: c2W, h: c2H }
  }

  // --- Interior of Chip 1 ---
  const cPad = Math.max(chip1W * 0.03, 10)
  const innerX = chip1.x + cPad
  const innerY = chip1.y + cPad * 3  // more space for chip label + badges
  const innerW = chip1W - cPad * 2
  const innerH = chip1H - cPad * 4

  // --- HBM / Memory block (left side of chip) ---
  const hbmW = innerW * 0.12
  const hbmH = innerH * 0.75
  const hbm: Rect = {
    x: innerX,
    y: innerY + (innerH - hbmH) * 0.5,
    w: hbmW,
    h: hbmH,
  }

  // --- SparseCore (if present, below HBM) ---
  let sparseCore: Rect | null = null
  if (arch.hasSparseCore) {
    const scW = hbmW
    const scH = innerH * 0.08
    sparseCore = {
      x: innerX,
      y: hbm.y + hbm.h + cPad,
      w: scW,
      h: scH,
    }
    if (sparseCore.y + sparseCore.h > chip1.y + chip1H - cPad) {
      sparseCore.y = chip1.y + chip1H - cPad - scH
    }
  }

  // --- Core area (right of HBM, with generous gap) ---
  const coreAreaX = hbm.x + hbm.w + cPad * 2.5
  const coreAreaY = innerY
  const coreAreaW = innerX + innerW - coreAreaX
  const coreAreaH = innerH

  // --- Build cores ---
  const numCores = arch.coresPerChip
  const coreGap = numCores > 1 ? cPad * 1.5 : 0
  const singleCoreH = numCores > 1
    ? (coreAreaH - coreGap * (numCores - 1)) / numCores
    : coreAreaH

  const cores: CoreLayout[] = []
  for (let ci = 0; ci < numCores; ci++) {
    const coreY = coreAreaY + ci * (singleCoreH + coreGap)
    const coreRect: Rect = { x: coreAreaX, y: coreY, w: coreAreaW, h: singleCoreH }

    const corePad = Math.max(coreAreaW * 0.035, 8)
    const cInnerX = coreRect.x + corePad
    const cInnerY = coreRect.y + corePad * 2.5  // more space for core label
    const cInnerW = coreRect.w - corePad * 2
    const cInnerH = coreRect.h - corePad * 3.5

    // Scalar Unit (top of core)
    let scalar: Rect | null = null
    let belowScalarY = cInnerY
    if (arch.hasScalarUnit) {
      const sH = cInnerH * 0.06
      scalar = { x: cInnerX, y: cInnerY, w: cInnerW * 0.35, h: sH }
      belowScalarY = cInnerY + sH + corePad
    }

    const mainH = cInnerY + cInnerH - belowScalarY

    // VMEM / Unified Buffer (left within core, taller for visibility)
    let vmem: Rect | null = null
    let vmemLabel = ''
    const hasBuffer = arch.hasVmem || arch.id === 'v1'
    let mxuAreaX = cInnerX
    if (hasBuffer) {
      const vmemW = cInnerW * 0.15
      const vmemH = mainH * 0.75
      vmem = {
        x: cInnerX,
        y: belowScalarY + mainH * 0.02,
        w: vmemW,
        h: vmemH,
      }
      vmemLabel = arch.id === 'v1' ? 'Unified Buffer\n24 MiB' : arch.vmemLabel
      mxuAreaX = vmem.x + vmem.w + corePad * 2
    }

    // MXU(s) — arrange in grid
    const mxuCount = arch.mxusPerCore
    const mxuAreaW = cInnerX + cInnerW - mxuAreaX
    const mxuCols = mxuCount <= 2 ? mxuCount : 2
    const mxuRows = Math.ceil(mxuCount / mxuCols)
    const mxuGap = corePad
    const mxuCellW = (mxuAreaW - mxuGap * (mxuCols - 1)) / mxuCols
    const mxuMaxH = mainH * (mxuCount > 2 ? 0.48 : 0.52)
    const mxuCellH = (mxuMaxH - mxuGap * (mxuRows - 1)) / mxuRows
    const mxuSide = Math.min(mxuCellW, mxuCellH)

    const mxus: Rect[] = []
    const mxuGridW = mxuCols * mxuSide + (mxuCols - 1) * mxuGap
    const mxuGridH = mxuRows * mxuSide + (mxuRows - 1) * mxuGap
    const mxuStartX = mxuAreaX + (mxuAreaW - mxuGridW) / 2
    const mxuStartY = belowScalarY + mainH * 0.02

    for (let r = 0; r < mxuRows; r++) {
      for (let c = 0; c < mxuCols; c++) {
        if (mxus.length >= mxuCount) break
        mxus.push({
          x: mxuStartX + c * (mxuSide + mxuGap),
          y: mxuStartY + r * (mxuSide + mxuGap),
          w: mxuSide,
          h: mxuSide,
        })
      }
    }

    // Accumulators (below MXUs — generous gap)
    let acc: Rect | null = null
    const accTopY = mxuStartY + mxuGridH + corePad * 1.8
    if (arch.hasAccumulators) {
      const accW = mxuGridW
      const accH = mainH * 0.11
      acc = {
        x: mxuStartX + (mxuGridW - accW) / 2,
        y: accTopY,
        w: accW,
        h: accH,
      }
    }

    // VPU (below accumulators — generous gap)
    let vpu: Rect | null = null
    if (arch.hasVpu) {
      const vpuTopY = acc ? acc.y + acc.h + corePad * 1.5 : accTopY
      const vpuW = mxuGridW * 0.55
      const vpuH = mainH * 0.11
      vpu = {
        x: mxuStartX + (mxuGridW - vpuW) / 2,
        y: vpuTopY,
        w: vpuW,
        h: vpuH,
      }
    }

    // Core label
    let coreLabel: string
    if (numCores === 1) {
      coreLabel = arch.coreName
    } else {
      coreLabel = `${arch.coreName} ${ci}`
    }

    // Intra-core flow paths — clean straight lines with good spacing
    const firstMxu = mxus[0]
    const mxuCenterX = mxuStartX + mxuGridW / 2

    // VMEM → MXU (horizontal straight line)
    const vmemToMxuPath: [number, number][] = vmem ? [
      [vmem.x + vmem.w, vmem.y + vmem.h * 0.35],
      [firstMxu.x, firstMxu.y + firstMxu.h * 0.35],
    ] : []

    // MXU → ACC (vertical straight line, centered)
    const mxuToAccPath: [number, number][] = acc ? [
      [mxuCenterX, mxuStartY + mxuGridH],
      [mxuCenterX, acc.y],
    ] : []

    // ACC → VPU (vertical straight line, centered)
    const accToVpuPath: [number, number][] = (acc && vpu) ? [
      [mxuCenterX, acc.y + acc.h],
      [mxuCenterX, vpu.y],
    ] : []

    // VPU → VMEM (return path: horizontal left from VPU to VMEM right edge)
    const vpuToVmemPath: [number, number][] = (vpu && vmem) ? [
      [vpu.x, vpu.y + vpu.h * 0.5],
      [vmem.x + vmem.w, vmem.y + vmem.h * 0.75],
    ] : []

    cores.push({
      outline: coreRect,
      label: coreLabel,
      scalar,
      vmem,
      vmemLabel,
      mxus,
      acc,
      vpu,
      vmemToMxuPath,
      mxuToAccPath,
      accToVpuPath,
      vpuToVmemPath,
    })
  }

  // --- Chip-level connection paths ---

  // PCIe: Host → Chip1
  const pciePath: [number, number][] = [
    [host.x + host.w, host.y + host.h / 2],
    [chip1.x, chip1.y + cPad * 2],
  ]

  // ICI: Chip1 → Chip2 (straight horizontal line)
  let iciPath: [number, number][] | null = null
  if (hasSecondChip && chip2) {
    const iciY = chip2.y + chip2.h * 0.4
    iciPath = [
      [chip1.x + chip1W, iciY],
      [chip2.x, iciY],
    ]
  }

  // Host → HBM/Memory (straight diagonal)
  const hostToMemPath: [number, number][] = [
    [host.x + host.w, host.y + host.h * 0.5],
    [hbm.x + hbm.w * 0.5, hbm.y],
  ]

  // HBM → each core's VMEM (one path per core)
  const memToCorePaths: [number, number][][] = cores.map((core, ci) => {
    const target = core.vmem ?? core.mxus[0]
    // Stagger the HBM exit point vertically so paths don't overlap
    const hbmYFrac = 0.2 + (ci / Math.max(cores.length - 1, 1)) * 0.3
    return [
      [hbm.x + hbm.w, hbm.y + hbm.h * hbmYFrac],
      [target.x, target.y + target.h * 0.3],
    ]
  })

  // Each core's VMEM → HBM writeback (one path per core)
  const coreToMemPaths: [number, number][][] = cores.map((core, ci) => {
    const source = core.vmem ?? core.mxus[core.mxus.length - 1]
    const hbmYFrac = 0.55 + (ci / Math.max(cores.length - 1, 1)) * 0.25
    return [
      [source.x, source.y + source.h * 0.75],
      [hbm.x + hbm.w, hbm.y + hbm.h * hbmYFrac],
    ]
  })

  // HBM → ICI
  let memToIciPath: [number, number][] | null = null
  if (iciPath) {
    memToIciPath = [
      [hbm.x + hbm.w, hbm.y + hbm.h * 0.5],
      [iciPath[0][0], hbm.y + hbm.h * 0.5],
      iciPath[0],
    ]
  }

  return {
    arch,
    host,
    chip1,
    chip2,
    cores,
    hbm,
    sparseCore,
    pciePath,
    iciPath,
    hostToMemPath,
    memToCorePaths,
    coreToMemPaths,
    memToIciPath,
  }
}
