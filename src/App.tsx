import { useState, useEffect, useCallback, useRef } from 'react'

function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isBlinking, setIsBlinking] = useState(false)
  const characterRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // 随机眨眼
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 200)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(blinkInterval)
  }, [])

  // 计算眼睛位置
  const getEyePosition = (eyeCenterX: number, eyeCenterY: number) => {
    if (!characterRef.current) return { x: 0, y: 0 }
    const rect = characterRef.current.getBoundingClientRect()
    const absEyeX = rect.left + eyeCenterX
    const absEyeY = rect.top + eyeCenterY

    const dx = mousePos.x - absEyeX
    const dy = mousePos.y - absEyeY
    const distance = Math.sqrt(dx * dx + dy * dy)
    const maxDistance = 6

    const ratio = Math.min(distance, maxDistance) / (distance || 1)
    return {
      x: dx * ratio,
      y: dy * ratio,
    }
  }

  const leftEyePos = getEyePosition(148, 155)
  const rightEyePos = getEyePosition(212, 155)

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-100 to-green-100 flex flex-col items-center justify-center overflow-hidden relative">
      {/* 背景装饰 - 云朵 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
        {/* 铜锣烧装饰 */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="dorayaki-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
              fontSize: `${20 + Math.random() * 16}px`,
            }}
          >
            🥞
          </div>
        ))}
      </div>

      {/* 标题 */}
      <h1 className="text-3xl md:text-5xl font-bold text-blue-600 mb-6 z-10 text-center drop-shadow-lg animate-bounce-slow">
        🔔 我是哆啦A梦！
      </h1>

      {/* 哆啦A梦 - 保持不动 */}
      <div
        ref={characterRef}
        className="relative z-10"
      >
        <div className="relative w-[360px] h-[520px]">

          {/* ====== 头部 ====== */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[280px]">
            {/* 蓝色头部外圈 */}
            <div className="absolute inset-0 w-[300px] h-[280px] bg-[#0098d8] rounded-[50%] shadow-xl border-[3px] border-[#006fa3]" />

            {/* 白色脸部区域 */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[60px] w-[250px] h-[210px] bg-white rounded-[50%] border-[2px] border-gray-200" />

            {/* 左眼 */}
            <div
              className={`absolute left-[108px] top-[55px] w-[42px] h-[50px] bg-white rounded-full border-[2px] border-gray-700 overflow-hidden z-10 ${
                isBlinking ? 'h-[3px] top-[78px] rounded-none' : ''
              }`}
              style={{ transition: 'all 0.1s ease' }}
            >
              {!isBlinking && (
                <div
                  className="absolute w-[18px] h-[20px] bg-black rounded-full"
                  style={{
                    left: `${12 + leftEyePos.x}px`,
                    top: `${16 + leftEyePos.y}px`,
                    transition: 'left 0.08s ease, top 0.08s ease',
                  }}
                >
                  <div className="absolute w-[6px] h-[6px] bg-white rounded-full top-[2px] left-[2px]" />
                </div>
              )}
            </div>

            {/* 右眼 */}
            <div
              className={`absolute right-[108px] top-[55px] w-[42px] h-[50px] bg-white rounded-full border-[2px] border-gray-700 overflow-hidden z-10 ${
                isBlinking ? 'h-[3px] top-[78px] rounded-none' : ''
              }`}
              style={{ transition: 'all 0.1s ease' }}
            >
              {!isBlinking && (
                <div
                  className="absolute w-[18px] h-[20px] bg-black rounded-full"
                  style={{
                    left: `${12 + rightEyePos.x}px`,
                    top: `${16 + rightEyePos.y}px`,
                    transition: 'left 0.08s ease, top 0.08s ease',
                  }}
                >
                  <div className="absolute w-[6px] h-[6px] bg-white rounded-full top-[2px] left-[2px]" />
                </div>
              )}
            </div>

            {/* 红色鼻子 */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[110px] w-[28px] h-[28px] bg-[#e60012] rounded-full shadow-md z-20 border-[2px] border-[#b3000e]">
              <div className="absolute top-[4px] left-[5px] w-[8px] h-[8px] bg-white/40 rounded-full" />
            </div>

            {/* 鼻子下面的竖线 */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[138px] w-[2px] h-[35px] bg-gray-700 z-10" />

            {/* 嘴巴 - 固定微笑 */}
            <div className="absolute left-1/2 -translate-x-1/2 top-[160px] z-10">
              <svg width="100" height="45" viewBox="0 0 100 45">
                <path
                  d="M 10 5 Q 50 50 90 5"
                  fill="none"
                  stroke="#333"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* 胡须 - 左 */}
            <div className="absolute left-[8px] top-[115px] z-10">
              <div className="w-[55px] h-[2px] bg-gray-700 mb-[8px] transform rotate-[-10deg]" />
              <div className="w-[55px] h-[2px] bg-gray-700 mb-[8px] transform rotate-[0deg]" />
              <div className="w-[55px] h-[2px] bg-gray-700 transform rotate-[10deg]" />
            </div>
            {/* 胡须 - 右 */}
            <div className="absolute right-[8px] top-[115px] z-10">
              <div className="w-[55px] h-[2px] bg-gray-700 mb-[8px] transform rotate-[10deg]" />
              <div className="w-[55px] h-[2px] bg-gray-700 mb-[8px] transform rotate-[0deg]" />
              <div className="w-[55px] h-[2px] bg-gray-700 transform rotate-[-10deg]" />
            </div>
          </div>

          {/* ====== 红色领结 ====== */}
          <div className="absolute top-[265px] left-1/2 -translate-x-1/2 z-20">
            <div className="relative">
              {/* 左蝴蝶结 */}
              <div className="absolute -left-[30px] top-[-8px] w-[35px] h-[22px] bg-[#e60012] rounded-[50%] border-[1.5px] border-[#b3000e] transform rotate-[-10deg]" />
              {/* 右蝴蝶结 */}
              <div className="absolute -right-[30px] top-[-8px] w-[35px] h-[22px] bg-[#e60012] rounded-[50%] border-[1.5px] border-[#b3000e] transform rotate-[10deg]" />
              {/* 中间结 */}
              <div className="w-[16px] h-[16px] bg-[#e60012] rounded-full border-[1.5px] border-[#b3000e] mx-auto relative z-10" />
            </div>
          </div>

          {/* ====== 黄色铃铛 ====== */}
          <div className="absolute top-[280px] left-1/2 -translate-x-1/2 z-20">
            <div className="w-[30px] h-[30px] bg-[#ffd700] rounded-full border-[2px] border-[#c7a600] shadow-md flex items-center justify-center">
              <div className="w-[20px] h-[2px] bg-[#c7a600] mt-[6px]" />
              <div className="absolute bottom-[5px] w-[6px] h-[6px] bg-[#c7a600] rounded-full" />
            </div>
          </div>

          {/* ====== 蓝色身体 ====== */}
          <div className="absolute top-[295px] left-1/2 -translate-x-1/2 w-[220px] h-[160px] bg-[#0098d8] rounded-b-[50%] rounded-t-[10px] shadow-lg border-[3px] border-[#006fa3]">
            {/* 白色肚子 */}
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[160px] h-[130px] bg-white rounded-[50%] border-[2px] border-gray-200" />

            {/* 四次元口袋 */}
            <div className="absolute top-[55px] left-1/2 -translate-x-1/2 w-[90px] h-[50px] bg-white rounded-b-[50%] border-[2.5px] border-gray-600 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-gray-600" />
            </div>
          </div>

          {/* ====== 左手 - 固定 ====== */}
          <div
            className="absolute top-[320px] left-[30px] z-10"
            style={{ transformOrigin: 'top right' }}
          >
            {/* 手臂 */}
            <div className="w-[20px] h-[50px] bg-[#0098d8] rounded-[10px] border-[2px] border-[#006fa3] transform rotate-[30deg]" />
            {/* 圆手 */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border-[2px] border-gray-300 shadow-md -mt-[2px] ml-[-10px]" />
          </div>

          {/* ====== 右手 - 固定 ====== */}
          <div
            className="absolute top-[320px] right-[30px] z-10"
            style={{ transformOrigin: 'top left' }}
          >
            {/* 手臂 */}
            <div className="w-[20px] h-[50px] bg-[#0098d8] rounded-[10px] border-[2px] border-[#006fa3] transform rotate-[-30deg] ml-auto" />
            {/* 圆手 */}
            <div className="w-[38px] h-[38px] bg-white rounded-full border-[2px] border-gray-300 shadow-md -mt-[2px] ml-[2px]" />
          </div>

          {/* ====== 脚 ====== */}
          {/* 左脚 */}
          <div className="absolute bottom-[5px] left-[80px]">
            <div className="w-[70px] h-[32px] bg-white rounded-[50%] border-[2px] border-gray-300 shadow-md" />
          </div>
          {/* 右脚 */}
          <div className="absolute bottom-[5px] right-[80px]">
            <div className="w-[70px] h-[32px] bg-white rounded-[50%] border-[2px] border-gray-300 shadow-md" />
          </div>

        </div>
      </div>

      {/* 提示文字 */}
      <p className="mt-4 text-lg text-blue-600 z-10 animate-pulse font-medium">
        ✨ 移动鼠标看看我的眼睛吧！
      </p>
      <p className="mt-2 text-sm text-blue-400 z-10">
        从未来来的猫型机器人 🐱
      </p>

      {/* 地面阴影 */}
      <div className="absolute bottom-16 w-[220px] h-[16px] bg-black/10 rounded-full blur-md z-0" />
    </div>
  )
}

export default App
