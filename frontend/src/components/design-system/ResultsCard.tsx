import React from 'react'
import classNames from 'classnames'

export interface ResultsCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
  children?: React.ReactNode
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
  onClick,
  className,
  ...props
}: ResultsCardProps) => {
  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className={classNames(
          "bg-white border-b border-secondary-2/20 border-solid flex flex-row items-center justify-between p-[30px] text-left transition-colors w-full",
          onClick ? 'cursor-pointer hover:bg-opacity-60' : 'cursor-default',
          selected && 'bg-accent/10 border-primary-1',
          className
        )}
        {...props}
      >
        {children}
      </button>
    </>
  )
}
