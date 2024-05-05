export const icons = {
  "logo":  function Logo({ width = 20, height = 20, className }: { width: number, height: number, className?: string }) {
    return (
      <img 
        src="/logo.svg"
        alt="Logo"
        width={width}
        height={height}
        className={className}
      />
    )
  }
}