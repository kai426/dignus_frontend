import type { Job } from "@/@types";
import Tag from "./Tag";
import { User } from "lucide-react";
import { Button } from "./ui/button";

const JobCard = ({ job }: { job: Job }) => (
  // 1. A classe `flex` e `flex-col` é crucial.
  //    Ela transforma o card em um container flexível vertical.
  //    O Grid vai garantir que este container tenha a mesma altura dos seus irmãos na mesma linha.
  <div className="flex flex-col rounded-2xl border border-[#E7E7E7] bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
    
    {/* Este div agrupa todo o conteúdo que deve ficar no topo */}
    <div className="flex-grow">
      <h3 className="text-[18px] font-semibold leading-6 mb-3">{job.title}</h3>
      
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {job.tags.map((t, i) => (
          <Tag key={i} tone={t.tone}>
            {t.label}
          </Tag>
        ))}
      </div>
      
      <div className="grid grid-cols-2 gap-y-3 text-[12px] text-black/70 mb-4">
        <div>
          <div className="font-medium">Data de publicação</div>
          <div className="font-semibold text-black">{job.publishedAt}</div>
        </div>
        <div>
          <div className="font-medium">Prazo de validade</div>
          <div className="font-semibold text-black">{job.expiresAt}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <User size={14} className="text-black/60" />
        <span className="text-[13px] text-black/70">{job.owner}</span>
      </div>
    </div>

    {/* 
      2. O botão está fora do div de conteúdo.
      3. A classe `mt-auto` é a chave. Ela aplica uma margem automática no topo do botão,
         empurrando-o para o final do container flexível (o card).
    */}
    <Button className="mt-auto h-11 w-full rounded-lg bg-[#2D8CDB] hover:bg-[#1F7AC5] mt-6">
      Conferir vaga
    </Button>
  </div>
);

export default JobCard;