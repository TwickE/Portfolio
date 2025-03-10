import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | Fred's Portfolio",
    description: "Get in touch with me about job opportunities, collaborations, or just to say hello. Find my contact information and connect with me on social media.",
};

const Contact = () => {
    return (
        <h1 className="text-3xl text-red-500 font-bold underline">
            Contact Page
        </h1>
    )
}

export default Contact