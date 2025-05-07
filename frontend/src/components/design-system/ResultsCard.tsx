import React from 'react'
import classNames from 'classnames'

export interface ResultsCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  children?: React.ReactNode
  actions?: React.ReactNode // for nested buttons/links
}

/**
 * ResultsCard is a design-system card component that renders as a <button> for now.
 * - If onClick is provided, it is clickable; otherwise, it is static.
 * - Simple hover and selected states are supported.
 * - Uses React composition for children.
 *
 * TODO: Consider rendering as a <Link> for navigation in the future.
 * TODO: Add tabIndex/keyboard accessibility in a future accessibility overhaul.
 */
export const ResultsCard = ({
  selected = false,
  children,
  actions,
  onClick,
  className,
  ...props
}: ResultsCardProps) => {
  return (
    <div className={classNames('relative w-full', className)}>
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          'transition-colors w-full text-left p-[30px] border-b border-solid border-secondary-2/20 flex flex-row items-center justify-between bg-white',
          onClick ? 'cursor-pointer hover:bg-opacity-60' : 'cursor-default',
          selected && 'bg-accent/10 border-primary-1'
        )}
        disabled={!onClick}
        {...props}
      >
        {children}
      </button>
      {actions && <div className="absolute top-0 right-0 p-2">{actions}</div>}
    </div>
  )
}
