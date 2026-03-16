/**
 * Per-generation TPU architecture configuration.
 *
 * Sources:
 * - Jouppi et al., "In-Datacenter Performance Analysis of a Tensor Processing Unit" (ISCA 2017) — TPU v1
 * - Jouppi et al., "A Domain-Specific Supercomputer for Training Deep Neural Networks" (2020) — TPU v2/v3
 * - Jouppi et al., "TPU v4: An Optically Reconfigurable Supercomputer..." (ISCA 2023) — TPU v4
 * - Google Cloud documentation for v5e, v5p, Trillium, Ironwood
 */

export interface TpuArchitecture {
  /** Generation identifier */
  id: string
  /** Display label for chip */
  chipLabel: string

  // --- MXU ---
  /** MXU dimensions (rows x cols) */
  mxuSize: [number, number]
  /** Number of MXUs per TensorCore */
  mxusPerCore: number
  /** MXU data type */
  mxuDataType: string

  // --- Cores ---
  /** Number of TensorCores per chip */
  coresPerChip: number
  /** Core branding */
  coreName: string

  // --- Memory ---
  /** Memory type label */
  memoryType: string
  /** Total memory in GB */
  memoryGb: number
  /** Number of HBM stacks to display (visual) */
  hbmStacks: number
  /** Has VMEM (on-chip SRAM) */
  hasVmem: boolean
  /** VMEM size label */
  vmemLabel: string

  // --- Compute units ---
  /** Has VPU (vector processing unit) */
  hasVpu: boolean
  /** VPU lanes (0 if no VPU) */
  vpuLanes: number
  /** Has accumulators */
  hasAccumulators: boolean
  /** Has scalar unit */
  hasScalarUnit: boolean
  /** Has SparseCore */
  hasSparseCore: boolean

  // --- Interconnect ---
  /** Has ICI (inter-chip interconnect) */
  hasIci: boolean
  /** ICI topology label */
  iciTopology: string
  /** Has OCS (Optical Circuit Switching) */
  hasOcs: boolean

  // --- Capabilities ---
  /** Supports training */
  supportsTraining: boolean
  /** Supports inference */
  supportsInference: boolean
  /** Has liquid cooling */
  hasLiquidCooling: boolean
}

const architectures: Record<string, TpuArchitecture> = {
  v1: {
    id: 'v1',
    chipLabel: 'TPU v1',
    mxuSize: [256, 256],
    mxusPerCore: 1,
    mxuDataType: 'INT8',
    coresPerChip: 1,
    coreName: 'Core',
    memoryType: 'DDR3',
    memoryGb: 8,
    hbmStacks: 0,           // No HBM — uses off-chip DDR3 DRAM
    hasVmem: false,          // Unified Buffer (24 MiB), not "VMEM"
    vmemLabel: 'Unified Buffer\n24 MiB',
    hasVpu: false,           // Activation pipeline, not a full VPU
    vpuLanes: 0,
    hasAccumulators: true,   // 4096 256-element 32-bit accumulators
    hasScalarUnit: false,    // Host-driven, no on-chip scalar unit
    hasSparseCore: false,
    hasIci: false,           // Standalone PCIe card — no chip-to-chip
    iciTopology: '',
    hasOcs: false,
    supportsTraining: false, // Inference only
    supportsInference: true,
    hasLiquidCooling: false,
  },

  v2: {
    id: 'v2',
    chipLabel: 'TPU v2',
    mxuSize: [128, 128],
    mxusPerCore: 1,
    mxuDataType: 'bfloat16',
    coresPerChip: 2,
    coreName: 'TensorCore',
    memoryType: 'HBM',
    memoryGb: 16,
    hbmStacks: 4,
    hasVmem: true,
    vmemLabel: 'VMEM\n8 MiB',
    hasVpu: true,
    vpuLanes: 128,
    hasAccumulators: true,
    hasScalarUnit: true,
    hasSparseCore: false,
    hasIci: true,
    iciTopology: '2D Torus',
    hasOcs: false,
    supportsTraining: true,
    supportsInference: true,
    hasLiquidCooling: false,
  },

  v3: {
    id: 'v3',
    chipLabel: 'TPU v3',
    mxuSize: [128, 128],
    mxusPerCore: 2,          // v3 doubled MXUs per core
    mxuDataType: 'bfloat16',
    coresPerChip: 2,
    coreName: 'TensorCore',
    memoryType: 'HBM2',
    memoryGb: 32,
    hbmStacks: 4,
    hasVmem: true,
    vmemLabel: 'VMEM\n16 MiB',
    hasVpu: true,
    vpuLanes: 128,
    hasAccumulators: true,
    hasScalarUnit: true,
    hasSparseCore: false,
    hasIci: true,
    iciTopology: '2D Torus',
    hasOcs: false,
    supportsTraining: true,
    supportsInference: true,
    hasLiquidCooling: true,
  },

  v4: {
    id: 'v4',
    chipLabel: 'TPU v4',
    mxuSize: [128, 128],
    mxusPerCore: 4,          // v4 further increased MXUs
    mxuDataType: 'bfloat16 / INT8',
    coresPerChip: 2,
    coreName: 'TensorCore',
    memoryType: 'HBM2',
    memoryGb: 32,
    hbmStacks: 4,
    hasVmem: true,
    vmemLabel: 'VMEM\n16 MiB',
    hasVpu: true,
    vpuLanes: 128,
    hasAccumulators: true,
    hasScalarUnit: true,
    hasSparseCore: true,     // SparseCore introduced in v4
    hasIci: true,
    iciTopology: '3D Torus',
    hasOcs: true,            // Optical Circuit Switching
    supportsTraining: true,
    supportsInference: true,
    hasLiquidCooling: true,
  },

  v5e: {
    id: 'v5e',
    chipLabel: 'TPU v5e',
    mxuSize: [128, 128],
    mxusPerCore: 1,
    mxuDataType: 'bfloat16 / INT8',
    coresPerChip: 1,         // MegaCore — single unified core
    coreName: 'MegaCore',
    memoryType: 'HBM2e',
    memoryGb: 16,
    hbmStacks: 4,
    hasVmem: true,
    vmemLabel: 'VMEM\n16 MiB',
    hasVpu: true,
    vpuLanes: 128,
    hasAccumulators: true,
    hasScalarUnit: true,
    hasSparseCore: false,    // Cost-optimized, no SparseCore
    hasIci: true,
    iciTopology: '2D Torus',
    hasOcs: false,
    supportsTraining: true,
    supportsInference: true,
    hasLiquidCooling: true,
  },

  v5p: {
    id: 'v5p',
    chipLabel: 'TPU v5p',
    mxuSize: [128, 128],
    mxusPerCore: 4,
    mxuDataType: 'bfloat16 / INT8 / FP8',
    coresPerChip: 2,
    coreName: 'TensorCore',
    memoryType: 'HBM2e',
    memoryGb: 95,
    hbmStacks: 8,
    hasVmem: true,
    vmemLabel: 'VMEM\n32 MiB',
    hasVpu: true,
    vpuLanes: 128,
    hasAccumulators: true,
    hasScalarUnit: true,
    hasSparseCore: true,
    hasIci: true,
    iciTopology: '3D Torus',
    hasOcs: false,
    supportsTraining: true,
    supportsInference: true,
    hasLiquidCooling: true,
  },

  trillium: {
    id: 'trillium',
    chipLabel: 'Trillium (v6e)',
    mxuSize: [128, 128],
    mxusPerCore: 4,
    mxuDataType: 'bfloat16 / FP8 / INT8',
    coresPerChip: 2,
    coreName: 'TensorCore',
    memoryType: 'HBM2e',
    memoryGb: 32,
    hbmStacks: 4,
    hasVmem: true,
    vmemLabel: 'VMEM\n32 MiB',
    hasVpu: true,
    vpuLanes: 128,
    hasAccumulators: true,
    hasScalarUnit: true,
    hasSparseCore: true,
    hasIci: true,
    iciTopology: '3D Torus',
    hasOcs: true,
    supportsTraining: true,
    supportsInference: true,
    hasLiquidCooling: true,
  },

  ironwood: {
    id: 'ironwood',
    chipLabel: 'Ironwood',
    mxuSize: [128, 128],
    mxusPerCore: 4,
    mxuDataType: 'bfloat16 / FP8 / INT8 / MXF4',
    coresPerChip: 2,
    coreName: 'TensorCore',
    memoryType: 'HBM3e',
    memoryGb: 192,
    hbmStacks: 12,
    hasVmem: true,
    vmemLabel: 'VMEM\n64 MiB',
    hasVpu: true,
    vpuLanes: 128,
    hasAccumulators: true,
    hasScalarUnit: true,
    hasSparseCore: true,
    hasIci: true,
    iciTopology: '3D Torus',
    hasOcs: true,
    supportsTraining: true,
    supportsInference: true,
    hasLiquidCooling: true,
  },
}

/** Default fallback architecture (v5e-like) */
const defaultArch = architectures.v5e

export function getArchitecture(generationId: string): TpuArchitecture {
  return architectures[generationId] ?? defaultArch
}
