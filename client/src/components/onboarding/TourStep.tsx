import { Button } from "@/components/shared/Button";

interface TourStepProps {
  title: string;
  description: string;
  step: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
}

export function TourStep({
  title,
  description,
  step,
  totalSteps,
  onNext,
  onSkip,
}: TourStepProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4 p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-indigo-500 font-medium">
            {step}/{totalSteps}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{description}</p>
        <div className="flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Passer le tour
          </button>
          <Button size="sm" onClick={onNext}>
            {step === totalSteps ? "Terminé" : "Suivant"}
          </Button>
        </div>
      </div>
    </div>
  );
}
