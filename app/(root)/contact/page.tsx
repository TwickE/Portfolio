import BreadCrumbs from "@/components/BreadCrumbs";
import ContactSection from "@/components/ContactSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact | Fred's Portfolio",
    description: "Get in touch with me about job opportunities, collaborations, or just to say hello. Find my contact information and connect with me on social media.",
};

const Contact = () => {
    return (
        <>
            <BreadCrumbs title="Contact"/>
            <ContactSection backgroundColor="bg-my-background-200" />
        </>
    )
}

export default Contact