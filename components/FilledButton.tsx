import { FilledButtonProps } from "@/types/interfaces"


const FilledButton = ({text, icon, clickFunction, containerClasses, ariaLabel}: FilledButtonProps) => {
  return (
    <button className={`${containerClasses} filled-button`} onClick={clickFunction} aria-label={ariaLabel}>
        {text}
        {icon}
    </button>
  )
}

export default FilledButton