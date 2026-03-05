"use client"

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import {
  HTMLMotionProps,
  MotionValue,
  motion,
  useScroll,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

const bentoGridVariants = cva(
  "relative grid gap-4 [&>*:first-child]:origin-top-right [&>*:nth-child(3)]:origin-bottom-right [&>*:nth-child(4)]:origin-top-right",
  {
    variants: {
      variant: {
        default: `
          grid-cols-8 grid-rows-[1fr_0.5fr_0.5fr_1fr]
          [&>*:first-child]:col-span-8 md:[&>*:first-child]:col-span-6 [&>*:first-child]:row-span-3
          [&>*:nth-child(2)]:col-span-2 md:[&>*:nth-child(2)]:row-span-2 [&>*:nth-child(2)]:hidden md:[&>*:nth-child(2)]:block
          [&>*:nth-child(3)]:col-span-2 md:[&>*:nth-child(3)]:row-span-2 [&>*:nth-child(3)]:hidden md:[&>*:nth-child(3)]:block
          [&>*:nth-child(4)]:col-span-4 md:[&>*:nth-child(4)]:col-span-3
          [&>*:nth-child(5)]:col-span-4 md:[&>*:nth-child(5)]:col-span-3
        `,
        threeCells: `
          grid-cols-2 grid-rows-2
          [&>*:first-child]:col-span-2
      `,
        fourCells: `
        grid-cols-3 grid-rows-2
        [&>*:first-child]:col-span-1
        [&>*:nth-child(2)]:col-span-2
        [&>*:nth-child(3)]:col-span-2
      `,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ContainerScrollContextValue {
  scrollYProgress: MotionValue<number>
}
const ContainerScrollContext = React.createContext<
  ContainerScrollContextValue | undefined
>(undefined)
function useContainerScrollContext() {
  const context = React.useContext(ContainerScrollContext)
  if (!context) {
    throw new Error(
      "useContainerScrollContext must be used within a ContainerScroll Component"
    )
  }
  return context
}
const ContainerScroll = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
  })
  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <div
        ref={scrollRef}
        className={cn("relative min-h-screen w-full", className)}
        {...props}
      >
        {children}
      </div>
    </ContainerScrollContext.Provider>
  )
}

const BentoGrid = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof bentoGridVariants>
>(({ variant, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(bentoGridVariants({ variant }), className)}
      {...props}
    />
  )
})
BentoGrid.displayName = "BentoGrid"

const BentoCell = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext()
    const translate = useTransform(scrollYProgress, [0.1, 0.9], ["-35%", "0%"])
    const scale = useTransform(scrollYProgress, [0, 0.9], [0.5, 1])

    return (
      <motion.div
        ref={ref}
        className={className}
        style={{ translate, scale, ...style }}
        {...props}
      ></motion.div>
    )
  }
)
BentoCell.displayName = "BentoCell"

const ContainerScale = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  ({ className, style, ...props }, ref) => {
    const { scrollYProgress } = useContainerScrollContext()
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    const position = useTransform(scrollYProgress, (pos) =>
      pos >= 0.6 ? "absolute" : "fixed"
    )
    return (
      <motion.div
        ref={ref}
        className={cn("left-1/2 top-1/2  size-fit", className)}
        style={{
          translate: "-50% -50%",
          scale,
          position,
          opacity,
          ...style,
        }}
        {...props}
      />
    )
  }
)
ContainerScale.displayName = "ContainerScale"

/* ─────────────────────────────────────────────────────────────────────────
   INVERSE VARIANTS
   Gallery-first → text-reveal pattern
   Starts with images covering the full viewport, scrolling reveals the text.
───────────────────────────────────────────────────────────────────────── */

/**
 * InverseContainerScroll
 * Tall (270 vh) section with a sticky inner viewport so the animation
 * plays over a long scroll distance — gallery visible at top, content
 * revealed at the bottom.
 */
const InverseContainerScroll = ({
  id,
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLElement> & { id?: string }) => {
  const scrollRef = React.useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  })

  return (
    <ContainerScrollContext.Provider value={{ scrollYProgress }}>
      <section
        id={id}
        ref={scrollRef}
        className={cn("relative h-[270vh] bg-[var(--ds-background-deep)]", className)}
        {...props}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {children}
        </div>
      </section>
    </ContainerScrollContext.Provider>
  )
}

/**
 * InverseBentoCell
 * Cell that starts full-size and moves outward as the user scrolls.
 *
 * `xDir`: horizontal direction (-1 left, 0 center, 1 right)
 * `yDir`: vertical direction  (-1 up,   0 center, 1 down)
 */
const InverseBentoCell = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & { xDir?: number; yDir?: number }
>(({ className, style, xDir = 0, yDir = 0, ...props }, ref) => {
  const { scrollYProgress } = useContainerScrollContext()

  const x = useTransform(
    scrollYProgress,
    [0.05, 0.72],
    ["0%", `${xDir * 42}%`]
  )
  const y = useTransform(
    scrollYProgress,
    [0.05, 0.72],
    ["0%", `${yDir * 42}%`]
  )
  const scale = useTransform(scrollYProgress, [0.05, 0.72], [1, 0.55])
  const opacity = useTransform(scrollYProgress, [0.42, 0.72], [1, 0.15])

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={{ x, y, scale, opacity, ...style }}
      {...props}
    />
  )
})
InverseBentoCell.displayName = "InverseBentoCell"

/**
 * InverseContainerScale
 * Center content that starts hidden and fades / scales in as the gallery
 * images open up.
 */
const InverseContainerScale = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div">
>(({ className, style, ...props }, ref) => {
  const { scrollYProgress } = useContainerScrollContext()

  const opacity = useTransform(scrollYProgress, [0.22, 0.55], [0, 1])
  const scale = useTransform(scrollYProgress, [0.22, 0.55], [0.86, 1])
  const y = useTransform(scrollYProgress, [0.22, 0.55], [28, 0])

  return (
    <motion.div
      ref={ref}
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center px-6 z-10 pointer-events-none",
        className
      )}
      style={{ opacity, scale, y, ...style }}
      {...props}
    />
  )
})
InverseContainerScale.displayName = "InverseContainerScale"

export {
  ContainerScroll,
  BentoGrid,
  BentoCell,
  ContainerScale,
  InverseContainerScroll,
  InverseBentoCell,
  InverseContainerScale,
}
