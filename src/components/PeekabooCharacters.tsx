/**
 * 四几何角色 SVG。眼珠由 usePeekabooPupilVisuals 驱动；
 * 偷瞄体态通过 path morph：下半段固定，上半段拉伸并向右弯腰。
 */
import { motion } from 'framer-motion'
import type { EyeGroupId, PupilId } from '../hooks/usePeekabooPupilVisuals'
import type { InteractionState } from '../types/interaction'

const bodyTransition = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 20,
}

type Props = {
  interactionState: InteractionState
  eyeGroupRefs: Record<EyeGroupId, (node: SVGGElement | null) => void>
  pupilRefs: Record<PupilId, (node: SVGGraphicsElement | null) => void>
}

type BodyPose = 'IDLE' | 'EMAIL_FOCUS' | 'PASSWORD_FOCUS' | 'PASSWORD_VISIBLE'

function getBodyPose(state: InteractionState): BodyPose {
  if (state === 'EMAIL_FOCUS') return 'EMAIL_FOCUS'
  if (state === 'PASSWORD_FOCUS') return 'PASSWORD_FOCUS'
  if (state === 'PASSWORD_VISIBLE') return 'PASSWORD_VISIBLE'
  return 'IDLE'
}

const BODY_PATHS = {
  purple: {
    IDLE:
      'M 158 290 L 262 290 L 262 30 Q 262 4 252 22 Q 210 4 168 22 Q 158 4 158 30 Z',
    EMAIL_FOCUS:
      // 上端两个端点向右偏移，并整体抬高形成拉伸效果
      'M 158 290 L 262 290 L 283 11 Q 283 -2 273 15 Q 231 -8 189 15 Q 179 -2 179 11 Z',
    PASSWORD_FOCUS:
      // 拉伸幅度比 EMAIL_FOCUS 小，但右倾幅度更大，头部形状保持一致
      'M 158 290 L 262 290 L 287 45 Q 287 33 277 45 Q 232 22 190 39 Q 180 27 180 41 Z',
    PASSWORD_VISIBLE:
      'M 158 290 L 262 290 L 262 30 Q 262 4 252 22 Q 210 4 168 22 Q 158 4 158 30 Z',
  },
  // A 后 5位表示头部形状，第一个L后面和第二个L前面两个数调整左右倾斜度和高度
  black: {
    IDLE: 'M 228 290 L 228 142 A 48 48 0 0 1 322 142 L 322 290 Z',
    EMAIL_FOCUS: 'M 228 290 L 238 102 A 48 48 0 0 1 332 102 L 322 290 Z',
    PASSWORD_FOCUS: 'M 228 290 L 248 122 A 48 48 0 0 1 342 122 L 322 290 Z',
    PASSWORD_VISIBLE: 'M 228 290 L 228 142 A 48 48 0 0 1 322 142 L 322 290 Z',
  },
  orange: {
    IDLE: 'M 34 290 L 34 242 A 67 67 0 0 1 166 242 L 166 290 Z',
    EMAIL_FOCUS: 'M 34 290 L 44 202 A 67 67 0 0 1 176 202 L 166 290 Z',
    PASSWORD_FOCUS: 'M 34 290 L 54 228 A 67 67 0 0 1 186 228 L 166 290 Z',
    PASSWORD_VISIBLE: 'M 34 290 L 34 242 A 67 67 0 0 1 166 242 L 166 290 Z',
  },
  yellow: {
    IDLE: 'M 322 290 L 322 192 Q 322 180 334 180 L 392 180 Q 404 180 404 192 L 404 290 Z',
    EMAIL_FOCUS:
      'M 322 290 L 332 162 Q 332 150 344 150 L 402 150 Q 414 150 414 162 L 404 290 Z',
    PASSWORD_FOCUS:
      'M 322 290 L 342 182 Q 342 170 354 170 L 412 170 Q 424 170 424 182 L 404 290 Z',
    PASSWORD_VISIBLE:
      'M 322 290 L 322 192 Q 322 180 334 180 L 392 180 Q 404 180 404 192 L 404 290 Z',
  },
} as const

const svgPivotStyle = {
  transformBox: 'fill-box' as const,
  transformOrigin: '50% 100%',
}

export default function PeekabooCharacters({
  interactionState,
  eyeGroupRefs,
  pupilRefs,
}: Props) {
  const pose = getBodyPose(interactionState)
  const eyeOffset = {
    IDLE: { x: 0, y: 0 },
    EMAIL_FOCUS: { x: 8, y: -18 },
    PASSWORD_FOCUS: { x: 12, y: -8 },
    PASSWORD_VISIBLE: { x: -12, y: -3 },
  }[pose]

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
            rotate: 0,
            scaleY: 1,
            x: 0,
            y: 0,
          }}
          transition={bodyTransition}
        >
          <motion.path
            id="peekaboo-body-purple"
            fill="#7C5CE6"
            initial={false}
            animate={{
              d: BODY_PATHS.purple[pose],
            }}
            transition={bodyTransition}
          />
          <motion.g
            initial={false}
            animate={{ x: eyeOffset.x, y: eyeOffset.y }}
            transition={bodyTransition}
          >
            <g
              id="peekaboo-eye-purple-L"
              ref={eyeGroupRefs['peekaboo-eye-purple-L']}
              transform="translate(192, 60)"
            >
              <rect
                id="peekaboo-eye-bg-purple-L"
                x="-12"
                y="-6"
                width="25"
                height="12"
                rx="3"
                fill="#5B4DB8"
              />
              <rect
                id="peekaboo-pupil-purple-L"
                ref={pupilRefs['peekaboo-pupil-purple-L']}
                x="-8"
                y="-2"
                width="15"
                height="4"
                rx="1"
                fill="#FFFFFF"
              />
            </g>
            <g
              id="peekaboo-eye-purple-R"
              ref={eyeGroupRefs['peekaboo-eye-purple-R']}
              transform="translate(228, 60)"
            >
              <rect
                id="peekaboo-eye-bg-purple-R"
                x="-12"
                y="-6"
                width="25"
                height="12"
                rx="3"
                fill="#5B4DB8"
              />
              <rect
                id="peekaboo-pupil-purple-R"
                ref={pupilRefs['peekaboo-pupil-purple-R']}
                x="-8"
                y="-2"
                width="15"
                height="4"
                rx="1"
                fill="#FFFFFF"
              />
            </g>
          </motion.g>
        </motion.g>

        <motion.g
          id="peekaboo-char-black"
          initial={false}
          style={svgPivotStyle}
          animate={{
            rotate: 0,
            scaleY: 1,
            x: 0,
            y: 0,
          }}
          transition={bodyTransition}
        >
          <motion.path
            id="peekaboo-body-black"
            fill="#1A1A1A"
            initial={false}
            animate={{
              d: BODY_PATHS.black[pose],
            }}
            transition={bodyTransition}
          />
          <motion.g
            initial={false}
            animate={{ x: eyeOffset.x, y: eyeOffset.y }}
            transition={bodyTransition}
          >
            <g
              id="peekaboo-eye-black-L"
              ref={eyeGroupRefs['peekaboo-eye-black-L']}
              transform="translate(260, 150)"
            >
              <ellipse
                id="peekaboo-eye-bg-black-L"
                cx="0"
                cy="0"
                rx="12"
                ry="11"
                fill="#FFFFFF"
              />
              <circle
                id="peekaboo-pupil-black-L"
                ref={pupilRefs['peekaboo-pupil-black-L']}
                cx="0"
                cy="0"
                r="5"
                fill="#1A1A1A"
              />
            </g>
            <g
              id="peekaboo-eye-black-R"
              ref={eyeGroupRefs['peekaboo-eye-black-R']}
              transform="translate(291, 150)"
            >
              <ellipse
                id="peekaboo-eye-bg-black-R"
                cx="0"
                cy="0"
                rx="12"
                ry="11"
                fill="#FFFFFF"
              />
              <circle
                id="peekaboo-pupil-black-R"
                ref={pupilRefs['peekaboo-pupil-black-R']}
                cx="0"
                cy="0"
                r="5"
                fill="#1A1A1A"
              />
            </g>
          </motion.g>
        </motion.g>

        <motion.g
          id="peekaboo-char-orange"
          initial={false}
          style={svgPivotStyle}
          animate={{
            rotate: 0,
            scaleY: 1,
            x: 0,
            y: 0,
          }}
          transition={bodyTransition}
        >
          <g transform="translate(28, 0)">
            <motion.path
              id="peekaboo-body-orange"
              fill="#E87C6B"
              initial={false}
              animate={{
                d: BODY_PATHS.orange[pose],
              }}
              transition={bodyTransition}
            />
            <motion.g
              initial={false}
              animate={{ x: eyeOffset.x, y: eyeOffset.y }}
              transition={bodyTransition}
            >
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
            </motion.g>
          </g>
        </motion.g>

        <motion.g
          id="peekaboo-char-yellow"
          initial={false}
          style={svgPivotStyle}
          animate={{
            rotate: 0,
            scaleY: 1,
            x: 0,
            y: 0,
          }}
          transition={bodyTransition}
        >
          <g transform="translate(-34, 0)">
            <motion.path
              id="peekaboo-body-yellow"
              fill="#E8D44D"
              initial={false}
              animate={{
                d: BODY_PATHS.yellow[pose],
              }}
              transition={bodyTransition}
            />
            <motion.g
              initial={false}
              animate={{ x: eyeOffset.x, y: eyeOffset.y }}
              transition={bodyTransition}
            >
              <g
                id="peekaboo-eye-yellow-L"
                ref={eyeGroupRefs['peekaboo-eye-yellow-L']}
                transform="translate(350, 198)"
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
                transform="translate(376, 198)"
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
            </motion.g>
          </g>
        </motion.g>
      </svg>
    </div>
  )
}
