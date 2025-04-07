import { FilledButtonProps } from "@/types/interfaces"


const FilledButton = ({text, icon, clickFunction, containerClasses, ariaLabel, disabled}: FilledButtonProps) => {
  return (
    <button 
      className={`${containerClasses} ${disabled ? 'pointer-events-none opacity-50' : ''} filled-button`} 
      onClick={clickFunction} 
      aria-label={ariaLabel}
      disabled={disabled}
    >
        {icon}
        {text}
    </button>
  )
}

export default FilledButton