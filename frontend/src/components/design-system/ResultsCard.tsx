import React from 'react'
import classNames from 'classnames'

export interface ResultsCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onClick'> {
  selected?: boolean
  children?: React.ReactNode
  onClick?: () => void
}

/**
 * ResultsCard is a design-system card component with layered click handling.
 * - Container div provides styling and positioning context
 * - Background button handles card-level clicks (fills entire area)
 * - Children overlay on top with relative positioning so their clicks take precedence
 * - If onClick is provided, the background button is clickable; otherwise, it's static.
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
    <div
      className={classNames(
        "bg-white border-b border-secondary-2/20 border-solid flex flex-row items-center justify-between p-[30px] text-left transition-colors w-full relative",
        selected && 'bg-accent/10 border-primary-1',
        className
      )}
      {...props}
    >
      {/* Background button that fills the entire card */}
      {onClick && (
        <button
          type="button"
          onClick={onClick}
          className="absolute inset-0 w-full h-full cursor-pointer hover:bg-black hover:bg-opacity-5 transition-colors"
          aria-label="Card action"
        />
      )}

      {/* Children content overlays on top with relative positioning */}
      {children}
    </div>
  )
}
