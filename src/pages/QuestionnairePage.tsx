// src/pages/QuestionnairePage.tsx
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgressHeader, QuestionBlock } from "@/lib/helper";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { usePsychologyTest } from "@/hooks/usePsychologyTest";
import {
  TEST_SECTIONS,
  OPTION_ID_SIM
} from "@/constant/constants";
import type { TestQuestion, Question, Option } from "@/@types/tests";
import { toast } from "sonner";
import { PCDUploadArea } from "@/components/PCDUploadArea";
import { CountrySelect } from "@/components/CountrySelect";

const QuestionnairePage = () => {
  const navigate = useNavigate();
  const { candidateId } = useParams({ from: "/selection-process/$candidateId/questionario/" });

  const {
    testInstance,
    isLoading,
    error,
    submitAnswer,
    finishTest,
    isFinishing
  } = usePsychologyTest(candidateId);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [localAnswers, setLocalAnswers] = useState<Record<string, string[]>>({});
  const [sectionStartTimestamp, setSectionStartTimestamp] = useState<number>(Date.now());
  const [isResumed, setIsResumed] = useState(false);
  const [loadingSection, setLoadingSection] = useState(false);
  const [isSendingFinal, setIsSendingFinal] = useState(false);

  const STORAGE_KEY = `questionnaire_${candidateId}`;

  const [pcdCid, setPcdCid] = useState("");
  const [cidError, setCidError] = useState(false);
  const [pcdFile, setPcdFile] = useState<File | null>(null);
  const [nationality, setNationality] = useState("");

  useEffect(() => {
    if (["Submitted", "Approved", "Rejected"].includes(testInstance?.status!)) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw);

      if (saved.localAnswers) setLocalAnswers(saved.localAnswers);
      if (saved.currentSectionIndex !== undefined) setCurrentSectionIndex(saved.currentSectionIndex);
      if (saved.pcdCid) setPcdCid(saved.pcdCid);
      if (saved.nationality) setNationality(saved.nationality);

    } catch (err) {
      console.error("Erro ao carregar localStorage:", err);
    }
  }, [testInstance]);


  const allQuestions = useMemo(() => {
    if (!testInstance?.questions) return [];
    return [...testInstance.questions].sort((a, b) => (a.questionOrder || 0) - (b.questionOrder || 0));
  }, [testInstance]);

  useEffect(() => {
    if (testInstance && allQuestions.length > 0 && !isResumed) {
      const savedAnswers: Record<string, string[]> = {};

      if (testInstance.questionResponses && testInstance.questionResponses.length > 0) {
        testInstance.questionResponses.forEach((resp) => {
          if (resp.questionSnapshotId && resp.selectedAnswers) {
            savedAnswers[resp.questionSnapshotId] = resp.selectedAnswers;
          }
        });
      }

      setLocalAnswers((prev) => ({ ...savedAnswers, ...prev }));

      let firstIncompleteSection = 0;

      for (let i = 0; i < TEST_SECTIONS.length; i++) {
        const section = TEST_SECTIONS[i];
        const questionsInSection = allQuestions.slice(section.start, section.end);

        const isSectionComplete = questionsInSection.every(q =>
          savedAnswers[q.id] && savedAnswers[q.id].length > 0
        );

        if (!isSectionComplete) {
          firstIncompleteSection = i;
          break;
        }
      }

      setCurrentSectionIndex(firstIncompleteSection);
      setIsResumed(true);
    }
  }, [testInstance, allQuestions, isResumed]);


  useEffect(() => {
    const data = {
      localAnswers,
      currentSectionIndex,
      pcdCid,
      nationality,
      updatedAt: Date.now()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [localAnswers, currentSectionIndex, pcdCid, nationality]);


  const pcdQuestionId = useMemo(() => {
    return allQuestions.find(q =>
      q.questionText.toLowerCase().includes("pcd") ||
      q.questionText.toLowerCase().includes("deficiência")
    )?.id;
  }, [allQuestions]);

  const foreignerQuestionId = useMemo(() => {
    return allQuestions.find(q =>
      q.questionText.toLowerCase().includes("estrangeiro")
    )?.id;
  }, [allQuestions]);

  const totalQuestions = allQuestions.length;

  useEffect(() => {
    setSectionStartTimestamp(Date.now());
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSectionIndex]);

  const currentSection = TEST_SECTIONS[currentSectionIndex] || TEST_SECTIONS[0];

  const questionsInCurrentSection = useMemo(() => {
    return allQuestions.slice(currentSection.start, currentSection.end);
  }, [allQuestions, currentSection]);

  const isLastSection = currentSectionIndex === TEST_SECTIONS.length - 1;

  const parseQuestion = (q: TestQuestion): Question => {
    let parsedOptions: Option[] = [];
    try {
      const rawOpts = q.optionsJson ? JSON.parse(q.optionsJson) : null;
      if (rawOpts) {
        if (!Array.isArray(rawOpts) && typeof rawOpts === "object") {
          parsedOptions = Object.entries(rawOpts).map(([key, value]) => ({ id: key, label: String(value) }));
        } else if (Array.isArray(rawOpts)) {
          parsedOptions = rawOpts.map((o: any) => ({ id: o.id || o.key, label: o.text || o.label || o.value || String(o) }));
        }
      }
    } catch (e) { console.error("Erro parse options", e); }

    return {
      id: q.id,
      prompt: q.questionText,
      options: parsedOptions,
      type: q.allowMultipleAnswers ? "multi" : "single",
      maxSelections: q.maxAnswersAllowed || 1,
      isRequired: true,
      pointValue: q.pointValue,
    };
  };

  const handleAnswerChange = (questionId: string, val: string | string[]) => {
    const valArray = Array.isArray(val) ? val : [val];
    setLocalAnswers((prev) => ({ ...prev, [questionId]: valArray }));
  };

  const validateCidFormat = (cid: string) => {
    const regex = /^[A-Z][0-9]{2}(\.[0-9])?$/;
    return regex.test(cid);
  };

  const handleCidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();
    value = value.replace(/[^A-Z0-9]/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 3) {
      value = value.replace(/^([A-Z0-9]{3})([0-9]+)$/, "$1.$2");
    }
    setPcdCid(value);
    if (cidError) setCidError(false);
  };

  const handleCidBlur = () => {
    if (pcdCid && !validateCidFormat(pcdCid)) {
      setCidError(true);
    }
  };

  const canAdvance = useMemo(() => {
    const allAnswered = questionsInCurrentSection.every(
      (q) => localAnswers[q.id] && localAnswers[q.id].length > 0
    );

    if (!allAnswered) return false;

    const pcdQuestion = pcdQuestionId ? questionsInCurrentSection.find(q => q.id === pcdQuestionId) : null;
    const foreignerQuestion = foreignerQuestionId ? questionsInCurrentSection.find(q => q.id === foreignerQuestionId) : null;

    if (pcdQuestion) {
      const answer = localAnswers[pcdQuestion.id]?.[0];
      if (answer === OPTION_ID_SIM) {
        if (!pcdCid.trim() || !validateCidFormat(pcdCid) || !pcdFile) return false;
      }
    }

    if (foreignerQuestion) {
      const answer = localAnswers[foreignerQuestion.id]?.[0];
      if (answer === OPTION_ID_SIM) {
        if (!nationality) return false;
      }
    }

    return true;
  }, [questionsInCurrentSection, localAnswers, pcdCid, pcdFile, nationality, pcdQuestionId, foreignerQuestionId]);


  const handlePrevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const handleNextSection = () => {
    setLoadingSection(true);

    const duration = Date.now() - sectionStartTimestamp;
    const timePerQuestion = Math.floor(duration / questionsInCurrentSection.length);

    const answersToSubmit = questionsInCurrentSection.map((q) => ({
      questionSnapshotId: q.id,
      selectedAnswers: localAnswers[q.id] || [],
      responseTimeMs: timePerQuestion,
    }));

    submitAnswer(answersToSubmit)
      .then(() => {
        if (!isLastSection) {
          setCurrentSectionIndex((prev) => prev + 1);
        }
      })
      .catch((err) => {
        console.error("Erro save background:", err);
        toast.error("Erro ao salvar respostas. Verifique sua conexão.");
      })
      .finally(() => {
        setLoadingSection(false);
      });
  };

  const handleFinish = async () => {
    setIsSendingFinal(true);

    const duration = Date.now() - sectionStartTimestamp;
    const timePerQuestion = Math.floor(duration / questionsInCurrentSection.length);

    const answersToSubmit = questionsInCurrentSection.map((q) => ({
      questionSnapshotId: q.id,
      selectedAnswers: localAnswers[q.id] || [],
      responseTimeMs: timePerQuestion,
    }));

    try {
      await submitAnswer(answersToSubmit);
      await finishTest();

      localStorage.removeItem(STORAGE_KEY);

      navigate({ to: "/selection-process/$candidateId", params: { candidateId } });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao finalizar teste.");
    } finally {
      setIsSendingFinal(false);
    }
  };

  if (isLoading) return <div className="flex h-screen w-full items-center justify-center gap-2"><Loader2 className="h-6 w-6 animate-spin text-gray-600" /><span>Carregando...</span></div>;
  if (error || !testInstance) return <div className="text-center p-8 text-red-600">Erro ao carregar questionário.</div>;
  if (["Submitted", "Approved", "Rejected"].includes(testInstance.status)) {
    return (
      <div className="flex h-screen w-full items-center justify-center text-center flex-col">
        <h2 className="text-xl font-bold">Teste Finalizado</h2>
        <Button className="mt-4" onClick={() => navigate({ to: "/selection-process/$candidateId", params: { candidateId } })}>Voltar</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <ProgressHeader answered={Object.keys(localAnswers).length} total={totalQuestions} />

      <main className="mx-auto w-full max-w-[900px] px-6 py-8">

        <div className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900">{currentSection.title}</h1>
          <p className="text-sm text-gray-500 mt-1">Seção {currentSectionIndex + 1} de {TEST_SECTIONS.length}</p>
        </div>

        <div className="flex flex-col gap-6">
          {questionsInCurrentSection.map((q, idx) => {
            const parsedQ = parseQuestion(q);
            const visualIndex = currentSection.start + idx + 1;

            const displayQuestion = {
              ...parsedQ,
              prompt: `${visualIndex}. ${parsedQ.prompt}`
            };

            return (
              <div key={q.id} className="flex flex-col gap-4">
                <QuestionBlock
                  q={displayQuestion}
                  value={localAnswers[q.id] || []}
                  onChange={(val) => handleAnswerChange(q.id, val)}
                />

                {pcdQuestionId && q.id === pcdQuestionId && localAnswers[q.id]?.includes(OPTION_ID_SIM) && (
                  <div className="ml-6 border-l-2 border-blue-200 pl-6 animate-in fade-in slide-in-from-top-2">
                    <div className="mb-4 max-w-sm">
                      <Label htmlFor="cid-input">Informe o código CID</Label>
                      <Input
                        id="cid-input"
                        placeholder="Ex: H54.0"
                        value={pcdCid}
                        onChange={handleCidChange}
                        onBlur={handleCidBlur}
                        maxLength={5}
                        className={`mt-1 uppercase ${cidError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      />
                      {cidError && (
                        <span className="text-xs font-medium text-red-500 mt-1 block">
                          Insira um código válido (Ex: A00 ou A00.0)
                        </span>
                      )}
                    </div>
                    <div className="max-w-md">
                      <Label>Anexar Laudo Médico</Label>
                      <PCDUploadArea onFileSelect={setPcdFile} selectedFile={pcdFile} />
                    </div>
                  </div>
                )}

                {foreignerQuestionId && q.id === foreignerQuestionId && localAnswers[q.id]?.includes(OPTION_ID_SIM) && (
                  <div className="ml-6 border-l-2 border-blue-200 pl-6 animate-in fade-in slide-in-from-top-2">
                    <CountrySelect value={nationality} onChange={setNationality} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex items-center justify-between border-t pt-6">
          <Button
            variant="ghost"
            onClick={handlePrevSection}
            disabled={currentSectionIndex === 0 || isFinishing}
            className={currentSectionIndex === 0 ? "invisible" : ""}
          >
            Voltar
          </Button>

          {isLastSection ? (
            <ConfirmDialog
              trigger={
                <Button disabled={isFinishing || !canAdvance} className="bg-[#0385d1] text-white hover:bg-[#0271b2] min-w-[150px]">
                  {isFinishing ? "Enviando..." : "Finalizar Teste"}
                </Button>
              }
              title="Finalizar Questionário"
              description="Confirma o envio de todas as respostas?"
              confirmText="Enviar Tudo"
              cancelText="Revisar"
              onConfirm={handleFinish}
            />
          ) : (
            <Button onClick={handleNextSection} disabled={!canAdvance} className="bg-[#0385d1] text-white hover:bg-[#0271b2] min-w-[150px]">
              Próxima Seção
            </Button>
          )}
        </div>

        {(loadingSection || isFinishing || isSendingFinal) && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 text-white backdrop-blur-sm">
            <Loader2 className="animate-spin w-16 h-16 mb-6" />
            <p className="text-lg font-semibold">
              {isFinishing
                ? "Enviando suas respostas..."
                : "Salvando respostas da seção..."}
            </p>
            <p className="text-sm text-gray-300 mt-2">
              Por favor, não feche nem recarregue a página.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default QuestionnairePage;
