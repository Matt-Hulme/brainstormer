import React from 'react'

interface VennDiagramIconProps {
  size?: number
  className?: string
}

export const VennDiagramIcon: React.FC<VennDiagramIconProps> = ({ size = 35, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="9" cy="12" r="6" fill="currentColor" opacity="0.4" />
      <circle cx="15" cy="12" r="6" fill="currentColor" opacity="0.4" />
    </svg>
  )
}
