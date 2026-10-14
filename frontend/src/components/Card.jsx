import React from 'react';

/**
 * Reusable Card component demonstrating React Component Composition
 * and the 'children' prop as required by the project specifications.
 * 
 * @param {React.ReactNode} children - Nested elements rendered inside the card
 * @param {string} title - Optional card header title
 * @param {React.ReactNode} action - Optional right-side header action/button
 * @param {React.ReactNode} icon - Optional icon rendered beside title
 * @param {string} className - Additional CSS classes
 * @param {React.ReactNode} footer - Optional footer slot
 */
export default function Card({
  children,
  title,
  action,
  icon,
  className = '',
  footer,
  ...props
}) {
  return (
    <div
      className={`glass-panel rounded-2xl p-6 shadow-xl transition-all duration-200 border border-slate-800/60 dark:border-slate-800/80 ${className}`}
      {...props}
    >
      {(title || action || icon) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/40 dark:border-slate-800/60">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-indigo-400 dark:text-indigo-400">{icon}</span>}
            {title && (
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight">
                {title}
              </h3>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}

      {/* Primary Children Slot */}
      <div className="card-body">
        {children}
      </div>

      {/* Optional Footer Slot */}
      {footer && (
        <div className="pt-4 mt-4 border-t border-slate-700/30 dark:border-slate-800/40 text-sm">
          {footer}
        </div>
      )}
    </div>
  );
}
