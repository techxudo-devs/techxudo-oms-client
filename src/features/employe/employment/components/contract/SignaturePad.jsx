import { useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const SignaturePad = ({ onSave, disabled }) => {
  const sigCanvas = useRef(null);

  const clearSignature = () => sigCanvas.current?.clear();

  const saveSignature = () => {
    if (sigCanvas.current?.isEmpty()) {
      return;
    }
    const dataURL = sigCanvas.current.toDataURL("image/png");
    onSave(dataURL);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-gray-300 rounded-lg bg-white">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            width: 500,
            height: 200,
            className: "signature-canvas",
          }}
          penColor="black"
          backgroundColor="white"
          clearOnResize={false}
          disabled={disabled}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={clearSignature}
          disabled={disabled}
          className="flex items-center space-x-2"
        >
          <Trash2 size={16} />
          Clear Signature
        </Button>
      </div>

      <p className="text-sm text-gray-200">
        Please sign within the box above using your mouse or touchscreen.
      </p>
    </div>
  );
};

export default SignaturePad;
