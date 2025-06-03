interface AlertProps {
  title: string
  description: string
  variant?: 'default' | 'destructive'
}

export const Alert = ({ title, description, variant = 'default' }: AlertProps) => {
  const variantClasses = {
    default: 'bg-secondary-1 color-secondary-4',
    destructive: 'bg-red-100 color-red-900',
  }

  return (
    <div className={`p-4 rounded-lg ${variantClasses[variant]}`}>
      <h3 className="text-h3 mb-2">{title}</h3>
      <p className="text-p2">{description}</p>
    </div>
  )
}
