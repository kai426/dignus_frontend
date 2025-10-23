import { EvenToken, OddToken } from "./tokens";

export function Matrix() {
  return (
    <div className="flex justify-center my-6 h-[300px]">
      <div className="grid grid-cols-2 grid-rows-2 gap-1.5 bg-[#333] p-2.5 rounded-xl border-[3px] border-[#333]">
        <div className="rv-cell" aria-label="Quadro 1: um ímpar">
          <div className="rv-num">1</div>
          <OddToken />
        </div>
        <div className="rv-cell" aria-label="Quadro 2: dois pares">
          <div className="rv-num">2</div>
          <EvenToken />
          <EvenToken />
        </div>
        <div className="rv-cell" aria-label="Quadro 3: três ímpares">
          <div className="rv-num">3</div>
          <OddToken />
          <OddToken />
          <OddToken />
        </div>
        <div className="rv-cell empty" aria-label="Quadro 4: em falta">
          <span className="text-gray-400 font-bold text-2xl">?</span>
        </div>
      </div>
    </div>
  );
}