import { TbAlertHexagonFilled } from "react-icons/tb";

const ErrorCard = ({name}: {name: string}) => {
    return (
        <div className="bg-my-accent mx-auto my-10 p-8 rounded-2xl border border-my-secondary flex flex-col items-center text-center max-w-md">
            <TbAlertHexagonFilled size={40} className="text-destructive-foreground mb-4" />
            <h3 className="text-2xl font-bold mb-2">Error fetching {name}</h3>
            <p className="text-base mb-6">
                An error occurred while fetching {name}. Please try again later.
            </p>
        </div>
    )
}

export default ErrorCard