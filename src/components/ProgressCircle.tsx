interface ProgressCircleProps {
    progress: number; // 0 a 100
    totalSteps: number;
    completedSteps: number;
    size?: number; // px
    stroke?: number; // espessura
    arcColor?: string;
    trailColor?: string;
    footer?: React.ReactNode; // conteúdo alinhado exatamente abaixo do círculo, mesma largura
}

export const ProgressCircle = ({
    progress,
    totalSteps,
    completedSteps,
    size = 200,
    stroke = 14,
    arcColor = "#60A5FA",
    trailColor = "#E5E7EB",
    footer,
}: ProgressCircleProps) => {
    const pct = Math.max(0, Math.min(100, Math.round(progress)));

    // Cálculo geométrico correto para stroke não ser cortado
    const center = size / 2;
    const radius = center - stroke / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - pct / 100);

    return (
        <div className="flex flex-col items-center">
            <h3 className="mb-4 text-2xl font-bold text-gray-900">Seu progresso</h3>

            {/* Wrapper com largura/altura fixas para alinhar o footer */}
            <div className="relative" style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="-rotate-90 transform"
                    aria-label={`Progresso ${pct}%`}
                >
                    {/* Trilha */}
                    <circle cx={center} cy={center} r={radius} stroke={trailColor} strokeWidth={stroke} fill="none" />

                    {/* Progresso (com caps arredondados) */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        stroke={arcColor}
                        strokeWidth={stroke}
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-[stroke-dashoffset] duration-700 ease-in-out"
                    />
                </svg>

                {/* Conteúdo central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[32px] font-extrabold leading-none text-gray-900">{`${pct}%`}</span>
                    <span className="mt-2 text-[11px] text-gray-600 font-semibold">{`${completedSteps} de ${totalSteps} etapas`}</span>
                    <span className="text-[11px] text-gray-600 font-semibold">concluídas</span>
                </div>
            </div>

            {/* Rodapé perfeitamente alinhado à largura do círculo */}
            {footer ? (
                <div className="mt-4" style={{ width: size }}>
                    {footer}
                </div>
            ) : null}
        </div>
    )
}
