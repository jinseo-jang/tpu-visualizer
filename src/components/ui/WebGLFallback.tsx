export default function WebGLFallback({ label }: { label?: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 flex items-center justify-center h-full">
      <div className="text-center text-gray-500">
        <p className="text-lg mb-2">WebGL not supported</p>
        {label && <p className="text-sm">{label}</p>}
      </div>
    </div>
  )
}
