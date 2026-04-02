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
          <Button className="flex-1 bg-[#92c01f] hover:bg-[#7fa81a] text-white shadow font-semibold h-11 rounded-lg">
            <Plus className="w-4 h-4 mr-1.5" /> Top Up
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <div className="bg-[#060267] p-6 text-white relative">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold flex items-center gap-2">
              {step !== "amount" && step !== "success" && (
                <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={handleBack} />
              )}
              {step === "success" ? "Payment Successful" : "Recharge Wallet"}
            </DialogTitle>
          </DialogHeader>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="p-6 bg-slate-50 min-h-[300px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === "amount" && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Select Amount</p>
                <div className="grid grid-cols-2 gap-3">
                  {[50, 100, 200, 500].map((val) => (
                    <Button
                      key={val}
                      variant={amount === val ? "default" : "outline"}
                      onClick={() => setAmount(val)}
                      className={`h-14 text-lg font-bold rounded-xl transition-all ${
                        amount === val ? "bg-[#060267] text-white scale-[1.02]" : "bg-white text-gray-700"
                      }`}
                    >
                      {val} ETB
                    </Button>
                  ))}
                </div>
                <Input 
                  type="number" 
                  placeholder="Custom Amount" 
                  className="h-12 bg-white rounded-xl border-gray-200 text-center font-bold"
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
              </motion.div>
            )}

            {step === "provider" && (
              <motion.div
                key="provider"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Payment Method</p>
                <div 
                  onClick={() => setProvider("Telebirr")}
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    provider === "Telebirr" ? "border-[#14B8A6] bg-[#14B8A6]/5" : "border-white bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#14B8A6] rounded-full flex items-center justify-center text-white font-black italic">t</div>
                    <div>
                      <p className="font-bold text-gray-900">Telebirr</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Mobile Money</p>
                    </div>
                  </div>
                  {provider === "Telebirr" && <CheckCircle2 className="w-5 h-5 text-[#14B8A6]" />}
                </div>

                <div 
                  onClick={() => setProvider("CBE")}
                  className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                    provider === "CBE" ? "border-[#0A1E5E] bg-[#0A1E5E]/5" : "border-white bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0A1E5E] rounded-full flex items-center justify-center text-[#FDB813] font-bold">CBE</div>
                    <div>
                      <p className="font-bold text-gray-900">CBE Birr</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Bank Account</p>
                    </div>
                  </div>
                  {provider === "CBE" && <CheckCircle2 className="w-5 h-5 text-[#0A1E5E]" />}
                </div>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  {provider === "Telebirr" ? "Phone Number" : "Account Number"}
                </p>
                <div className="relative">
                  {provider === "Telebirr" ? <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" /> : <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />}
                  <Input 
                    placeholder={provider === "Telebirr" ? "0912..." : "1000..."}
                    className="pl-10 h-12 bg-white rounded-xl border-gray-200" 
                  />
                </div>
                <p className="text-[10px] text-gray-400 font-medium px-1 leading-relaxed">
                  By proceeding, you authorize AddisMove to request a payment from your {provider} account.
                </p>
              </motion.div>
            )}

            {step === "otp" && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 text-center"
              >
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Enter OTP</p>
                  <p className="text-xs text-gray-400">A 4-digit code was sent to your phone</p>
                </div>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-12 h-14 bg-white border border-gray-200 rounded-xl flex items-center justify-center font-black text-xl text-[#060267]">
                      {i === 1 ? "•" : i === 2 ? "•" : ""}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#060267] font-bold cursor-pointer hover:underline">Resend Code (45s)</p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-green-200">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900">{amount} ETB</h3>
                  <p className="text-sm text-gray-500 font-medium">Added to your Wallet</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-gray-100 text-left">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                    <span>Transaction ID</span>
                    <span className="text-gray-900">#AM-{Math.floor(Math.random()*1000000)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8">
            {step !== "success" ? (
              <Button 
                onClick={handleNext}
                disabled={loading}
                className="w-full h-12 bg-[#060267] hover:bg-[#060267]/90 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <> {step === "otp" ? "Confirm Payment" : "Continue"} <ChevronRight className="ml-2 w-4 h-4" /> </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={() => setOpen(false)}
                className="w-full h-12 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md"
              >
                Done
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
