import React, { useRef } from "react";
import SignaturePad from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { RotateCcw, Pen } from "lucide-react";

const SignatureCanvas = ({ signature, setSignature }) => {
  const sigPad = useRef(null);

  const clear = () => {
    sigPad.current.clear();
    setSignature(null);
  };

  const handleEnd = () => {
    setSignature(sigPad.current.toDataURL("image/png"));
  };

  return (
    <div className="relative w-full">
      <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full pointer-events-none">
        {!signature && (
          <p className="text-gray-400 flex items-center gap-2">
            <Pen className="h-4 w-4" />
            Draw your signature here
          </p>
        )}
      </div>
      <SignaturePad
        ref={sigPad}
        onEnd={handleEnd}
        canvasProps={{
          className: "w-full h-48 bg-slate-50 border border-input rounded-lg",
        }}
      />
      <div className="absolute top-2 right-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={clear}
          className="flex items-center gap-2 text-xs text-muted-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          Clear
        </Button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
