// src/hooks/useMediaDevicesQuery.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export type DevicesResult = {
  cameras: MediaDeviceInfo[];
  mics: MediaDeviceInfo[];
};

async function enumerate(): Promise<DevicesResult> {
  // NÃO chamamos getUserMedia aqui; sem prompt automático
  const all = await navigator.mediaDevices.enumerateDevices();
  return {
    cameras: all.filter((d) => d.kind === "videoinput"),
    mics: all.filter((d) => d.kind === "audioinput"),
  };
}

export function useMediaDevicesQuery() {
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ["mediaDevices"],
    queryFn: enumerate,
    staleTime: 60_000,
  });

  // refetch quando dispositivos mudarem
  useEffect(() => {
    const h = () => qc.invalidateQueries({ queryKey: ["mediaDevices"] });
    navigator.mediaDevices?.addEventListener?.("devicechange", h);
    return () => navigator.mediaDevices?.removeEventListener?.("devicechange", h);
  }, [qc]);

  return query;
}
