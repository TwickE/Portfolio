"use client";

import FilledButton from "@/components/FilledButton";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useEffect, useRef, useMemo } from "react";

const FRAME_RATE = 25;
const CHAR_SIZE = 20;
const CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789";
const FONT_STYLE = "16px monospace";
const DROP_RESET_PROBABILITY = 0.975;

const NotFound = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef(0);

    const charArray = useMemo(() => CHARACTERS.split(""), []);

    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = canvas.width = window.innerWidth - 3;
        let height = canvas.height = window.innerHeight - 3;
        let columns = Math.floor(width / CHAR_SIZE);
        let drops = Array(columns).fill(1);
        let lastFrameTime = Date.now();

        const draw = () => {
            try {
                const currentTime = Date.now();
                const elapsedTime = currentTime - lastFrameTime;

                if (elapsedTime > 1000 / FRAME_RATE) {
                    const backgroundColor = getComputedStyle(document.documentElement)
                        .getPropertyValue('--my-matrix-background-color');

                    ctx.fillStyle = backgroundColor;
                    ctx.fillRect(0, 0, width, height);
                    ctx.fillStyle = "#283AFF";
                    ctx.font = FONT_STYLE;

                    for (let i = 0; i < drops.length; i++) {
                        const text = charArray[Math.floor(Math.random() * charArray.length)];
                        const x = i * CHAR_SIZE;
                        const y = drops[i] * CHAR_SIZE;

                        ctx.fillText(text, x, y);

                        if (y > height && Math.random() > DROP_RESET_PROBABILITY) {
                            drops[i] = 0;
                        }

                        drops[i]++;
                    }

                    lastFrameTime = currentTime;
                }
            } catch (error) {
                console.error('Error in matrix animation:', error);
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        const resizeObserver = new ResizeObserver(() => {
            width = canvas.width = window.innerWidth - 3;
            height = canvas.height = window.innerHeight - 3;
            columns = Math.floor(width / CHAR_SIZE);
            drops = Array(columns).fill(1);
        });

        resizeObserver.observe(document.body);
        animationRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            resizeObserver.disconnect();
        };
    }, [charArray]);

    return (
        <div className="min-h-screen">
            <div className='absolute inset-0 overflow-hidden'>
                <canvas
                    ref={canvasRef}
                    className="fixed top-0 left-0 -z-10"
                    aria-label="Matrix Rain Animation"
                    role="img"
                />
            </div>
            <div style={{ position: 'absolute', top: '0px', left: '0px', width: '100%' }}>
                <Navbar />
                <section className='h-[calc(100vh-100px)] grid place-items-center'>
                    <div className="flex flex-col items-center font-bold text-center">
                        <h1 className="text-[10rem] max-lg:text-[8rem] max-sm:text-[6rem]">404</h1>
                        <h2 className="text-3xl mt-4 mb-8 max-lg:text-2xl max-sm:text-xl">It seems that you are lost<br></br>This page doesn&apos;t exist</h2>
                        <Link href="/">
                            <FilledButton
                                text="Go Home"
                                containerClasses="px-8 py-4"
                            />
                        </Link>
                    </div>
                </section>
                <Footer />
            </div>
        </div>
    )
}

export default NotFound