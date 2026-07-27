import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CreateChallengeForm } from "@/components/challenge/create-challenge-form";
import { QueryProvider } from "@/components/providers/query-provider";

describe("CreateChallengeForm Component", () => {
  it("renders form titles and inputs correctly", () => {
    render(
      <QueryProvider>
        <CreateChallengeForm />
      </QueryProvider>
    );

    expect(screen.getByText("Create New Challenge")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Complete 100 LeetCode Problems in 30 Days")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("G...")).toBeInTheDocument();
    expect(screen.getByText("Connect Wallet to Lock Funds")).toBeInTheDocument();
  });
});
