import { Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "./ui/button";
import type { TestDetails, TestStatus } from "@/config/tests";

const Pill: React.FC<{ tone: TestStatus }> = ({ tone }) => {
  const LABEL = {
    pending: "Pendente",
    not_finished: "Não finalizado",
    completed: "Finalizado",
  } as const;

  const STYLE: Record<TestStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    not_finished: "bg-red-100 text-red-800 border border-red-300",
    completed: "bg-green-100 text-green-800 border border-green-300",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full
        px-3 py-1 text-xs font-semibold ${STYLE[tone]}`}
    >
      {LABEL[tone]}
    </span>
  );
};

export const TestCard = ({
  test,
  candidateId,
}: {
  test: TestDetails & { status: TestStatus };
  candidateId: string;
}) => {
  const isDisabled = test.status === "completed" || test.status === "not_finished";

  const canStart = !!test.startTo && !isDisabled;

  const showDuration = test.title !== "Questionário" && !!test.duration && test.duration > 0;

  return (
    <Card
      className={`
        max-w-[309px] min-w-[280px] 2xl:w-[300px]
        max-h-[297px] min-h-[297px] rounded-2xl border-gray-200 shadow-sm
        grid grid-rows-[auto_24px_64px_28px_48px] gap-2 p-10
        lg:min-h-[220px] lg:p-6 lg:grid-rows-[auto_20px_56px_26px_44px]
        hover:shadow-md transition-shadow
        ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}
      `}
    >
      <CardHeader className="p-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-5 items-center justify-center rounded-full text-gray-800">
            <test.icon className="size-6" />
          </span>
          <CardTitle className="text-[20px] lg:text-[18px] font-bold text-gray-800">
            {test.title}
          </CardTitle>
        </div>
      </CardHeader>

      <div className="flex items-center justify-center gap-4 text-[12px] text-[#0385D1]">
        {showDuration ? (
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" />
            {test.duration} minutos
          </span>
        ) : (
          <span style={{ height: 18 }} />
        )}

        <span className="inline-flex items-center gap-1.5">
          <test.typeIcon className="size-4" />
          {test.type}
        </span>
      </div>

      {/* 3) Descrição */}
      <CardContent className="p-0 flex items-center justify-center">
        <p className="text-center text-sm leading-snug text-gray-600">
          {test.description}
        </p>
      </CardContent>

      <div className="flex items-center justify-center">
        <Pill tone={test.status} />
      </div>

      <CardFooter className="p-0 flex items-center justify-center">
        {canStart ? (
          <Button
            asChild
            className="w-[210px] h-[42px] lg:h-[38px] rounded-xl bg-[#0385D1] hover:bg-[#0271B2] font-semibold mt-4"
          >
            <Link to={test.startTo} params={{ candidateId }}>
              Iniciar
            </Link>
          </Button>
        ) : (
          <Button
            disabled
            className="w-[210px] h-[42px] lg:h-[38px] rounded-xl bg-gray-200 text-gray-500 font-semibold mt-4"
          >
            Iniciar
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
