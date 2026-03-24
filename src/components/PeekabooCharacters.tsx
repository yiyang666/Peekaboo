/**
 * 四几何角色 SVG。眼珠由 usePeekabooPupilVisuals 驱动；
 * 偷瞄：绕脚底 transformOrigin 向右倾 + scaleY 伸脖子（非整体上移）。
 */
import { motion } from 'framer-motion'
import type { EyeGroupId, PupilId } from '../hooks/usePeekabooPupilVisuals'
import type { InteractionState } from '../types/interaction'

const bodyTransition = {
  type: 'spring' as const,
  stiffness: 340,
  damping: 30,
}

type Props = {
  interactionState: InteractionState
  eyeGroupRefs: Record<EyeGroupId, (node: SVGGElement | null) => void>
  pupilRefs: Record<PupilId, (node: SVGGraphicsElement | null) => void>
}

/** 输入账号、或输入密码且仍为密文时：统一偷瞄体态 */
function isPeekPose(state: InteractionState) {
  return state === 'EMAIL_FOCUS' || state === 'PASSWORD_FOCUS'
}

const svgPivotStyle = {
  transformBox: 'fill-box' as const,
  transformOrigin: '50% 100%',
}

export default function PeekabooCharacters({
  interactionState,
  eyeGroupRefs,
  pupilRefs,
}: Props) {
  const peek = isPeekPose(interactionState)

  return (
    <div className="flex w-full max-w-lg justify-center">
      <svg
        id="peekaboo-stage-svg"
        className="h-auto w-full max-h-[min(52vh,420px)] select-none"
        viewBox="0 0 520 300"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <motion.g
          id="peekaboo-char-purple"
          initial={false}
          style={svgPivotStyle}
          animate={{
            rotate: peek ? 9 : 0,
            scaleY: peek ? 1.1 : 1,
            x: 0,
            y: 0,
          }}
          transition={bodyTransition}
        >
          <path
            id="peekaboo-body-purple"
            fill="#7C5CE6"
            d="M 158 290 L 158 64 Q 158 42 178 42 L 242 42 Q 262 42 262 64 L 262 290 Z"
          />
          <g
            id="peekaboo-eye-purple-L"
            ref={eyeGroupRefs['peekaboo-eye-purple-L']}
            transform="translate(192, 92)"
          >
            <rect
              id="peekaboo-eye-bg-purple-L"
              x="-12"
              y="-6"
              width="20"
              height="12"
              rx="3"
              fill="#5B4DB8"
            />
            <rect
              id="peekaboo-pupil-purple-L"
              ref={pupilRefs['peekaboo-pupil-purple-L']}
              x="-8"
              y="-2"
              width="12"
              height="4"
              rx="1"
              fill="#FFFFFF"
            />
          </g>
          <g
            id="peekaboo-eye-purple-R"
            ref={eyeGroupRefs['peekaboo-eye-purple-R']}
            transform="translate(228, 92)"
          >
            <rect
              id="peekaboo-eye-bg-purple-R"
              x="-12"
              y="-6"
              width="20"
              height="12"
              rx="3"
              fill="#5B4DB8"
            />
            <rect
              id="peekaboo-pupil-purple-R"
              ref={pupilRefs['peekaboo-pupil-purple-R']}
              x="-8"
              y="-2"
              width="12"
              height="4"
              rx="1"
              fill="#FFFFFF"
            />
          </g>
        </motion.g>

        <motion.g
          id="peekaboo-char-black"
          initial={false}
          style={svgPivotStyle}
          animate={{
            rotate: peek ? 9 : 0,
            scaleY: peek ? 1.1 : 1,
            x: 0,
            y: 0,
          }}
          transition={bodyTransition}
        >
          <path
            id="peekaboo-body-black"
            fill="#1A1A1A"
            // Further fatter: even wider body, rounder appearance
            d="M 238 290 L 238 152 Q 238 122 268 122 L 272 122 Q 302 122 302 152 L 302 290 Z"
          />
          <g
            id="peekaboo-eye-black-L"
            ref={eyeGroupRefs['peekaboo-eye-black-L']}
            transform="translate(255, 158)"
          >
            <ellipse
              id="peekaboo-eye-bg-black-L"
              cx="0"
              cy="0"
              rx="10"
              ry="10"
              fill="#FFFFFF"
            />
            <circle
              id="peekaboo-pupil-black-L"
              ref={pupilRefs['peekaboo-pupil-black-L']}
              cx="0"
              cy="0"
              r="4"
              fill="#1A1A1A"
            />
          </g>
          <g
            id="peekaboo-eye-black-R"
            ref={eyeGroupRefs['peekaboo-eye-black-R']}
            transform="translate(286, 158)"
          >
            <ellipse
              id="peekaboo-eye-bg-black-R"
              cx="0"
              cy="0"
              rx="10"
              ry="10"
              fill="#FFFFFF"
            />
            <circle
              id="peekaboo-pupil-black-R"
              ref={pupilRefs['peekaboo-pupil-black-R']}
              cx="0"
              cy="0"
              r="4"
              fill="#1A1A1A"
            />
          </g>
        </motion.g>

        <motion.g
          id="peekaboo-char-orange"
          initial={false}
          style={svgPivotStyle}
          animate={{
            rotate: peek ? 9 : 0,
            scaleY: peek ? 1.1 : 1,
            x: 0,
            y: 0,
          }}
          transition={bodyTransition}
        >
          <g transform="translate(28, 0)">
          <path
            id="peekaboo-body-orange"
            fill="#E87C6B"
            d="M 34 290 L 34 242 A 67 67 0 0 1 166 242 L 166 290 Z"
          />
          <g
            id="peekaboo-eye-orange-L"
            ref={eyeGroupRefs['peekaboo-eye-orange-L']}
            transform="translate(85, 225)"
          >
            <circle
              id="peekaboo-eye-bg-orange-L"
              cx="0"
              cy="0"
              r="8"
              fill="#D96B5A"
              opacity="0.85"
            />
            <circle
              id="peekaboo-pupil-orange-L"
              ref={pupilRefs['peekaboo-pupil-orange-L']}
              cx="0"
              cy="0"
              r="4"
              fill="#1A1A1A"
            />
          </g>
          <g
            id="peekaboo-eye-orange-R"
            ref={eyeGroupRefs['peekaboo-eye-orange-R']}
            transform="translate(115, 225)"
          >
            <circle
              id="peekaboo-eye-bg-orange-R"
              cx="0"
              cy="0"
              r="8"
              fill="#D96B5A"
              opacity="0.85"
            />
            <circle
              id="peekaboo-pupil-orange-R"
              ref={pupilRefs['peekaboo-pupil-orange-R']}
              cx="0"
              cy="0"
              r="4"
              fill="#1A1A1A"
            />
          </g>
          </g>
        </motion.g>

        <motion.g
          id="peekaboo-char-yellow"
          initial={false}
          style={svgPivotStyle}
          animate={{
            rotate: peek ? 9 : 0,
            scaleY: peek ? 1.1 : 1,
            x: 0,
            y: 0,
          }}
          transition={bodyTransition}
        >
          <g transform="translate(-34, 0)">
          <path
            id="peekaboo-body-yellow"
            fill="#E8D44D"
            d="M 322 290 L 322 212 C 322 192 338 174 363 174 C 388 174 404 192 404 212 L 404 290 Z"
          />
          {/* 两只眼睛离得更近：将L、R的x坐标中间靠近一些 */}
          <g
            id="peekaboo-eye-yellow-L"
            ref={eyeGroupRefs['peekaboo-eye-yellow-L']}
            transform="translate(352, 198)"
          >
            <circle
              id="peekaboo-eye-bg-yellow-L"
              cx="0"
              cy="0"
              r="7.5"
              fill="#D4C84A"
              opacity="0.9"
            />
            <circle
              id="peekaboo-pupil-yellow-L"
              ref={pupilRefs['peekaboo-pupil-yellow-L']}
              cx="0"
              cy="0"
              r="3.5"
              fill="#1A1A1A"
            />
          </g>
          <g
            id="peekaboo-eye-yellow-R"
            ref={eyeGroupRefs['peekaboo-eye-yellow-R']}
            transform="translate(374, 198)"
          >
            <circle
              id="peekaboo-eye-bg-yellow-R"
              cx="0"
              cy="0"
              r="7.5"
              fill="#D4C84A"
              opacity="0.9"
            />
            <circle
              id="peekaboo-pupil-yellow-R"
              ref={pupilRefs['peekaboo-pupil-yellow-R']}
              cx="0"
              cy="0"
              r="3.5"
              fill="#1A1A1A"
            />
          </g>
          <line
            id="peekaboo-mouth-yellow"
            x1="340"
            y1="220"
            x2="386"
            y2="220"
            stroke="#1A1A1A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          </g>
        </motion.g>
      </svg>
    </div>
  )
}
