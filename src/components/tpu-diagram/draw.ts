import { type Rect } from './layout'
import { withAlpha } from './colors'

/**
 * Draw a rounded rectangle with fill and optional border.
 */
export function drawBox(
  ctx: CanvasRenderingContext2D,
  rect: Rect,
  fill: string,
  borderColor?: string,
  borderWidth?: number,
  radius?: number,
): void {
  const r = Math.min(radius ?? 6, rect.w / 2, rect.h / 2)
  const { x, y, w, h } = rect

  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()

  ctx.fillStyle = fill
  ctx.fill()

  if (borderColor) {
    ctx.strokeStyle = borderColor
    ctx.lineWidth = borderWidth ?? 1.5
    ctx.stroke()
  }
}

/**
 * Draw text. Supports \n for multiline.
 */
export function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  color: string,
  fontSize?: number,
  align?: CanvasTextAlign,
  fontWeight?: string,
): void {
  const size = fontSize ?? 13
  const weight = fontWeight ?? '600'
  ctx.font = `${weight} ${size}px "Google Sans", "Inter", system-ui, sans-serif`
  ctx.fillStyle = color
  ctx.textAlign = align ?? 'center'
  ctx.textBaseline = 'middle'

  const lines = text.split('\n')
  const lineHeight = size * 1.3
  const startY = y - ((lines.length - 1) * lineHeight) / 2
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, startY + i * lineHeight)
  }
}

/**
 * Compute total length of a polyline path.
 */
function pathLength(path: [number, number][]): number {
  let total = 0
  for (let i = 1; i < path.length; i++) {
    const dx = path[i][0] - path[i - 1][0]
    const dy = path[i][1] - path[i - 1][1]
    total += Math.sqrt(dx * dx + dy * dy)
  }
  return total
}

/**
 * Interpolate a position along a polyline path at parameter t (0..1).
 */
function interpolatePath(path: [number, number][], t: number): [number, number] {
  if (path.length < 2) return path[0]

  const segLens: number[] = []
  let totalLen = 0
  for (let i = 1; i < path.length; i++) {
    const dx = path[i][0] - path[i - 1][0]
    const dy = path[i][1] - path[i - 1][1]
    const len = Math.sqrt(dx * dx + dy * dy)
    segLens.push(len)
    totalLen += len
  }

  if (totalLen === 0) return path[0]

  const targetDist = t * totalLen
  let accumulated = 0
  for (let i = 0; i < segLens.length; i++) {
    if (accumulated + segLens[i] >= targetDist) {
      const segT = segLens[i] > 0 ? (targetDist - accumulated) / segLens[i] : 0
      return [
        path[i][0] + (path[i + 1][0] - path[i][0]) * segT,
        path[i][1] + (path[i + 1][1] - path[i][1]) * segT,
      ]
    }
    accumulated += segLens[i]
  }

  return path[path.length - 1]
}

/**
 * Draw a polyline path (dashed or solid) with optional arrowhead.
 */
export function drawPath(
  ctx: CanvasRenderingContext2D,
  path: [number, number][],
  color: string,
  lineWidth?: number,
  dashed?: boolean,
  arrowHead?: boolean,
): void {
  if (path.length < 2) return
  const lw = lineWidth ?? 1.5

  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = lw
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  if (dashed) ctx.setLineDash([5, 4])

  ctx.beginPath()
  ctx.moveTo(path[0][0], path[0][1])
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i][0], path[i][1])
  }
  ctx.stroke()

  if (arrowHead && path.length >= 2) {
    const last = path[path.length - 1]
    const prev = path[path.length - 2]
    const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0])
    const headLen = lw * 4

    ctx.setLineDash([])
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(last[0], last[1])
    ctx.lineTo(
      last[0] - headLen * Math.cos(angle - Math.PI / 6),
      last[1] - headLen * Math.sin(angle - Math.PI / 6),
    )
    ctx.lineTo(
      last[0] - headLen * Math.cos(angle + Math.PI / 6),
      last[1] - headLen * Math.sin(angle + Math.PI / 6),
    )
    ctx.closePath()
    ctx.fill()
  }

  ctx.restore()
}

/**
 * Draw an arrow from point A to point B with an arrowhead.
 */
export function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  to: [number, number],
  color: string,
  lineWidth?: number,
  dashed?: boolean,
): void {
  drawPath(ctx, [from, to], color, lineWidth, dashed, true)
}

/**
 * Draw animated flow dots along a polyline path.
 * Uses smooth spacing and fade at endpoints.
 */
export function drawFlowDots(
  ctx: CanvasRenderingContext2D,
  path: [number, number][],
  time: number,
  color: string,
  dotRadius?: number,
  dotCount?: number,
): void {
  if (path.length < 2) return
  const totalLen = pathLength(path)
  if (totalLen < 5) return  // too short to animate

  const count = dotCount ?? 4
  const r = dotRadius ?? 4

  ctx.save()
  for (let i = 0; i < count; i++) {
    const t = ((time + i / count) % 1 + 1) % 1
    const pos = interpolatePath(path, t)

    // Fade dots near endpoints for smooth appearance/disappearance
    const edgeFade = Math.min(t * 4, (1 - t) * 4, 1)

    ctx.beginPath()
    ctx.arc(pos[0], pos[1], r, 0, Math.PI * 2)
    ctx.fillStyle = withAlpha(color, edgeFade * 0.9)
    ctx.fill()
  }
  ctx.restore()
}

/**
 * Draw a simplified systolic array grid with diagonal wavefront animation.
 */
export function drawSystolicGrid(
  ctx: CanvasRenderingContext2D,
  rect: Rect,
  time: number,
  activeColor: string,
  gridSize?: number,
): void {
  const gs = gridSize ?? 8
  const cellW = rect.w / gs
  const cellH = rect.h / gs
  const padFrac = 0.1
  const padX = cellW * padFrac
  const padY = cellH * padFrac

  for (let row = 0; row < gs; row++) {
    for (let col = 0; col < gs; col++) {
      const cx = rect.x + col * cellW + padX
      const cy = rect.y + row * cellH + padY
      const cw = cellW - padX * 2
      const ch = cellH - padY * 2

      // Diagonal wavefront
      const diag = (row + col) / (gs * 2 - 2)
      const wave = ((time % 1) + 1) % 1
      const dist = Math.abs(diag - wave)
      const isActive = dist < 0.15 || dist > 0.85

      const alpha = isActive ? 0.85 : 0.12
      ctx.fillStyle = withAlpha(activeColor, alpha)
      ctx.fillRect(cx, cy, cw, ch)

      ctx.strokeStyle = withAlpha(activeColor, 0.25)
      ctx.lineWidth = 0.5
      ctx.strokeRect(cx, cy, cw, ch)
    }
  }
}

/**
 * Draw HBM/DDR memory layers as stacked horizontal bars.
 */
export function drawHbmLayers(
  ctx: CanvasRenderingContext2D,
  rect: Rect,
  color: string,
  layerCount?: number,
): void {
  const layers = layerCount ?? 6
  const gap = Math.max(rect.h * 0.015, 2)
  const outerPad = gap * 1.5
  const layerH = (rect.h - outerPad * 2 - gap * (layers - 1)) / layers

  for (let i = 0; i < layers; i++) {
    const ly = rect.y + outerPad + i * (layerH + gap)
    const alpha = 0.35 + (i / layers) * 0.55

    ctx.fillStyle = withAlpha(color, alpha)
    const r = Math.min(3, layerH / 2)
    const lx = rect.x + outerPad
    const lw = rect.w - outerPad * 2

    ctx.beginPath()
    ctx.moveTo(lx + r, ly)
    ctx.lineTo(lx + lw - r, ly)
    ctx.quadraticCurveTo(lx + lw, ly, lx + lw, ly + r)
    ctx.lineTo(lx + lw, ly + layerH - r)
    ctx.quadraticCurveTo(lx + lw, ly + layerH, lx + lw - r, ly + layerH)
    ctx.lineTo(lx + r, ly + layerH)
    ctx.quadraticCurveTo(lx, ly + layerH, lx, ly + layerH - r)
    ctx.lineTo(lx, ly + r)
    ctx.quadraticCurveTo(lx, ly, lx + r, ly)
    ctx.closePath()
    ctx.fill()
  }
}

/**
 * Draw a curved path between two points with a quadratic bezier.
 */
export function drawCurvedPath(
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  to: [number, number],
  controlOffset: number,
  color: string,
  lineWidth?: number,
  dashed?: boolean,
): void {
  const midX = (from[0] + to[0]) / 2
  const midY = (from[1] + to[1]) / 2

  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const len = Math.sqrt(dx * dx + dy * dy) || 1
  const nx = -dy / len
  const ny = dx / len

  const cpx = midX + nx * controlOffset
  const cpy = midY + ny * controlOffset

  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth ?? 2
  ctx.lineCap = 'round'

  if (dashed) ctx.setLineDash([8, 5])

  ctx.beginPath()
  ctx.moveTo(from[0], from[1])
  ctx.quadraticCurveTo(cpx, cpy, to[0], to[1])
  ctx.stroke()

  ctx.restore()
}

/**
 * Draw a badge-style label (text with background pill).
 */
export function drawBadge(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  bgColor: string,
  textColor: string,
  fontSize?: number,
): void {
  const size = fontSize ?? 9
  ctx.font = `500 ${size}px "Google Sans", system-ui, sans-serif`
  const metrics = ctx.measureText(text)
  const pw = metrics.width + size * 1.2
  const ph = size * 1.6
  const px = x - pw / 2
  const py = y - ph / 2

  drawBox(ctx, { x: px, y: py, w: pw, h: ph }, bgColor, undefined, undefined, ph / 2)
  ctx.fillStyle = textColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
}
