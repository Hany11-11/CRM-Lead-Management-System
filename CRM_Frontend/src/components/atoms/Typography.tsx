import { type ReactNode, type HTMLAttributes, forwardRef } from 'react';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption' | 'label';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'label';
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  h1: 'text-2xl font-bold text-slate-900 tracking-tight',
  h2: 'text-xl font-semibold text-slate-900 tracking-tight',
  h3: 'text-lg font-semibold text-slate-900',
  h4: 'text-base font-medium text-slate-900',
  body: 'text-sm text-slate-600',
  'body-sm': 'text-xs text-slate-500',
  caption: 'text-xs text-slate-400',
  label: 'text-sm font-medium text-slate-700',
};

const defaultTags: Record<string, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  label: 'label',
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  ({ variant = 'body', as, className = '', children, ...props }, ref) => {
    const Component = (as || defaultTags[variant]) as 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div' | 'label';

    return (
      <Component
        ref={ref as React.Ref<HTMLHeadingElement & HTMLParagraphElement & HTMLSpanElement & HTMLDivElement & HTMLLabelElement>}
        className={`${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Typography.displayName = 'Typography';
