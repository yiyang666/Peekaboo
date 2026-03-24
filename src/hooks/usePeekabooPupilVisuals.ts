import {
  useEffect,
  useLayoutEffect,
  useRef,
  type RefObject,
} from 'react'
import type { InteractionState } from '../types/interaction'

const PUPIL_IDS = [
  'peekaboo-pupil-purple-L',
  'peekaboo-pupil-purple-R',
  'peekaboo-pupil-black-L',
  'peekaboo-pupil-black-R',
  'peekaboo-pupil-orange-L',
  'peekaboo-pupil-orange-R',
  'peekaboo-pupil-yellow-L',
  'peekaboo-pupil-yellow-R',
] as const

const R = 5
/** 密码注视点相对输入框中心下移，贴近「右下方偷瞄」 */
const PASSWORD_TARGET_OFFSET_Y = 14
/** 明文时眼珠看向画外左侧的屏幕 X 偏移（相对 SVG 左缘再向左） */
const LOOK_LEFT_OFFSET_X = 140

function resetPupilTransforms() {
  for (const id of PUPIL_IDS) {
    document.getElementById(id)?.removeAttribute('transform')
  }
}

function applyPupilsTowardPoint(targetX: number, targetY: number) {
  for (const id of PUPIL_IDS) {
    const el = document.getElementById(id)
    if (!el) continue
    const rect = el.getBoundingClientRect()
    const eyeCenterX = rect.left + rect.width / 2
    const eyeCenterY = rect.top + rect.height / 2
    const angle = Math.atan2(
      targetY - eyeCenterY,
      targetX - eyeCenterX,
    )
    const tx = Math.cos(angle) * R
    const ty = Math.sin(angle) * R
    el.setAttribute('transform', `translate(${tx}, ${ty})`)
  }
}

export function usePeekabooPupilVisuals(
  interactionState: InteractionState,
  emailRef: RefObject<HTMLInputElement | null>,
  passwordRef: RefObject<HTMLInputElement | null>,
): void {
  const interactionStateRef = useRef(interactionState)

  useEffect(() => {
    interactionStateRef.current = interactionState
  }, [interactionState])

  useLayoutEffect(() => {
    if (interactionState === 'PASSWORD_VISIBLE') {
      const update = () => {
        if (interactionStateRef.current !== 'PASSWORD_VISIBLE') return
        const svg = document.getElementById('peekaboo-stage-svg')
        if (!svg) return
        const br = svg.getBoundingClientRect()
        const targetX = br.left - LOOK_LEFT_OFFSET_X
        const targetY = br.top + br.height * 0.42
        applyPupilsTowardPoint(targetX, targetY)
      }
      update()
      window.addEventListener('resize', update)
      window.addEventListener('scroll', update, true)
      return () => {
        window.removeEventListener('resize', update)
        window.removeEventListener('scroll', update, true)
      }
    }

    if (interactionState === 'IDLE') {
      resetPupilTransforms()
      return
    }

    if (interactionState === 'EMAIL_FOCUS') {
      const update = () => {
        if (interactionStateRef.current !== 'EMAIL_FOCUS') return
        const el = emailRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        applyPupilsTowardPoint(
          r.left + r.width / 2,
          r.top + r.height / 2,
        )
      }
      update()
      window.addEventListener('resize', update)
      window.addEventListener('scroll', update, true)
      return () => {
        window.removeEventListener('resize', update)
        window.removeEventListener('scroll', update, true)
      }
    }

    if (interactionState === 'PASSWORD_FOCUS') {
      const update = () => {
        if (interactionStateRef.current !== 'PASSWORD_FOCUS') return
        const el = passwordRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        applyPupilsTowardPoint(
          r.left + r.width / 2,
          r.top + r.height / 2 + PASSWORD_TARGET_OFFSET_Y,
        )
      }
      update()
      window.addEventListener('resize', update)
      window.addEventListener('scroll', update, true)
      return () => {
        window.removeEventListener('resize', update)
        window.removeEventListener('scroll', update, true)
      }
    }
  }, [interactionState, emailRef, passwordRef])

  useEffect(() => {
    let rafId: number | null = null
    let mouseX = 0
    let mouseY = 0

    function applyMouseFollow() {
      for (const id of PUPIL_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const eyeCenterX = rect.left + rect.width / 2
        const eyeCenterY = rect.top + rect.height / 2
        const angle = Math.atan2(
          mouseY - eyeCenterY,
          mouseX - eyeCenterX,
        )
        const tx = Math.cos(angle) * R
        const ty = Math.sin(angle) * R
        el.setAttribute('transform', `translate(${tx}, ${ty})`)
      }
    }

    function onMouseMove(e: MouseEvent) {
      if (interactionStateRef.current !== 'IDLE') return
      mouseX = e.clientX
      mouseY = e.clientY
      if (rafId != null) return
      rafId = requestAnimationFrame(() => {
        rafId = null
        if (interactionStateRef.current !== 'IDLE') return
        applyMouseFollow()
      })
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (rafId != null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }
  }, [])
}
