import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export default function SystolicArrayDemo() {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [step, setStep] = useState(0)
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false)

  // 3x3 Grid of Processing Elements (PE)
  // Matrix A (3x3) flowing from left, Matrix B (3x3) flowing from top.
  // We'll simulate 5 distinct steps.
  
  const matrixA = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]
  const matrixB = [
    [2, 0, 1],
    [1, 1, 0],
    [0, 2, 1]
  ]

  // Flattened for easy rendering state per step
  // In a real systolic array, data flows diagonally.
  // Step 0: all 0
  // Step 1..5: accumulation
  
  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setStep(s => {
        if (s >= 8) {
          setIsPlaying(false)
          return 8
        }
        return s + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying])

  const reset = () => {
    setIsPlaying(false)
    setStep(0)
  }

  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {t('sections.systolic.title', '시스톨릭 어레이: 데이터 컨베이어 벨트')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('sections.systolic.desc', '기존 CPU가 메모리에서 매번 값을 꺼내와 곱셈을 하는 것과 달리, TPU의 시스톨릭 어레이는 데이터를 유기적으로 흐르게 하여 연산 효율을 극대화합니다.')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center justify-center">
          <div className="relative bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow-inner flex flex-col items-center">
            
            {/* Visual Grid representing Processing Elements */}
            <div className="grid grid-cols-3 gap-2 relative">
              {[0, 1, 2].map(row => (
                [0, 1, 2].map(col => {
                  // Compute value based on step
                  // Very simplified simulation of wavefront
                  let val = 0;
                  const flow = step - (row + col);
                  if (flow >= 1) val += matrixA[row][0] * matrixB[0][col];
                  if (flow >= 2) val += matrixA[row][1] * matrixB[1][col];
                  if (flow >= 3) val += matrixA[row][2] * matrixB[2][col];

                  const isActive = step > 0 && step <= 8 && (row + col <= step - 1) && (row + col >= step - 3);

                  return (
                    <motion.div
                      key={`pe-${row}-${col}`}
                      className={`w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg border-2 text-xl font-mono font-bold transition-colors
                        ${isActive ? 'bg-blue-500 border-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white border-gray-300 text-gray-800'}`}
                      animate={{
                        scale: isActive ? [1, 1.1, 1] : 1
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {val}
                    </motion.div>
                  )
                })
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button 
                onClick={() => {
                  if (step >= 8) reset();
                  setIsPlaying(!isPlaying);
                }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-md"
              >
                {isPlaying ? t('common.pause', '일시정지') : (step >= 8 ? t('common.restart', '다시 시작') : t('common.play', '연산 시작'))}
              </button>
              <button 
                onClick={reset}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-full transition-colors"
              >
                {t('common.reset', '초기화')}
              </button>
            </div>
            
            <div className="mt-6 text-sm text-gray-500 font-mono">
              Step: {step} / 8
            </div>
          </div>
          
          <div className="max-w-sm text-gray-600 space-y-6 text-left">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">1</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">{t('sections.systolic.step1Title', '가중치 고정 (Weight Stationary)')}</h4>
                <p className="text-sm leading-relaxed">{t('sections.systolic.step1', '학습된 AI 모델의 가중치(Weight) 파라미터가 각각의 연산 격자(Processing Elements) 내부에 고정되어 대기합니다.')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">2</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">{t('sections.systolic.step2Title', '파도 같은 흐름 (Wavefront)')}</h4>
                <p className="text-sm leading-relaxed">{t('sections.systolic.step2', '입력 데이터가 메모리에서 한 번 꺼내진 후, 격자의 왼쪽에서 오른쪽으로, 위에서 아래로 물결(Wavefront)처럼 끊임없이 흘러들어갑니다.')}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold shrink-0">3</div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">{t('sections.systolic.step3Title', '숫자의 의미: 부분합 누적 (MAC)')}</h4>
                <p className="text-sm leading-relaxed">
                  {t('sections.systolic.step3', '격자 안에서 변하는 숫자는 누적 부분합(Partial Sum)입니다! 각 블록은 지나가는 입력값과 자신의 가중치를 곱하고(Multiply), 이전 블록에서 넘겨받은 숫자에 그 곱셈 결과를 즉시 더해(Accumulate) 자신의 숫자를 업데이트합니다. 이렇게 쉴새없이 계산과 전달을 반복하여 최종 행렬 연산을 완성합니다.')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Section */}
        <div className="mt-16 bg-blue-50/50 rounded-2xl border border-blue-100/50 overflow-hidden shadow-sm">
          <button
            onClick={() => setIsDeepDiveOpen(!isDeepDiveOpen)}
            className="w-full px-8 py-6 flex items-start sm:items-center justify-between text-left hover:bg-blue-50/80 transition-colors"
          >
            <div className="pr-6">
              <h3 className="text-xl font-bold text-blue-900 leading-snug">
                {t('sections.systolic.deepDiveTitle')}
              </h3>
              <p className="text-blue-700/80 mt-2 text-sm max-w-3xl leading-relaxed font-medium">
                {t('sections.systolic.deepDiveIntro')}
              </p>
            </div>
            <div className={`mt-2 sm:mt-0 shrink-0 p-2.5 rounded-full bg-blue-100/70 text-blue-600 transition-transform duration-300 ${isDeepDiveOpen ? 'rotate-180' : ''}`}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
          
          <AnimatePresence>
            {isDeepDiveOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-8 pb-8 pt-2">
                  <div className="h-px w-full bg-blue-100/60 mb-6"></div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0 text-sm">
                            {i + 1}
                          </div>
                          <h4 className="font-bold text-gray-900 leading-tight">
                            {t(`sections.systolic.deepDivePoints.${i}.title`)}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed pl-11">
                          {t(`sections.systolic.deepDivePoints.${i}.desc`)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  )
}
