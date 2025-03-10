import Image from "next/image"

export default function Home() {
    return (
        <main className="max-w-[1320px] min-h-[calc(100vh-196px)] mx-auto flex my-12 bg-">
            <div className="flex flex-col justify-center gap-5 w-1/2 text-white">
                <h2 className="text-4xl font-bold">Hi, I am Fred</h2>
                <h1 className="text-5xl font-bold text-gradient-dark">A Full Stack Developer +<br/>UX Designer</h1>
                <p>I’m a technology enthusiast with a focus on Web Development. I consider myself a curious individual, always eager to learn new things.</p>
            </div>
            <div className=" flex items-center justify-center w-1/2">
                <div className="bg-dark-photo-bg rounded-[38px] w-fit rotate-5 hover:rotate-0 transition-transform duration-300">
                    <Image
                        src="/assets/profilePhoto.webp"
                        alt="Profile Photo"
                        width={475}
                        height={510}
                        className="border-2 border-secondary rounded-[38px] hover:border-primary transition-border duration-300"
                    />
                </div>
            </div>
        </main>
    )
}
