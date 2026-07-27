import Link from "next/link";
import { Trophy, ShieldCheck, Flame, ArrowRight, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative text-center py-16 px-4 overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-orange-500/10 via-amber-500/10 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-4 h-4 text-amber-400" />
            Built on Stellar Soroban Smart Contracts
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Decentralized Accountability with{" "}
            <span className="bg-gradient-to-r from-stellar-orange via-amber-400 to-yellow-300 bg-clip-text text-transparent">
              Staked XLM
            </span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed">
            Turn commitments into reality. Stake XLM into secure Soroban smart contract escrows. Prove completion, claim your reward, or refund on expiration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/create">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base shadow-xl">
                Create Challenge
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-900/80 border-slate-800 hover:border-amber-500/30 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <CardTitle>Soroban Escrow Vault</CardTitle>
            <CardDescription>
              Funds remain safely locked inside an immutable Rust smart contract until verified.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 hover:border-cyan-500/30 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <CardTitle>Verifiable Proofs</CardTitle>
            <CardDescription>
              Participants submit links and hashes proving real-world project or fitness completion.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="bg-slate-900/80 border-slate-800 hover:border-purple-500/30 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2">
              <Flame className="w-6 h-6" />
            </div>
            <CardTitle>Automatic Payouts</CardTitle>
            <CardDescription>
              Inter-contract execution instantly releases XLM to the participant upon verification.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>
    </div>
  );
}
