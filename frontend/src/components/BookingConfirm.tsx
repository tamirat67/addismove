"use client";

import { useState } from "react";
import { useTenant, TicketData } from "@/context/TenantContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Bus,
  Train,
  Shuffle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface BookingConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  routeData: {
    name: string;
    type: string;
    price: number;
    duration: string;
  };
}

export function BookingConfirm({ isOpen, onClose, routeData }: BookingConfirmProps) {
  const { balance, deductBalance, addTransaction, addTicket } = useTenant();
  const [step, setStep] = useState<"confirm" | "processing" | "success" | "error">("confirm");
  const router = useRouter();

  const handleConfirm = () => {
    setStep("processing");
    
    setTimeout(() => {
      const success = deductBalance(routeData.price);
      
      if (success) {
        addTransaction({
          type: "Ticket Purchase",
          amount: -routeData.price,
          status: "Success",
        });
        
        addTicket({
          route: routeData.name,
          type: routeData.type,
          price: routeData.price,
          expiry: "Today, 6:00 PM",
        });
        
        setStep("success");
      } else {
        setStep("error");
      }
    }, 1500);
  };

  const Icon = routeData.type === "Combined" ? Shuffle : routeData.type === "Train" ? Train : Bus;

  return (
    <Dialog open={isOpen} onOpenChange={(val) => { if(!val) onClose(); if(!val) setStep("confirm"); }}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <div className="bg-[#060267] p-6 text-white text-center">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-bold mx-auto">
              {step === "success" ? "Booking Confirmed!" : "Confirm Booking"}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6 bg-slate-50 min-h-[300px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-6"
              >
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-4 text-[#060267]">
                    <div className="p-2 bg-[#060267]/10 rounded-lg">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold">{routeData.name}</span>
                  </div>
                  <div className="space-y-2 text-sm border-t pt-4">
                    <div className="flex justify-between text-gray-500">
                      <span>Duration</span>
                      <span className="font-semibold text-gray-900">{routeData.duration}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Fare Price</span>
                      <span className="font-bold text-[#060267]">{routeData.price} ETB</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-center justify-between ${balance < routeData.price ? "bg-red-50 border-red-100" : "bg-white border-gray-100"}`}>
                  <div className="flex items-center gap-2">
                    <CreditCard className={`w-4 h-4 ${balance < routeData.price ? "text-red-500" : "text-gray-400"}`} />
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Your Balance</span>
                  </div>
                  <span className={`font-black ${balance < routeData.price ? "text-red-600" : "text-gray-900"}`}>
                    {balance.toFixed(2)} ETB
                  </span>
                </div>

                {balance < routeData.price && (
                  <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Insufficient balance. Please top up.
                  </p>
                )}
              </motion.div>
            )}

            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 space-y-4"
              >
                <Loader2 className="w-12 h-12 animate-spin text-[#060267] mx-auto" />
                <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Processing Payment...</p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase">Success!</h3>
                  <p className="text-sm text-gray-500 font-medium">Ticket has been added to your account</p>
                </div>
              </motion.div>
            )}

            {step === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-4"
              >
                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white mx-auto">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Payment Failed</h3>
                <p className="text-sm text-gray-500">Something went wrong. Please try again.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex gap-3">
            {step === "confirm" && (
              <>
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={onClose}>Cancel</Button>
                <Button 
                  className="flex-[2] h-12 bg-[#060267] hover:bg-[#060267]/90 text-white font-bold rounded-xl shadow-md"
                  disabled={balance < routeData.price}
                  onClick={handleConfirm}
                >
                  Pay {routeData.price} ETB
                </Button>
              </>
            )}
            {step === "success" && (
              <Button 
                className="w-full h-12 bg-gray-900 hover:bg-black text-white font-bold rounded-xl shadow-md"
                onClick={() => { onClose(); router.push("/ticket"); }}
              >
                View Digital Ticket
              </Button>
            )}
            {step === "error" && (
              <Button 
                className="w-full h-12 bg-gray-900 text-white font-bold rounded-xl"
                onClick={() => setStep("confirm")}
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
