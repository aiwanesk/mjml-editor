import { useState } from "react";
import { TourStep } from "./TourStep";

interface GuidedTourProps {
  onComplete: () => void;
}

const STEPS = [
  {
    target: "[data-tour='import']",
    title: "Importer un template",
    description: "Glissez un fichier .mjml ici ou cliquez pour parcourir vos fichiers. Vous pouvez aussi créer un template vierge.",
  },
  {
    target: "[data-tour='grid']",
    title: "Vos templates",
    description: "Retrouvez tous vos templates ici. Cliquez sur un template pour l'éditer.",
  },
  {
    target: "[data-tour='preview']",
    title: "Aperçu en temps réel",
    description: "Visualisez votre email en temps réel. Cliquez sur un élément pour le sélectionner et le modifier.",
  },
  {
    target: "[data-tour='widgets']",
    title: "Bibliothèque de widgets",
    description: "Glissez-déposez des widgets pour ajouter du contenu : texte, images, boutons, etc.",
  },
  {
    target: "[data-tour='export']",
    title: "Exporter",
    description: "Exportez votre template en HTML ou en PNG pour l'utiliser dans votre outil d'emailing.",
  },
];

export function GuidedTour({ onComplete }: GuidedTourProps) {
  const [step, setStep] = useState(0);

  const currentStep = STEPS[step];

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <TourStep
      title={currentStep.title}
      description={currentStep.description}
      step={step + 1}
      totalSteps={STEPS.length}
      onNext={handleNext}
      onSkip={handleSkip}
    />
  );
}
