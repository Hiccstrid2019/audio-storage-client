import React, {useEffect, useRef} from 'react';
import classes from "./AudioWave.module.css";
import {useMatchMedia} from "../../../hoc/useMatchMedia";

const filterData = (audioBuffer: AudioBuffer, samples: number) => {
    const rawData = audioBuffer.getChannelData(0);
    const blockSize = Math.floor(rawData.length / samples);
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
            sum = sum + Math.abs(rawData[blockStart + j])
        }
        filteredData.push(sum / blockSize);
    }
    return filteredData;
}

const normalizeData = (filteredData: number[]) => {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
}

const drawLineSegment = (ctx: CanvasRenderingContext2D,
                         x: number,
                         y: number,
                         width: number,
                         isEven: number) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#1F2937";
    ctx.beginPath();
    y = isEven ? y : -y;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, y);
    ctx.arc(x + width / 2, y, width / 2, Math.PI, 0, !!isEven);
    ctx.lineTo(x + width, 0);
    ctx.stroke();
}

interface AudioWaveProps {
    audioBuffer: AudioBuffer
}

const AudioWave = ({audioBuffer} : AudioWaveProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {isMobile} = useMatchMedia();

    useEffect(() => {
        let samples = 150;
        if (isMobile) samples = 50;
        draw(normalizeData(filterData(audioBuffer, samples)));
    }, []);

    const draw = (normalizedData: number[]) => {
        const canvas = canvasRef.current!;
        const dpr = window.devicePixelRatio || 1;
        const padding = 5;
        canvas.width = canvas.offsetWidth  * dpr;
        canvas.height = (canvas.offsetHeight + padding * 2) * dpr;
        const ctx = canvas.getContext("2d")!;
        ctx.scale(dpr, dpr);
        ctx.translate(0, canvas.offsetHeight / 2 + padding);

        const width = canvas.offsetWidth / normalizedData.length;

        for (let i = 0; i < normalizedData.length; i++) {
            const x = width * i;
            let height = normalizedData[i] * canvas.offsetHeight - padding;
            if (height < 0) {
                height = 0;
            } else if (height >= canvas.offsetHeight / 2) {
                height = canvas.offsetHeight / 2;
            }
            drawLineSegment(ctx, x, height, width, (i + 1) % 2);
        }
    }

    return (
        <div className={classes.container}>
            <canvas ref={canvasRef} className={classes.canvas}></canvas>
        </div>
    );
};

export default AudioWave;
