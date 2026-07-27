export function parseStellarError(error: any): string {
  if (!error) return "An unknown error occurred.";

  const message = typeof error === "string" ? error : error.message || JSON.stringify(error);

  if (message.includes("User rejected") || message.includes("Declined")) {
    return "Transaction was cancelled in your wallet.";
  }

  if (message.includes("op_underfunded") || message.includes("Insufficient balance")) {
    return "Insufficient XLM balance in your wallet to perform this action.";
  }

  if (message.includes("SelfChallengeNotAllowed") || message.includes("HostError(Error(Contract, #6))")) {
    return "You cannot challenge yourself. Please specify a different participant address.";
  }

  if (message.includes("InvalidAmount")) {
    return "Challenge stake amount must be greater than 0 XLM.";
  }

  if (message.includes("InvalidDuration")) {
    return "Challenge duration must be at least 1 day.";
  }

  if (message.includes("txFailed") || message.includes("Transaction Failed")) {
    return "Transaction failed on Stellar network. Please verify parameters and try again.";
  }

  return message.slice(0, 150);
}
