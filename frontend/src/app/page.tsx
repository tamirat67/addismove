import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { MapPin, ArrowRight, Bus, Train, Shuffle } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
      {/* Search Section */}
      <Card className="border-0 shadow-lg bg-white overflow-hidden relative">
        <div className="absolute top-0 w-full h-2 bg-[#060267]"></div>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#060267]">Where to?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input placeholder="From: e.g. Megenagna" className="pl-10 border-gray-200 focus-visible:ring-[#92c01f]" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input placeholder="To: e.g. Piassa" className="pl-10 border-gray-200 focus-visible:ring-[#92c01f]" />
          </div>
          <Link href="/results" className="block">
            <Button className="w-full bg-[#060267] hover:bg-[#060267]/90 text-white shadow-md text-base h-12 rounded-xl transition-all active:scale-[0.98]">
              Search Routes <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Transport Options */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3 px-1 tracking-wider">Quick Select</h3>
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 border-gray-200 hover:border-[#49a5d7] hover:bg-[#49a5d7]/5 rounded-xl transition-all">
            <div className="w-10 h-10 rounded-full bg-[#49a5d7]/10 flex items-center justify-center text-[#49a5d7]">
              <Bus className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Bus Only</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 border-gray-200 hover:border-[#92c01f] hover:bg-[#92c01f]/5 rounded-xl transition-all">
            <div className="w-10 h-10 rounded-full bg-[#92c01f]/10 flex items-center justify-center text-[#92c01f]">
              <Train className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-gray-700">Train Only</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4 border-gray-200 hover:border-[#060267] hover:bg-[#060267]/5 rounded-xl transition-all border-[#060267]/20 bg-[#060267]/5">
            <div className="w-10 h-10 rounded-full bg-[#060267] flex items-center justify-center text-white shadow-sm ring-2 ring-white">
              <Shuffle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-[#060267]">Combined</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
