import { OutlineButtonProps } from "@/types/interfaces"

const OutlineButton = ({text, leftImg, rightImg, clickFunction, containerClasses, ariaLabel}: OutlineButtonProps) => {
  return (
    <button className={`${containerClasses} outline-button`} onClick={clickFunction} aria-label={ariaLabel}>
        {leftImg && leftImg}
        {text && text}
        {rightImg && rightImg}
    </button>
  )
}

export default OutlineButton

/* <Image src={rightImg} width={18} height={18} className="w-[18px] h-[18px]" alt="right icon"/> */