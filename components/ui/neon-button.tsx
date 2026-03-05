import React from 'react'
import { cn } from '@/lib/utils'
import { VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
    "relative group border text-foreground mx-auto text-center rounded-full",
    {
        variants: {
            variant: {
                default: "border-transparent bg-transparent hover:bg-transparent",
                solid: "text-white border-transparent hover:border-foreground/50 transition-all duration-200",
                ghost: "border-transparent bg-transparent hover:border-zinc-600 hover:bg-white/10",
            },
            size: {
                default: "px-7 py-1.5 ",
                sm: "px-4 py-0.5 ",
                lg: "px-10 py-2.5 ",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { neon?: boolean }

const neonGradient = 'linear-gradient(to right, transparent, var(--ds-primary), transparent)';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, neon = true, size, variant, children, style, ...props }, ref) => {
        const colorStyle: React.CSSProperties = variant === 'default' || !variant
            ? {
                borderColor: 'var(--ds-primary-20)',
                backgroundColor: 'var(--ds-primary-5)',
                ...style,
            }
            : variant === 'solid'
            ? {
                backgroundColor: 'var(--ds-primary)',
                ...style,
            }
            : { ...style };

        return (
            <button
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                style={colorStyle}
                {...props}
            >
                <span
                    className={cn("absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 inset-y-0 w-3/4 mx-auto hidden", neon && "block")}
                    style={{ background: neonGradient }}
                />
                {children}
                <span
                    className={cn("absolute group-hover:opacity-30 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px w-3/4 mx-auto hidden", neon && "block")}
                    style={{ background: neonGradient }}
                />
            </button>
        );
    }
)

Button.displayName = 'Button';

export { Button, buttonVariants };