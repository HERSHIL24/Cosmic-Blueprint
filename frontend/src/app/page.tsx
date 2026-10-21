"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateNumerology, generateKundli, fetchNumberData } from "@/lib/api";
import { getProbableRashiFromName, generateConvergenceReport, fetchJson } from "@/lib/coordination";
import dynamic from "next/dynamic";
import { KundliChart } from "@/components/KundliChart";
import { NumerologyReport } from "@/components/NumerologyReport";
import { LoShuGrid } from "@/components/LoShuGrid";
import { CosmicScoreboard } from "@/components/CosmicScoreboard";
import { RashiExplorer } from "@/components/RashiExplorer";
import { ConvergenceMap } from "@/components/ConvergenceMap";
import { ArchitectureModal } from "@/components/ArchitectureModal";
import { NamologyTriadCard } from "@/components/NamologyTriadCard";
import { PredictiveLifeDossier } from "@/components/PredictiveLifeDossier";
import { Brain, Briefcase, Users, Compass, Sparkles, Cpu, Layers, Heart, Globe, Award, Printer } from "lucide-react";

const CosmicBackground = dynamic(() => import("@/components/CosmicBackground").then(mod => mod.CosmicBackground), { ssr: false });

export default function Home() {
  const [step, setStep] = useState(0); 
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [gender, setGender] = useState("M");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "namology" | "career" | "marriage" | "kundli">("all");
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  
  const [numerologyData, setNumerologyData] = useState<any>(null);
  const [kundliData, setKundliData] = useState<any>(null);
  const [coordinationData, setCoordinationData] = useState<any>(null);
  const [allRashis, setAllRashis] = useState<any[]>([]);

  const handleExportPDF = () => {
    const formattedName = (name || "Seeker").trim().replace(/\s+/g, "_");
    const originalTitle = document.title;
    document.title = `CosmicBlueprint_${formattedName}`;

    // Ensure all sections are active for print
    const prevTab = activeTab;
    setActiveTab("all");

    // Allow React state to render before triggering browser print
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
        setActiveTab(prevTab);
      }, 1000);
    }, 150);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStep(2); 

    try {
      // Resolve coordinates dynamically based on place
      let lat = 21.7615; // Western India / Gujarat default
      let lon = 70.6276;
      const lowerPlace = (place || "").toLowerCase();
      if (lowerPlace.includes("delhi")) { lat = 28.6139; lon = 77.2090; }
      else if (lowerPlace.includes("mumbai")) { lat = 19.0760; lon = 72.8777; }
      else if (lowerPlace.includes("ahmedabad")) { lat = 23.0225; lon = 72.5714; }
      else if (lowerPlace.includes("rajkot") || lowerPlace.includes("jetpur")) { lat = 21.7615; lon = 70.6276; }
      else if (lowerPlace.includes("surat")) { lat = 21.1702; lon = 72.8311; }

      const [numData, kData, rashisDb, planetsDb] = await Promise.all([
        calculateNumerology(name, dob),
        generateKundli(dob, time || "12:00", lat, lon),
        fetchJson('/data/rashis.json'),
        fetchJson('/data/planets.json'),
      ]);

      const [mulankInfo, bhagyankInfo, namankInfo] = await Promise.all([
        fetchNumberData(numData.mulank),
        fetchNumberData(numData.bhagyank),
        fetchNumberData(numData.namank)
      ]);

      setAllRashis(rashisDb);
      setNumerologyData(numData);
      setKundliData(kData);

      const nameRashi = getProbableRashiFromName(name, rashisDb);
      // In Vedic Jyotish, personal Rashi is always Chandra Rashi (Moon sign) or Name Rashi
      const actualRashi = rashisDb.find((r: any) => r.rashi === kData.moonRashi) || 
                          rashisDb.find((r: any) => r.rashi === nameRashi?.rashi) || 
                          null;
      
      const coord = generateConvergenceReport(nameRashi, actualRashi, mulankInfo, bhagyankInfo, namankInfo, planetsDb);
      
      setCoordinationData({
        ...coord,
        nameRashi,
        actualRashi,
        mulankInfo,
        bhagyankInfo,
        namankInfo
      });

      // Brief animation before showing dashboard
      setTimeout(() => {
        setStep(3);
        setIsLoading(false);
      }, 1000);

    } catch (err) {
      console.error("Calculation Error:", err);
      setIsLoading(false);
      setStep(1);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background text-foreground flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-primary-foreground">
      <CosmicBackground />

      {/* Architecture & Telemetry Modal */}
      <ArchitectureModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      <div className="z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-center text-center mt-20">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="hero"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="space-y-8 max-w-2xl px-4"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5" /> Polyglot Cosmic Intelligence Platform
                </div>
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-extrabold tracking-tight text-foreground">
                  The Cosmic Blueprint
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-light">
                  Uniting Vedic Astrological Ephemeris, Esoteric Chaldean Namology, and Pythagorean Numerology into an enterprise-grade convergence matrix.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={() => setStep(1)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-8 py-6 rounded-full shadow-lg shadow-primary/20 text-base transition-all duration-300 transform hover:scale-105"
                >
                  Synthesize My Cosmic Profile
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsArchitectureModalOpen(true)}
                  className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 px-6 py-6 rounded-full text-base flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4 text-amber-400" />
                  System Architecture
                </Button>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-xl bg-card/60 backdrop-blur-xl border border-border/50 p-6 sm:p-10 rounded-3xl shadow-2xl relative text-left"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
                  Temporal & Phonetic Coordinates
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Enter your foundational birth data for multi-dimensional cosmic alignment
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Legal Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Hershil Mehta" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    required 
                    className="bg-background/50 border-border/50 h-12 text-foreground focus:ring-primary"
                  />
                  <p className="text-[11px] text-muted-foreground">Used for individual First Name, Last Name, and Combined Chaldean vibrational analysis.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dob" className="text-sm font-medium">Date of Birth</Label>
                    <Input 
                      id="dob" 
                      type="date" 
                      value={dob} 
                      onChange={e => setDob(e.target.value)} 
                      required 
                      className="bg-background/50 border-border/50 h-12 text-foreground focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm font-medium">Exact Time of Birth</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={time} 
                      onChange={e => setTime(e.target.value)} 
                      className="bg-background/50 border-border/50 h-12 text-foreground focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="place" className="text-sm font-medium">City of Birth</Label>
                  <Input 
                    id="place" 
                    placeholder="e.g. Mumbai, India" 
                    value={place} 
                    onChange={e => setPlace(e.target.value)} 
                    className="bg-background/50 border-border/50 h-12 text-foreground focus:ring-primary"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setStep(0)} 
                    className="border-border/50 h-12 px-6 rounded-xl hover:bg-muted/50"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-xl font-medium shadow-md shadow-primary/20"
                  >
                    {isLoading ? "Aligning Ephemeris..." : "Synthesize Profile"}
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center space-y-6"
            >
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
                <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-serif text-foreground">Computing Microservices Blueprint</h3>
                <p className="text-sm text-muted-foreground">Querying Node Mathematical Engine & Django API Gateway...</p>
              </div>
            </motion.div>
          )}

          {step === 3 && coordinationData && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-6xl pb-24 text-left"
            >
              {/* Astrotalk-Grade Print Cover Header (Exclusively rendered in PDF Print) */}
              <div className="hidden print:block mb-8 pb-6 border-b-2 border-primary/50 avoid-break">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl">
                      ☉
                    </div>
                    <div>
                      <h1 className="text-2xl font-serif font-extrabold text-white tracking-wider">COSMIC BLUEPRINT DOSSIER</h1>
                      <p className="text-[10px] text-amber-400 uppercase tracking-widest font-medium">Vedic Astrology & Chaldean Numerology Intelligence</p>
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-300">
                    <div className="font-extrabold text-white text-base uppercase tracking-wider">{name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">DOB: {dob} • Time: {time || "12:00"} • Place: {place || "Vedic Horizon"}</div>
                    <div className="text-[9px] text-amber-400/90 mt-0.5">Sidereal Ephemeris • Parashari Vedic Standards • Chaldean Triad</div>
                  </div>
                </div>

                {/* Print Quick Planetary & Numerology Matrix */}
                <div className="grid grid-cols-4 gap-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Mulank (Root)</span>
                    <div className="font-extrabold text-amber-400 font-mono text-base">{numerologyData.mulank}</div>
                    <span className="text-[9px] text-slate-400">Ruled by {coordinationData.mulankInfo?.planet || "Venus"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Bhagyank (Destiny)</span>
                    <div className="font-extrabold text-amber-400 font-mono text-base">{numerologyData.bhagyank}</div>
                    <span className="text-[9px] text-slate-400">Ruled by {coordinationData.bhagyankInfo?.planet || "Mercury"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Namank (Chaldean)</span>
                    <div className="font-extrabold text-amber-400 font-mono text-base">{numerologyData.namank}</div>
                    <span className="text-[9px] text-slate-400">Ruled by {coordinationData.namankInfo?.planet || "Ketu"}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Ascendant / Rashi</span>
                    <div className="font-extrabold text-white text-base">{kundliData?.lagnaRashi || coordinationData.nameRashi.rashi}</div>
                    <span className="text-[9px] text-slate-400">Chandra: {coordinationData.nameRashi.rashi}</span>
                  </div>
                </div>
              </div>

              {/* Executive Screen Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-border/50 print:hidden">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> High-Accuracy Synthesis
                  </div>
                  <h2 className="font-serif text-3xl sm:text-5xl text-foreground font-bold">Cosmic Profile Engine</h2>
                  <p className="text-sm sm:text-base text-muted-foreground uppercase tracking-widest mt-1">
                    {name} • Born: {dob} {time ? `• ${time}` : ""} {place ? `• ${place}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 print:hidden">
                  <Button
                    onClick={() => setIsArchitectureModalOpen(true)}
                    variant="outline"
                    className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm flex items-center gap-2"
                  >
                    <Cpu className="w-4 h-4 text-amber-400" />
                    Architecture & Telemetry
                  </Button>
                  <Button 
                    onClick={handleExportPDF} 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-primary/20"
                  >
                    <Printer className="w-4 h-4" />
                    Print / Export PDF Dossier
                  </Button>
                </div>
              </div>

              {/* Dynamic Sub-Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-border/30 print:hidden scrollbar-none">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "all"
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card/80"
                  }`}
                >
                  <Layers className="w-4 h-4" /> Comprehensive View
                </button>
                <button
                  onClick={() => setActiveTab("namology")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "namology"
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card/80"
                  }`}
                >
                  <Award className="w-4 h-4" /> Namology Triad (6-1-7)
                </button>
                <button
                  onClick={() => setActiveTab("career")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "career"
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card/80"
                  }`}
                >
                  <Briefcase className="w-4 h-4" /> Career & Wealth Timeline
                </button>
                <button
                  onClick={() => setActiveTab("marriage")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "marriage"
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card/80"
                  }`}
                >
                  <Heart className="w-4 h-4" /> Love & Marriage Matrix
                </button>
                <button
                  onClick={() => setActiveTab("kundli")}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === "kundli"
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "bg-card/40 text-muted-foreground hover:text-foreground hover:bg-card/80"
                  }`}
                >
                  <Compass className="w-4 h-4" /> Vedic Kundli & Bhavs
                </button>
              </div>

              {/* REPORT BODY */}
              <div id="cosmic-report" className="space-y-14">

                {/* SECTION 1: CORE PILLARS & CONVERGENCE MAP */}
                {(activeTab === "all" || activeTab === "namology") && (
                  <section className="space-y-10 avoid-break">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl sm:text-4xl font-serif text-primary">Cosmic Convergence Map</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest mt-1">
                        Synthesizing your Astrological, Numerological, and Name Vibrations
                      </p>
                    </div>

                    <ConvergenceMap 
                      rashi={coordinationData.actualRashi?.rashi || coordinationData.nameRashi.rashi}
                      mulank={numerologyData.mulank}
                      bhagyank={numerologyData.bhagyank}
                      namank={numerologyData.namank}
                      dominantPlanets={coordinationData.dominantPlanets || ["Sun", "Venus"]}
                    />

                    {/* Core Numbers Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <DashboardCard title="Mulank (Root/Day)" number={numerologyData.mulank} label={`Ruled by ${coordinationData.mulankInfo?.planet || "Venus"}`} />
                      <DashboardCard title="Bhagyank (Destiny/DOB)" number={numerologyData.bhagyank} label={`Ruled by ${coordinationData.bhagyankInfo?.planet || "Mercury"}`} />
                      <DashboardCard title="Namank (Full Name)" number={numerologyData.namank} label={`Ruled by ${coordinationData.namankInfo?.planet || "Ketu"}`} />
                    </div>

                    {/* THE THREEFOLD NAMOLOGY TRIAD */}
                    <div className="pt-4">
                      <NamologyTriadCard
                        triad={numerologyData.nameTriad}
                        name={name}
                      />
                    </div>
                  </section>
                )}

                {/* SECTION 2: CAREER, WEALTH & FUTURE PREDICTIONS */}
                {(activeTab === "all" || activeTab === "career" || activeTab === "marriage") && (
                  <section className="space-y-6 pt-4 avoid-break">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl sm:text-4xl font-serif text-primary">Predictive Life Trajectory</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest mt-1">
                        Deep timeline analysis: Career milestones, wealth grades, marriage & foreign horizon
                      </p>
                    </div>

                    <PredictiveLifeDossier predictions={numerologyData.predictions} />
                  </section>
                )}

                {/* SECTION 3: VEDIC KUNDLI & LO SHU GRID */}
                {(activeTab === "all" || activeTab === "kundli") && (
                  <section className="space-y-10 pt-4 avoid-break">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl sm:text-4xl font-serif text-primary">Vedic Astrology & Lo Shu Matrix</h3>
                      <p className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest mt-1">
                        Planetary house placements (Bhavs) and sacred 3x3 Chinese Lo Shu energetic grid
                      </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                      <div className="bg-card/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border/50">
                        <div className="text-center mb-6">
                          <h4 className="font-serif text-2xl text-primary font-bold">Vedic Kundli (Lagna Chart)</h4>
                          <p className="text-xs text-muted-foreground mt-1">Calculated for {place || "Capital Horizon"} at {time || "12:00"}</p>
                        </div>
                        <KundliChart 
                          houses={kundliData?.houses} 
                          planets={kundliData?.planets} 
                          ascendant={kundliData?.ascendant} 
                          lagnaRashi={kundliData?.lagnaRashi || kundliData?.lagna_rashi} 
                        />
                      </div>

                      <div className="flex flex-col items-center justify-center bg-card/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border/50">
                        <div className="text-center mb-6">
                          <h4 className="font-serif text-2xl text-primary font-bold">Lo Shu Grid Alignment</h4>
                          <p className="text-xs text-muted-foreground mt-1">Feng Shui 3x3 plane energetic concentration</p>
                        </div>
                        {numerologyData.loShuGrid?.grid && (
                          <LoShuGrid counts={numerologyData.loShuGrid.counts || numerologyData.loshu_grid} />
                        )}
                      </div>
                    </div>

                    {/* Vedic Yogas & Astrological Doshas (Astrotalk Standard) */}
                    {kundliData?.yogas && kundliData.yogas.length > 0 && (
                      <div className="p-6 rounded-3xl bg-card/40 backdrop-blur-xl border border-border/50 avoid-break">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-serif text-xl text-primary font-bold">Auspicious Planetary Yogas & Classical Alignments</h4>
                          <span className="text-xs text-amber-400 font-mono">BPHS & Classical Texts</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {kundliData.yogas.map((y: any, i: number) => (
                            <div key={i} className="p-4 rounded-xl bg-background/50 border border-primary/20">
                              <div className="font-bold text-white text-sm mb-1">{y.name}</div>
                              <p className="text-xs text-slate-300 leading-relaxed">{y.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* SECTION 4: STRATEGIC 5-DIMENSIONAL DEPARTMENTS */}
                {activeTab === "all" && coordinationData?.departments && (
                  <section className="space-y-8 pt-4 avoid-break">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl sm:text-4xl font-serif text-primary">Executive Cosmic Blueprint</h3>
                      <p className="text-muted-foreground uppercase tracking-widest text-xs sm:text-sm mt-1">Strategic Multi-Departmental Synthesis</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-card/40 backdrop-blur-xl p-6 rounded-3xl border border-border/50 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/20 p-2.5 rounded-xl text-primary"><Briefcase size={20} /></div>
                          <h4 className="text-lg font-serif font-bold text-foreground">{coordinationData.departments.career?.title || "Professional Domains"}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{coordinationData.departments.career?.workplaceDynamics}</p>
                        <div className="pt-2 border-t border-border/30 text-xs">
                          <span className="text-primary font-bold">Core Domains: </span>
                          <span className="text-slate-300">{coordinationData.departments.career?.domains?.join(" • ")}</span>
                        </div>
                      </div>

                      <div className="bg-card/40 backdrop-blur-xl p-6 rounded-3xl border border-border/50 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/20 p-2.5 rounded-xl text-primary"><Users size={20} /></div>
                          <h4 className="text-lg font-serif font-bold text-foreground">{coordinationData.departments.interpersonal?.title || "Interpersonal Dynamics"}</h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{coordinationData.departments.interpersonal?.communicationStyle}</p>
                        <div className="pt-2 border-t border-border/30 text-xs">
                          <span className="text-primary font-bold">Social Synergy: </span>
                          <span className="text-slate-300">{coordinationData.departments.interpersonal?.socialSynergy}</span>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Disclaimer */}
                <div className="text-[11px] text-muted-foreground/60 text-center mt-12 pb-12 italic border-t border-border/20 pt-8 max-w-3xl mx-auto">
                  This report unites traditional esoteric Chaldean numerology and Vedic astrology for reflective and personal growth purposes. Interpretations are symbolic models and should not replace licensed legal, financial or medical advice.
                </div>
              </div>

              {/* Rashi Explorer (Interactive at bottom) */}
              <div className="mt-16 print:hidden">
                <div className="text-center mb-8">
                  <h3 className="font-serif text-3xl text-primary">Interactive Vedic Rashi Explorer</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">Explore archetypes, rulers, and elements of all 12 Zodiacs</p>
                </div>
                <RashiExplorer rashis={allRashis} userRashiId={coordinationData.actualRashi?.id || coordinationData.nameRashi?.id} />
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function DashboardCard({ title, number, label }: { title: string, number: number, label: string }) {
  return (
    <div className="bg-card/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-border/50 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors shadow-lg">
      <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-3">{title}</h3>
      <div className="text-5xl sm:text-6xl font-serif text-primary font-bold mb-2 drop-shadow-[0_0_15px_rgba(234,179,8,0.25)]">{number}</div>
      <p className="text-xs sm:text-sm text-foreground/80 font-medium">{label}</p>
    </div>
  );
}
