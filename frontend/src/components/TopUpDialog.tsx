"use client";

import { useState } from "react";
import { useTenant } from "@/context/TenantContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  ChevronRight, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  Loader2,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Step = "amount" | "provider" | "details" | "otp" | "success";
type Provider = "Telebirr" | "CBE";

export function TopUpDialog() {
  const { addBalance, addTransaction } = useTenant();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState<number>(100);
  const [provider, setProvider] = useState<Provider>("Telebirr");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStep("amount");
    setAmount(100);
    setLoading(false);
  };

  const handleNext = () => {
    if (step === "amount") setStep("provider");
    else if (step === "provider") setStep("details");
    else if (step === "details") setStep("otp");
    else if (step === "otp") {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep("success");
        addBalance(amount);
        addTransaction({
          type: `${provider} Top Up`,
          amount: amount,
          provider: provider,
          status: "Success",
        });
      }, 2000);
    }
  };

  const handleBack = () => {
    if (step === "provider") setStep("amount");
    else if (step === "details") setStep("provider");
    else if (step === "otp") setStep("details");
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val) reset(); }}>
      <DialogTrigger 
        render={
          <Button className="flex-1 bg-[#FFD600] hover:bg-[#FFD600]/90 text-[#CC1F1F] shadow-lg font-black uppercase tracking-widest h-14 rounded-2xl border border-[#CC1F1F]/10 transition-all active:scale-[0.98] items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> RECHARGE
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-0 shadow-3xl rounded-[2.5rem]">
        <div className="bg-[#CC1F1F] p-8 text-white relative">
          <DialogHeader>
            <DialogTitle className="text-white text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
              {step !== "amount" && step !== "success" && (
                <div className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors cursor-pointer" onClick={handleBack}>
                  <ArrowLeft className="w-5 h-5 text-white" />
                </div>
              )}
              {step === "success" ? "Operation Successful" : "Quick Recharge"}
            </DialogTitle>
          </DialogHeader>
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute -left-2 -top-2 w-16 h-16 bg-[#FFD600]/20 rounded-full blur-xl"></div>
        </div>

        <div className="p-8 bg-white min-h-[350px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === "amount" && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select ETB Amount</p>
                <div className="grid grid-cols-2 gap-4">
                  {[50, 100, 250, 500].map((val) => (
                    <Button
                      key={val}
                      variant={amount === val ? "default" : "outline"}
                      onClick={() => setAmount(val)}
                      className={`h-16 text-lg font-black rounded-2xl transition-all border-2 ${
                        amount === val ? "bg-[#CC1F1F] border-[#CC1F1F] text-white shadow-xl scale-[1.03]" : "bg-white border-slate-100 text-slate-800 hover:border-[#CC1F1F]/30"
                      }`}
                    >
                      {val} <span className="text-[10px] ml-1 opacity-60">ETB</span>
                    </Button>
                  ))}
                </div>
                <div className="relative group">
                  <Input 
                    type="number" 
                    placeholder="Enter Custom Amount" 
                    value={amount || ""}
                    className="h-16 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-[#CC1F1F] text-center font-black text-xl text-slate-900 transition-all placeholder:text-[10px] placeholder:tracking-widest placeholder:uppercase placeholder:text-slate-300"
                    onChange={(e) => setAmount(e.target.value === "" ? 0 : Number(e.target.value))}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase">Custom</div>
                </div>
              </motion.div>
            )}

            {step === "provider" && (
              <motion.div
                key="provider"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Provider</p>
                <div 
                  onClick={() => setProvider("Telebirr")}
                  className={`p-5 rounded-[2rem] border-2 flex items-center justify-between cursor-pointer transition-all shadow-sm ${
                    provider === "Telebirr" ? "border-[#FFD600] bg-[#FFD600]/5 shadow-xl scale-[1.02]" : "border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-emerald-500/20">t</div>
                    <div>
                      <p className="font-black text-slate-900 tracking-tight text-lg">Telebirr</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Instant Mobile Money</p>
                    </div>
                  </div>
                  {provider === "Telebirr" && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                </div>

                <div 
                  onClick={() => setProvider("CBE")}
                  className={`p-5 rounded-[2rem] border-2 flex items-center justify-between cursor-pointer transition-all shadow-sm ${
                    provider === "CBE" ? "border-[#CC1F1F] bg-[#CC1F1F]/5 shadow-xl scale-[1.02]" : "border-slate-50 bg-slate-50 hover:bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#CC1F1F] rounded-2xl flex items-center justify-center text-[#FFD600] font-black shadow-lg shadow-red-500/20">CBE</div>
                    <div>
                      <p className="font-black text-slate-900 tracking-tight text-lg">CBE Birr</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Bank Direct Transfer</p>
                    </div>
                  </div>
                  {provider === "CBE" && <CheckCircle2 className="w-6 h-6 text-[#CC1F1F]" />}
                </div>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                   Identity Validation
                </p>
                <div className="relative">
                  {provider === "Telebirr" ? <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" /> : <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />}
                  <Input 
                    placeholder={provider === "Telebirr" ? "Phone Number (09...)" : "CBE Account Number"}
                    className="pl-14 h-16 bg-slate-50 rounded-2xl border-2 border-slate-100 focus:border-[#CC1F1F] font-bold text-lg transition-all" 
                  />
                </div>
                <div className="bg-[#FFD60010] p-4 rounded-2xl border border-[#FFD60030]">
                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest leading-loose">
                        SECURE PROTOCOL: BY PROCEEDING, YOU AUTHORIZE <span className="text-[#CC1F1F]">ANBESSA BUS</span> TO REQUEST A VALID TRANSACTION FROM YOUR {provider} ACCOUNT.
                    </p>
                </div>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-8 text-center"
              >
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Verification Required</p>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-tight">A 4-digit security code was sent to your phone</p>
                </div>
                <div className="flex justify-center gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-14 h-16 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center justify-center font-black text-2xl text-[#CC1F1F] shadow-inner group-focus-within:border-[#FFD600]">
                      {i === 1 ? "•" : i === 2 ? "•" : ""}
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-[#CC1F1F] font-black uppercase tracking-widest cursor-pointer hover:text-[#CC1F1F]/80 transition-colors">Resend Security Code (45s)</p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                <div className="relative inline-block">
                    <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/40 animate-bounce">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-[#FFD600] rounded-full border-4 border-white flex items-center justify-center">
                        <Plus className="w-4 h-4 text-[#CC1F1F]" />
                    </div>
                </div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{amount}.00 <span className="text-lg opacity-40 uppercase">ETB</span></h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-2">Added to Anbessa Pro Wallet</p>
                </div>
                <div className="p-4 rounded-2xl border-2 border-slate-50 text-left bg-slate-50/50">
                  <div className="flex justify-between text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                    <span>Audit Trail ID</span>
                    <span className="text-[#CC1F1F]">ANB-{Math.floor(Math.random()*1000000)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10">
            {step !== "success" ? (
              <Button 
                onClick={handleNext}
                disabled={loading}
                className="w-full h-16 bg-[#CC1F1F] hover:bg-[#991B1B] text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-500/20 transition-all active:scale-[0.98] border border-white/10"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <> {step === "otp" ? "Confirm Payment" : "Validate & Continue"} <ChevronRight className="ml-2 w-5 h-5" /> </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={() => setOpen(false)}
                className="w-full h-16 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/20"
              >
                Close Portal
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
