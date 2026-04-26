import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface SessionWarningModalProps {
  open: boolean;
  onExtend: () => void;
  onLogout: () => void;
  secondsLeft?: number;
}

export function SessionWarningModal({
  open,
  onExtend,
  onLogout,
  secondsLeft = 60,
}: SessionWarningModalProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <DialogTitle>Sesi Akan Berakhir</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            Sesi Anda akan berakhir dalam {secondsLeft} detik karena tidak ada
            aktivitas.
            <br />
            Klik "Perpanjang Sesi" untuk tetap login.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onLogout}>
            Logout Sekarang
          </Button>
          <Button onClick={onExtend} className="bg-blue-600 hover:bg-blue-700">
            Perpanjang Sesi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
