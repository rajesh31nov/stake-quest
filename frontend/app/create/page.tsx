import { CreateChallengeForm } from "@/components/challenge/create-challenge-form";

export const metadata = {
  title: "Create Challenge - StakeQuest",
  description: "Create a new accountability challenge and stake XLM in Soroban smart contract escrow.",
};

export default function CreateChallengePage() {
  return (
    <div className="py-6">
      <CreateChallengeForm />
    </div>
  );
}
