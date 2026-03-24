import { useEffect, useMemo, useRef, type RefObject } from 'react'
import type { InteractionState } from '../types/interaction'

const EYES = [
  {
    eyeGroupId: 'peekaboo-eye-purple-L',
    pupilId: 'peekaboo-pupil-purple-L',
    parallax: 0.03,
  },
  {
    eyeGroupId: 'peekaboo-eye-purple-R',
    pupilId: 'peekaboo-pupil-purple-R',
    parallax: 0.03,
  },
  {
    eyeGroupId: 'peekaboo-eye-black-L',
    pupilId: 'peekaboo-pupil-black-L',
    parallax: 0.038,
  },
  {
    eyeGroupId: 'peekaboo-eye-black-R',
    pupilId: 'peekaboo-pupil-black-R',
    parallax: 0.038,
  },
  {
    eyeGroupId: 'peekaboo-eye-orange-L',
    pupilId: 'peekaboo-pupil-orange-L',
    parallax: 0.05,
  },
  {
    eyeGroupId: 'peekaboo-eye-orange-R',
    pupilId: 'peekaboo-pupil-orange-R',
    parallax: 0.05,
  },
  {
    eyeGroupId: 'peekaboo-eye-yellow-L',
    pupilId: 'peekaboo-pupil-yellow-L',
    parallax: 0.044,
  },
  {
    eyeGroupId: 'peekaboo-eye-yellow-R',
    pupilId: 'peekaboo-pupil-yellow-R',
    parallax: 0.044,
  },
] as const

type EyeBinding = (typeof EYES)[number]
export type EyeGroupId = EyeBinding['eyeGroupId']
export type PupilId = EyeBinding['pupilId']

type EyeRefs = {
  eyeGroupRefs: Record<EyeGroupId, (node: SVGGElement | null) => void>
  pupilRefs: Record<PupilId, (node: SVGGraphicsElement | null) => void>
}

const INNER_MAX = 5
const OUTER_MAX = 2.6
const SMOOTHING = 0.18
const YELLOW_MOUTH_ID = 'peekaboo-mouth-yellow'
/** 密码注视点相对输入框中心下移，贴近「右下方偷瞄」 */
const PASSWORD_TARGET_OFFSET_Y = 14
/** 明文时眼珠看向画外左侧的屏幕 X 偏移（相对 SVG 左缘再向左） */
const LOOK_LEFT_OFFSET_X = 190
/** 明文回避时，放宽眼球/眼组位移限幅，避免普通状态限幅导致体感不明显 */
const PASSWORD_VISIBLE_INNER_MAX = 7.2
const PASSWORD_VISIBLE_OUTER_MAX = 3.8

function lerp(current: number, target: number, alpha: number): number {
  return current + (target - current) * alpha
}

function clampVector(x: number, y: number, max: number) {
  const distance = Math.hypot(x, y)
  if (distance <= max || distance === 0) {
    return { x, y }
  }
  const ratio = max / distance
  return { x: x * ratio, y: y * ratio }
}

function composeTransform(base: string, tx: number, ty: number): string {
  const translate = `translate(${tx.toFixed(3)}, ${ty.toFixed(3)})`
  return base ? `${base} ${translate}` : translate
}

export function usePeekabooPupilVisuals(
  interactionState: InteractionState,
  emailRef: RefObject<HTMLInputElement | null>,
  passwordRef: RefObject<HTMLInputElement | null>,
): EyeRefs {
  const interactionStateRef = useRef(interactionState)
  const eyeGroupElsRef = useRef<Record<EyeGroupId, SVGGElement | null>>(
    {} as Record<EyeGroupId, SVGGElement | null>,
  )
  const pupilElsRef = useRef<Record<PupilId, SVGGraphicsElement | null>>(
    {} as Record<PupilId, SVGGraphicsElement | null>,
  )
  const baseGroupTransformRef = useRef<Record<EyeGroupId, string>>(
    {} as Record<EyeGroupId, string>,
  )
  const motionRef = useRef(
    EYES.reduce(
      (acc, eye) => {
        acc[eye.pupilId] = {
          targetInnerX: 0,
          targetInnerY: 0,
          currentInnerX: 0,
          currentInnerY: 0,
          targetOuterX: 0,
          targetOuterY: 0,
          currentOuterX: 0,
          currentOuterY: 0,
        }
        return acc
      },
      {} as Record<
        PupilId,
        {
          targetInnerX: number
          targetInnerY: number
          currentInnerX: number
          currentInnerY: number
          targetOuterX: number
          targetOuterY: number
          currentOuterX: number
          currentOuterY: number
        }
      >,
    ),
  )
  const lastMouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const activeTargetRef = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    interactionStateRef.current = interactionState
  }, [interactionState])

  const eyeGroupRefs = useMemo(
    () =>
      EYES.reduce(
        (acc, eye) => {
          acc[eye.eyeGroupId] = (node) => {
            eyeGroupElsRef.current[eye.eyeGroupId] = node
            if (!node) {
              delete baseGroupTransformRef.current[eye.eyeGroupId]
              return
            }
            baseGroupTransformRef.current[eye.eyeGroupId] =
              node.getAttribute('transform') ?? ''
          }
          return acc
        },
        {} as Record<EyeGroupId, (node: SVGGElement | null) => void>,
      ),
    [],
  )

  const pupilRefs = useMemo(
    () =>
      EYES.reduce(
        (acc, eye) => {
          acc[eye.pupilId] = (node) => {
            pupilElsRef.current[eye.pupilId] = node
          }
          return acc
        },
        {} as Record<PupilId, (node: SVGGraphicsElement | null) => void>,
      ),
    [],
  )

  useEffect(() => {
    let rafId: number | null = null

    const syncTargetsToPoint = (
      targetX: number,
      targetY: number,
      options?: { innerMax?: number; outerMax?: number },
    ) => {
      const innerMax = options?.innerMax ?? INNER_MAX
      const outerMax = options?.outerMax ?? OUTER_MAX
      activeTargetRef.current = { x: targetX, y: targetY }
      for (const eye of EYES) {
        const groupEl = eyeGroupElsRef.current[eye.eyeGroupId]
        const pupilState = motionRef.current[eye.pupilId]
        if (!groupEl) {
          pupilState.targetInnerX = 0
          pupilState.targetInnerY = 0
          pupilState.targetOuterX = 0
          pupilState.targetOuterY = 0
          continue
        }
        const rect = groupEl.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const deltaX = targetX - centerX
        const deltaY = targetY - centerY
        const inner = clampVector(deltaX, deltaY, innerMax)
        const outer = clampVector(
          deltaX * eye.parallax,
          deltaY * eye.parallax,
          outerMax,
        )
        pupilState.targetInnerX = inner.x
        pupilState.targetInnerY = inner.y
        pupilState.targetOuterX = outer.x
        pupilState.targetOuterY = outer.y
      }
    }

    const syncTargetsByState = () => {
      const state = interactionStateRef.current
      if (state === 'IDLE') {
        syncTargetsToPoint(lastMouseRef.current.x, lastMouseRef.current.y)
        return
      }
      if (state === 'EMAIL_FOCUS') {
        const el = emailRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        syncTargetsToPoint(r.left + r.width / 2, r.top + r.height / 2)
        return
      }
      if (state === 'PASSWORD_FOCUS') {
        const el = passwordRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        syncTargetsToPoint(
          r.left + r.width / 2,
          r.top + r.height / 2 + PASSWORD_TARGET_OFFSET_Y,
        )
        return
      }
      if (state === 'PASSWORD_VISIBLE') {
        const svg = document.getElementById('peekaboo-stage-svg')
        if (!svg) return
        const br = svg.getBoundingClientRect()
        syncTargetsToPoint(br.left - LOOK_LEFT_OFFSET_X, br.top + br.height * 0.42, {
          innerMax: PASSWORD_VISIBLE_INNER_MAX,
          outerMax: PASSWORD_VISIBLE_OUTER_MAX,
        })
      }
    }

    const animate = () => {
      let shouldContinue = false
      for (const eye of EYES) {
        const groupEl = eyeGroupElsRef.current[eye.eyeGroupId]
        const pupilEl = pupilElsRef.current[eye.pupilId]
        const state = motionRef.current[eye.pupilId]
        state.currentInnerX = lerp(state.currentInnerX, state.targetInnerX, SMOOTHING)
        state.currentInnerY = lerp(state.currentInnerY, state.targetInnerY, SMOOTHING)
        state.currentOuterX = lerp(state.currentOuterX, state.targetOuterX, SMOOTHING)
        state.currentOuterY = lerp(state.currentOuterY, state.targetOuterY, SMOOTHING)

        if (pupilEl) {
          pupilEl.setAttribute(
            'transform',
            `translate(${state.currentInnerX.toFixed(3)}, ${state.currentInnerY.toFixed(3)})`,
          )
        }
        if (groupEl) {
          const base = baseGroupTransformRef.current[eye.eyeGroupId] ?? ''
          groupEl.setAttribute(
            'transform',
            composeTransform(base, state.currentOuterX, state.currentOuterY),
          )
        }

        if (
          Math.abs(state.currentInnerX - state.targetInnerX) > 0.02 ||
          Math.abs(state.currentInnerY - state.targetInnerY) > 0.02 ||
          Math.abs(state.currentOuterX - state.targetOuterX) > 0.02 ||
          Math.abs(state.currentOuterY - state.targetOuterY) > 0.02
        ) {
          shouldContinue = true
        }
      }
      const yellowLeft = motionRef.current['peekaboo-pupil-yellow-L']
      const yellowRight = motionRef.current['peekaboo-pupil-yellow-R']
      const yellowMouth = document.getElementById(YELLOW_MOUTH_ID)
      if (yellowMouth) {
        const mouthX = (yellowLeft.currentOuterX + yellowRight.currentOuterX) / 2
        const mouthY = (yellowLeft.currentOuterY + yellowRight.currentOuterY) / 2
        yellowMouth.setAttribute(
          'transform',
          `translate(${mouthX.toFixed(3)}, ${mouthY.toFixed(3)})`,
        )
      }

      if (shouldContinue || interactionStateRef.current === 'IDLE') {
        rafId = requestAnimationFrame(animate)
      } else {
        rafId = null
      }
    }

    const ensureAnimation = () => {
      if (rafId != null) return
      rafId = requestAnimationFrame(animate)
    }

    const onMouseMove = (e: MouseEvent) => {
      lastMouseRef.current = { x: e.clientX, y: e.clientY }
      if (interactionStateRef.current !== 'IDLE') return
      syncTargetsToPoint(e.clientX, e.clientY)
      ensureAnimation()
    }

    const onViewportChanged = () => {
      if (activeTargetRef.current == null) {
        syncTargetsByState()
      } else {
        syncTargetsByState()
      }
      ensureAnimation()
    }

    syncTargetsByState()
    ensureAnimation()
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('resize', onViewportChanged)
    window.addEventListener('scroll', onViewportChanged, true)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onViewportChanged)
      window.removeEventListener('scroll', onViewportChanged, true)
      if (rafId != null) {
        cancelAnimationFrame(rafId)
        rafId = null
      }
    }
  }, [interactionState, emailRef, passwordRef])

  return { eyeGroupRefs, pupilRefs }
}
