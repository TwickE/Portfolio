import { OutlineButtonProps } from "@/types/interfaces"

const OutlineButton = ({text, leftImg, rightImg, clickFunction, containerClasses, ariaLabel}: OutlineButtonProps) => {
  return (
    <button className={`${containerClasses} outline-button`} onClick={clickFunction} aria-label={ariaLabel}>
        {leftImg}
        {text}
        {rightImg}
    </button>
  )
}

export default OutlineButton
