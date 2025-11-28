interface Props {
    questions: any[];
    currentIdx: number;
}

export const QuestionNavigator = ({ questions, currentIdx }: Props) => (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
        {questions.map((_, i) => (
            <button
                key={i}
                type="button"
                disabled
                className={`rounded-full px-5 py-2 text-sm transition-colors ${i === currentIdx ? "bg-[#0385d1] text-white" : "bg-gray-100 text-gray-500 font-semibold"
                    }`}
            >
                Questão #{i + 1}
            </button>
        ))}
    </div>
);
