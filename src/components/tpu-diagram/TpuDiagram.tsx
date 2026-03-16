import { useRef, useEffect, useCallback } from 'react'
import { COLORS, withAlpha } from './colors'
import { computeLayout, type TpuLayout, type CoreLayout } from './layout'
import { getArchitecture, type TpuArchitecture } from './architectures'
import {
  drawBox,
  drawLabel,
  drawPath,
  drawFlowDots,
  drawSystolicGrid,
  drawHbmLayers,
  drawBadge,
} from './draw'

interface TpuDiagramProps {
  tourStep: number   // -1 = no tour, 0-5 = tour steps
  isActive: boolean  // tour active
  generationId?: string
}

type Component = 'mxu' | 'hbm' | 'vmem' | 'vpu' | 'acc' | 'scalar' | 'host' | 'chip2' | 'ici' | 'sparsecore' | 'core'

export default function TpuDiagram({ tourStep, isActive, generationId }: TpuDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const layoutRef = useRef<TpuLayout | null>(null)
  const archRef = useRef<TpuArchitecture>(getArchitecture(generationId ?? 'v5e'))
  const animFrameRef = useRef<number>(0)
  const startTimeRef = useRef<number>(performance.now())

  // Update architecture when generationId changes
  useEffect(() => {
    archRef.current = getArchitecture(generationId ?? 'v5e')
  }, [generationId])

  const getOpacity = useCallback(
    (component: Component) => {
      if (!isActive || tourStep <= 0) return 1

      switch (tourStep) {
        case 1: // MXU focus
          return component === 'mxu' ? 1 : 0.25
        case 2: // HBM → VMEM → MXU flow
          return (component === 'hbm' || component === 'vmem' || component === 'mxu') ? 1 : 0.25
        case 3: // MXU → ACC → VPU → VMEM → HBM flow
          return (component === 'acc' || component === 'vpu' || component === 'vmem' || component === 'mxu' || component === 'hbm') ? 1 : 0.25
        case 4: // ICI: HBM → chip2
          return (component === 'ici' || component === 'chip2' || component === 'hbm') ? 1 : 0.25
        case 5: // Full pipeline
          return 1
        default:
          return 1
      }
    },
    [isActive, tourStep],
  )

  const render = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      const layout = layoutRef.current
      if (!layout) return
      const arch = layout.arch

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = COLORS.bg
      ctx.fillRect(0, 0, width, height)

      const elapsed = (time - startTimeRef.current) / 1000
      const cycle = (elapsed * 0.25) % 1

      // ─── Host ───
      ctx.globalAlpha = getOpacity('host')
      drawBox(ctx, layout.host, COLORS.host, undefined, undefined, 8)
      drawLabel(ctx, 'Host (CPU)', layout.host.x + layout.host.w / 2, layout.host.y + layout.host.h / 2, '#ffffff', 12)

      // ─── PCIe connection ───
      ctx.globalAlpha = Math.min(getOpacity('host'), getOpacity('hbm'))
      drawPath(ctx, layout.pciePath, COLORS.host, 1.5, true, true)
      const pcieM = [
        (layout.pciePath[0][0] + layout.pciePath[1][0]) / 2,
        (layout.pciePath[0][1] + layout.pciePath[1][1]) / 2,
      ]
      drawLabel(ctx, 'PCIe', pcieM[0], pcieM[1] - 12, COLORS.textSecondary, 10)

      // ─── Chip 1 outline ───
      ctx.globalAlpha = 1
      drawBox(ctx, layout.chip1, COLORS.chipBg, COLORS.chipBorder, 2, 12)

      // Chip label with generation info
      drawLabel(
        ctx, arch.chipLabel,
        layout.chip1.x + layout.chip1.w / 2,
        layout.chip1.y + 14,
        COLORS.text, 14,
      )

      // Capability badges
      const badgeY = layout.chip1.y + 32
      const badgeCenterX = layout.chip1.x + layout.chip1.w / 2
      const badges: string[] = []
      if (!arch.supportsTraining) badges.push('Inference Only')
      if (arch.hasLiquidCooling) badges.push('Liquid Cooled')
      if (arch.hasOcs) badges.push('OCS')

      badges.forEach((b, i) => {
        const bx = badgeCenterX + (i - (badges.length - 1) / 2) * 90
        drawBadge(ctx, b, bx, badgeY, withAlpha(COLORS.mxu, 0.1), COLORS.mxu, 9)
      })

      // ─── HBM / Memory ───
      ctx.globalAlpha = getOpacity('hbm')
      const isHbm = arch.hbmStacks > 0
      const memColor = isHbm ? COLORS.hbm : '#78909c'
      drawBox(ctx, layout.hbm, withAlpha(memColor, 0.08), memColor, 1.5, 8)
      if (isHbm) {
        drawHbmLayers(ctx, layout.hbm, memColor, Math.min(arch.hbmStacks, 10))
      } else {
        drawBox(ctx, layout.hbm, withAlpha(memColor, 0.25), memColor, 1, 8)
      }
      // Memory label — name, capacity, description
      const memLabelY = isHbm ? layout.hbm.y + layout.hbm.h + 14 : layout.hbm.y + layout.hbm.h * 0.35
      const memLabelColor = isHbm ? memColor : '#ffffff'
      drawLabel(ctx, arch.memoryType, layout.hbm.x + layout.hbm.w / 2, memLabelY, memLabelColor, 13)
      drawLabel(
        ctx, `${arch.memoryGb} GB`,
        layout.hbm.x + layout.hbm.w / 2,
        memLabelY + 16,
        withAlpha(memLabelColor, 0.7), 10, undefined, '400',
      )
      // Descriptive subtitle
      const memDesc = isHbm ? 'Off-chip DRAM' : 'Off-chip Memory'
      drawLabel(
        ctx, memDesc,
        layout.hbm.x + layout.hbm.w / 2,
        memLabelY + 30,
        withAlpha(memLabelColor, 0.5), 9, undefined, '400',
      )

      // ─── SparseCore ───
      if (layout.sparseCore) {
        ctx.globalAlpha = getOpacity('core') * 0.8
        drawBox(ctx, layout.sparseCore, withAlpha('#009688', 0.1), '#009688', 1, 6)
        drawLabel(
          ctx, 'SparseCore',
          layout.sparseCore.x + layout.sparseCore.w / 2,
          layout.sparseCore.y + layout.sparseCore.h / 2,
          '#009688', 10,
        )
      }

      // ─── Cores ───
      for (const core of layout.cores) {
        drawCore(ctx, core, arch, elapsed, isActive, tourStep, getOpacity)
      }

      // ─── Chip 2 ───
      if (layout.chip2) {
        ctx.globalAlpha = getOpacity('chip2')
        drawBox(ctx, layout.chip2, COLORS.chipBg, COLORS.chipBorder, 1.5, 10)
        drawLabel(
          ctx, 'Neighbor Chip',
          layout.chip2.x + layout.chip2.w / 2,
          layout.chip2.y + layout.chip2.h * 0.35,
          COLORS.textSecondary, 14,
        )
        drawLabel(
          ctx, arch.chipLabel,
          layout.chip2.x + layout.chip2.w / 2,
          layout.chip2.y + layout.chip2.h * 0.50,
          withAlpha(COLORS.textSecondary, 0.6), 11,
        )
        drawLabel(
          ctx, '(Same architecture)',
          layout.chip2.x + layout.chip2.w / 2,
          layout.chip2.y + layout.chip2.h * 0.63,
          withAlpha(COLORS.textSecondary, 0.35), 9, undefined, '400',
        )
      }

      // ─── ICI ───
      if (layout.iciPath) {
        ctx.globalAlpha = getOpacity('ici')
        drawPath(ctx, layout.iciPath, COLORS.ici, 2.5, false, true)
        const iciMidX = (layout.iciPath[0][0] + layout.iciPath[1][0]) / 2
        const iciMidY = (layout.iciPath[0][1] + layout.iciPath[1][1]) / 2
        drawLabel(ctx, 'ICI', iciMidX, iciMidY - 16, COLORS.ici, 13)
        if (arch.iciTopology) {
          drawLabel(
            ctx, arch.iciTopology,
            iciMidX, iciMidY - 2,
            withAlpha(COLORS.ici, 0.7), 10, undefined, '400',
          )
        }
      }

      // ─── Data flow animations ───
      ctx.globalAlpha = 1
      renderFlows(ctx, layout, elapsed, cycle, isActive, tourStep)

      // ─── Subtle structural arrows (always visible, per-core) ───
      ctx.globalAlpha = 0.25
      for (const p of layout.memToCorePaths) {
        drawPath(ctx, p, COLORS.hbm, 1, true, true)
      }
      for (const p of layout.coreToMemPaths) {
        drawPath(ctx, p, COLORS.vmem, 1, true, true)
      }
      if (layout.hostToMemPath.length >= 2) {
        drawPath(ctx, layout.hostToMemPath, COLORS.textSecondary, 0.8, true, false)
      }

      ctx.globalAlpha = 1
    },
    [isActive, tourStep, getOpacity],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    startTimeRef.current = performance.now()

    const updateLayout = (width: number, height: number) => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      layoutRef.current = computeLayout(width, height, archRef.current)
    }

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        updateLayout(width, height)
      }
    })

    resizeObserver.observe(canvas)

    const animate = (time: number) => {
      const rect = canvas.getBoundingClientRect()
      render(ctx, rect.width, rect.height, time)
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      resizeObserver.disconnect()
      cancelAnimationFrame(animFrameRef.current)
    }
  }, [render, generationId])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  )
}

/**
 * Draw a single TensorCore / MegaCore.
 */
function drawCore(
  ctx: CanvasRenderingContext2D,
  core: CoreLayout,
  arch: TpuArchitecture,
  elapsed: number,
  isActive: boolean,
  tourStep: number,
  getOpacity: (c: Component) => number,
): void {
  // Core outline
  ctx.globalAlpha = 1
  drawBox(ctx, core.outline, withAlpha(COLORS.chipBorder, 0.12), COLORS.chipBorder, 1, 10)
  drawLabel(
    ctx, core.label,
    core.outline.x + core.outline.w / 2,
    core.outline.y + 13,
    COLORS.textSecondary, 12,
  )

  // Scalar Unit
  if (core.scalar) {
    ctx.globalAlpha = getOpacity('scalar')
    drawBox(ctx, core.scalar, withAlpha(COLORS.textSecondary, 0.08), COLORS.textSecondary, 0.8, 4)
    drawLabel(
      ctx, 'Scalar Unit',
      core.scalar.x + core.scalar.w / 2,
      core.scalar.y + core.scalar.h / 2,
      COLORS.textSecondary, 10,
    )
  }

  // VMEM / Unified Buffer
  if (core.vmem) {
    ctx.globalAlpha = getOpacity('vmem')
    drawBox(ctx, core.vmem, withAlpha(COLORS.vmem, 0.1), COLORS.vmem, 1.5, 8)
    drawLabel(
      ctx, core.vmemLabel,
      core.vmem.x + core.vmem.w / 2,
      core.vmem.y + core.vmem.h * 0.4,
      COLORS.vmem, 11,
    )
    // Descriptive subtitle
    drawLabel(
      ctx, 'On-chip\nSRAM Buffer',
      core.vmem.x + core.vmem.w / 2,
      core.vmem.y + core.vmem.h * 0.7,
      withAlpha(COLORS.vmem, 0.5), 8, undefined, '400',
    )
  }

  // MXU(s)
  ctx.globalAlpha = getOpacity('mxu')
  for (let mi = 0; mi < core.mxus.length; mi++) {
    const mxu = core.mxus[mi]
    drawBox(ctx, mxu, withAlpha(COLORS.mxu, 0.06), COLORS.mxu, 1.5, 8)

    const animating = isActive && tourStep === 1
    drawSystolicGrid(ctx, mxu, animating ? elapsed * 0.6 : 0.5, COLORS.mxu)

    if (mi === 0) {
      const mxuLabelText = core.mxus.length > 1
        ? `MXU ×${core.mxus.length}`
        : 'MXU'
      drawLabel(ctx, mxuLabelText, mxu.x + mxu.w / 2, mxu.y - 12, COLORS.mxu, 13)

      // Systolic array description
      drawLabel(
        ctx,
        `${arch.mxuSize[0]}×${arch.mxuSize[1]} Systolic Array`,
        mxu.x + mxu.w / 2,
        mxu.y + mxu.h + 12,
        withAlpha(COLORS.mxu, 0.55), 9, undefined, '400',
      )
      drawLabel(
        ctx,
        arch.mxuDataType.split(' / ')[0],
        mxu.x + mxu.w / 2,
        mxu.y + mxu.h + 24,
        withAlpha(COLORS.mxu, 0.4), 8, undefined, '400',
      )
    }
  }

  // Accumulators
  if (core.acc) {
    ctx.globalAlpha = getOpacity('acc')
    drawBox(ctx, core.acc, withAlpha(COLORS.acc, 0.1), COLORS.acc, 1.5, 6)
    drawLabel(
      ctx, 'Accumulators',
      core.acc.x + core.acc.w / 2,
      core.acc.y + core.acc.h * 0.5,
      COLORS.acc, 11,
    )
  }

  // VPU
  if (core.vpu) {
    ctx.globalAlpha = getOpacity('vpu')
    drawBox(ctx, core.vpu, withAlpha(COLORS.vpu, 0.1), COLORS.vpu, 1.5, 6)
    const vpuText = arch.vpuLanes > 0 ? `VPU (${arch.vpuLanes} lanes)` : 'VPU'
    drawLabel(
      ctx, vpuText,
      core.vpu.x + core.vpu.w / 2,
      core.vpu.y + core.vpu.h * 0.5,
      COLORS.vpu, 11,
    )
  }

  // Intra-core flow arrows (subtle, color-coded)
  ctx.globalAlpha = 0.25
  if (core.vmemToMxuPath.length >= 2) {
    drawPath(ctx, core.vmemToMxuPath, COLORS.vmem, 1, true, true)
  }
  if (core.mxuToAccPath.length >= 2) {
    drawPath(ctx, core.mxuToAccPath, COLORS.mxu, 1, true, true)
  }
  if (core.accToVpuPath.length >= 2) {
    drawPath(ctx, core.accToVpuPath, COLORS.acc, 1, true, true)
  }
  if (core.vpuToVmemPath.length >= 2) {
    drawPath(ctx, core.vpuToVmemPath, COLORS.vpu, 1, true, true)
  }
  ctx.globalAlpha = 1
}

/**
 * Render animated data flow dots based on current tour step.
 */
/**
 * Draw intra-core flow dots for ALL cores simultaneously.
 */
function drawAllCoreFlows(
  ctx: CanvasRenderingContext2D,
  cores: readonly import('./layout').CoreLayout[],
  elapsed: number,
  paths: {
    vmemToMxu?: { color: string; radius: number; count: number; offset: number }
    mxuToAcc?: { color: string; radius: number; count: number; offset: number }
    accToVpu?: { color: string; radius: number; count: number; offset: number }
    vpuToVmem?: { color: string; radius: number; count: number; offset: number }
  },
): void {
  for (const core of cores) {
    if (paths.vmemToMxu && core.vmemToMxuPath.length >= 2) {
      const p = paths.vmemToMxu
      drawFlowDots(ctx, core.vmemToMxuPath, elapsed + p.offset, p.color, p.radius, p.count)
    }
    if (paths.mxuToAcc && core.mxuToAccPath.length >= 2) {
      const p = paths.mxuToAcc
      drawFlowDots(ctx, core.mxuToAccPath, elapsed + p.offset, p.color, p.radius, p.count)
    }
    if (paths.accToVpu && core.accToVpuPath.length >= 2) {
      const p = paths.accToVpu
      drawFlowDots(ctx, core.accToVpuPath, elapsed + p.offset, p.color, p.radius, p.count)
    }
    if (paths.vpuToVmem && core.vpuToVmemPath.length >= 2) {
      const p = paths.vpuToVmem
      drawFlowDots(ctx, core.vpuToVmemPath, elapsed + p.offset, p.color, p.radius, p.count)
    }
  }
}

function renderFlows(
  ctx: CanvasRenderingContext2D,
  layout: TpuLayout,
  elapsed: number,
  _cycle: number,
  isActive: boolean,
  tourStep: number,
): void {
  // No idle animation — only animate during tour
  if (!isActive) return

  if (tourStep === 0) {
    // Overview — no flow animation, just static diagram
    return
  }

  if (tourStep === 1) {
    // MXU focus — systolic grids already animated in drawCore()
    return
  }

  if (tourStep === 2) {
    // HBM → VMEM → MXU flow (all cores)
    for (const p of layout.memToCorePaths) {
      drawFlowDots(ctx, p, elapsed * 0.4, COLORS.hbm, 5, 5)
    }
    drawAllCoreFlows(ctx, layout.cores, elapsed * 0.4, {
      vmemToMxu: { color: COLORS.vmem, radius: 4, count: 4, offset: 0.3 },
    })
    return
  }

  if (tourStep === 3) {
    // MXU → ACC → VPU → VMEM → HBM (all cores)
    drawAllCoreFlows(ctx, layout.cores, elapsed * 0.4, {
      mxuToAcc: { color: COLORS.acc, radius: 5, count: 4, offset: 0 },
      accToVpu: { color: COLORS.vpu, radius: 5, count: 4, offset: 0.2 },
      vpuToVmem: { color: COLORS.vpu, radius: 4, count: 4, offset: 0.4 },
    })
    // VMEM → HBM writeback (all cores)
    for (const p of layout.coreToMemPaths) {
      drawFlowDots(ctx, p, elapsed * 0.4 + 0.6, COLORS.vmem, 4, 3)
    }
    return
  }

  if (tourStep === 4 && layout.iciPath) {
    // HBM → ICI → neighbor chip (bidirectional)
    if (layout.memToIciPath) {
      drawFlowDots(ctx, layout.memToIciPath, elapsed * 0.4, COLORS.hbm, 4, 4)
    }
    drawFlowDots(ctx, layout.iciPath, elapsed * 0.4 + 0.3, COLORS.ici, 5, 5)
    drawFlowDots(ctx, [layout.iciPath[1], layout.iciPath[0]], elapsed * 0.4 + 0.6, COLORS.ici, 5, 5)
    return
  }

  if (tourStep === 5) {
    // Full pipeline: animate all paths on ALL cores
    const t = elapsed * 0.25

    // Host → HBM
    drawFlowDots(ctx, layout.hostToMemPath, t, COLORS.host, 3, 3)
    // HBM → VMEM (all cores)
    for (const p of layout.memToCorePaths) {
      drawFlowDots(ctx, p, t + 0.1, COLORS.hbm, 4, 4)
    }
    // Intra-core flows (all cores simultaneously)
    drawAllCoreFlows(ctx, layout.cores, t, {
      vmemToMxu: { color: COLORS.vmem, radius: 4, count: 3, offset: 0.2 },
      mxuToAcc: { color: COLORS.mxu, radius: 4, count: 3, offset: 0.3 },
      accToVpu: { color: COLORS.acc, radius: 4, count: 3, offset: 0.4 },
      vpuToVmem: { color: COLORS.vpu, radius: 3, count: 3, offset: 0.5 },
    })
    // VMEM → HBM writeback (all cores)
    for (const p of layout.coreToMemPaths) {
      drawFlowDots(ctx, p, t + 0.6, COLORS.vmem, 4, 3)
    }
    // HBM → ICI (purple HBM color for source, then yellow ICI)
    if (layout.memToIciPath) {
      drawFlowDots(ctx, layout.memToIciPath, t + 0.7, COLORS.hbm, 4, 3)
    }
    if (layout.iciPath) {
      drawFlowDots(ctx, layout.iciPath, t + 0.8, COLORS.ici, 4, 4)
      drawFlowDots(ctx, [layout.iciPath[1], layout.iciPath[0]], t + 0.9, COLORS.ici, 4, 4)
    }

    // Animate systolic grid on ALL cores
    for (const core of layout.cores) {
      for (const mxu of core.mxus) {
        drawSystolicGrid(ctx, mxu, elapsed * 0.6, COLORS.mxu)
      }
    }
  }
}
