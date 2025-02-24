import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  ListTodo,
  AlertTriangle,
  Ban,
  Settings,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const tutorialSteps = [
  {
    title: "Welcome to Member Portal!",
    description: "Let's take a quick tour of your new dashboard.",
    icon: LayoutDashboard,
    highlight: ".dashboard-welcome",
  },
  {
    title: "Task Management",
    description: "View and manage your assigned tasks here.",
    icon: ListTodo,
    highlight: ".task-section",
  },
  {
    title: "Warnings",
    description: "Check any warnings issued to your account.",
    icon: AlertTriangle,
    highlight: ".warnings-section",
  },
  {
    title: "Bans",
    description: "View any active or past bans on your account.",
    icon: Ban,
    highlight: ".bans-section",
  },
  {
    title: "Settings",
    description: "Customize your profile and preferences.",
    icon: Settings,
    highlight: ".settings-section",
  },
];

export function OnboardingTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { user } = useAuth();

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsVisible(false);
      localStorage.setItem(`tutorial-completed-${user?.id}`, 'true');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  useEffect(() => {
    // Check if user has completed the tutorial
    const hasCompletedTutorial = localStorage.getItem(`tutorial-completed-${user?.id}`);
    if (hasCompletedTutorial) {
      setIsVisible(false);
    }

    // Add highlight class to current element
    const currentHighlight = tutorialSteps[currentStep].highlight;
    const element = document.querySelector(currentHighlight);
    if (element) {
      element.classList.add('tutorial-highlight');
    }

    return () => {
      // Cleanup highlight
      const element = document.querySelector(currentHighlight);
      if (element) {
        element.classList.remove('tutorial-highlight');
      }
    };
  }, [currentStep, user?.id]);

  if (!isVisible) return null;

  const step = tutorialSteps[currentStep];
  const Icon = step.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <Card className="p-6 shadow-lg w-[400px] bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="space-x-1">
              {tutorialSteps.map((_, index) => (
                <span
                  key={index}
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    index === currentStep ? 'bg-primary' : 'bg-primary/20'
                  }`}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextStep}
            >
              {currentStep === tutorialSteps.length - 1 ? (
                'Finish'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
