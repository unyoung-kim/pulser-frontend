import { useAuth } from "@clerk/nextjs"; // Replace NextAuth with Clerk
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Plan {
  name: string;
  price: number;
  credits: number;
}

export function useCheckPaymentStatus() {
  const { isSignedIn } = useAuth(); // Use Clerk's auth hook
  const router = useRouter();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>();

  // Simulated payment check - replace with your actual payment verification logic
  const hasPaid = false;

  const handlePlanSelection = useCallback(
    (plan: Plan) => {
      if (!isSignedIn) {
        return;
      }

      // If user is signed in but hasn't paid, show payment modal
      if (!hasPaid) {
        setSelectedPlan(plan);
        setIsPaymentModalOpen(true);
        return;
      }
    },
    [isSignedIn, hasPaid]
  );

  const closePaymentModal = useCallback(() => {
    setIsPaymentModalOpen(false);
    setSelectedPlan(undefined);
  }, []);

  return {
    isPaymentModalOpen,
    selectedPlan,
    handlePlanSelection,
    closePaymentModal,
    isAuthenticated: isSignedIn,
    hasPaid,
  };
}
