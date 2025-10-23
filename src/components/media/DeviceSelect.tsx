import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMediaDevicesQuery } from "@/hooks/useMediaDevicesQuery";
import { useMediaStore } from "@/store/useMediaStore";

export default function DeviceSelect() {
  const { data } = useMediaDevicesQuery();
  const cameraId = useMediaStore((s) => s.cameraId);
  const micId = useMediaStore((s) => s.micId);
  const setCamera = useMediaStore((s) => s.setCamera);
  const setMic = useMediaStore((s) => s.setMic);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Câmera</Label>
        <Select value={cameraId} onValueChange={setCamera}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecionar câmera" />
          </SelectTrigger>
          <SelectContent>
            {data?.cameras.map((c) => (
              <SelectItem key={c.deviceId} value={c.deviceId}>
                {c.label || "Câmera"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Microfone</Label>
        <Select value={micId} onValueChange={setMic}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecionar microfone" />
          </SelectTrigger>
          <SelectContent>
            {data?.mics.map((m) => (
              <SelectItem key={m.deviceId} value={m.deviceId}>
                {m.label || "Microfone"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
