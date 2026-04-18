/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import { 
  ChevronRight, 
  BrainCircuit, 
  Zap, 
  Target, 
  Crown, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Layers,
  Award,
  CircleArrowRight,
  RefreshCw,
  Sparkles
} from "lucide-react";

// --- Types ---

interface Scenario {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface Option {
  label: string;
  value: string;
  weights: {
    aggressive: number;
    prudent: number;
    social: number;
    growth: number;
  };
}

interface Outcome {
  title: string;
  description: string;
  recommendation: string;
  riskProfile: string;
  confidence: number;
}

// --- Data ---

const SCENARIOS: Scenario[] = [
  {
    id: "career",
    title: "Évolution Stratégique",
    description: "Devriez-vous poursuivre un pivot exécutif à haut risque ou consolider votre position de leadership actuelle ?",
    questions: [
      {
        id: "hours",
        text: "Quelle est votre bande passante cognitive actuelle ?",
        options: [
          { label: "Surplus (12+ heures/jour)", value: "high", weights: { aggressive: 10, prudent: -5, social: -2, growth: 8 } },
          { label: "Optimisé (8 heures intenses)", value: "med", weights: { aggressive: 5, prudent: 5, social: 5, growth: 5 } },
          { label: "Critique (Focus restreint)", value: "low", weights: { aggressive: -10, prudent: 10, social: 2, growth: -5 } },
        ]
      },
      {
        id: "horizon",
        text: "Quel est votre horizon de réussite prioritaire ?",
        options: [
          { label: "Dominance instantanée (6 prochains mois)", value: "short", weights: { aggressive: 15, prudent: -10, social: 5, growth: 2 } },
          { label: "Légat générationnel (5+ ans)", value: "long", weights: { aggressive: 2, prudent: 15, social: 8, growth: 15 } },
        ]
      },
      {
        id: "financial",
        text: "État de la liquidité du capital ?",
        options: [
          { label: "Réserve agressive", value: "high", weights: { aggressive: 10, prudent: -2, social: 5, growth: 10 } },
          { label: "Stabilité structurée", value: "med", weights: { aggressive: 2, prudent: 10, social: 5, growth: 5 } },
        ]
      }
    ]
  },
  {
    id: "daily",
    title: "Équilibre de Performance",
    description: "Devriez-vous privilégier l'étude/le travail intensif ou vous engager dans une récréation restauratrice ?",
    questions: [
      {
        id: "urgency",
        text: "À quel point la « Preuve de Performance » (Examen/Date limite) est-elle imminente ?",
        options: [
          { label: "Immédiate (< 24 heures)", value: "critical", weights: { aggressive: 20, prudent: -10, social: -10, growth: 15 } },
          { label: "Stratégique (72+ heures)", value: "relaxed", weights: { aggressive: 5, prudent: 15, social: 10, growth: 10 } },
        ]
      },
      {
        id: "energy",
        text: "État neuro-chimique (Niveau d'énergie) ?",
        options: [
          { label: "Pic (Concentré/Flow)", value: "high", weights: { aggressive: 15, prudent: 5, social: -5, growth: 20 } },
          { label: "Diminué (Fatigué/Anxieux)", value: "low", weights: { aggressive: -15, prudent: 20, social: 15, growth: -10 } },
        ]
      }
    ]
  }
];

// --- Components ---

const Navbar = ({ isAuthenticated, onSignOut }: { isAuthenticated: boolean, onSignOut: () => void }) => (
  <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-luxury-black/50 backdrop-blur-md border-b border-white/5">
    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="w-8 h-8 rounded bg-gold flex items-center justify-center text-black font-bold">A</div>
      <span className="text-xl font-serif tracking-widest uppercase group-hover:text-gold transition-colors">Axiom</span>
    </div>
    <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] font-medium text-white/60">
      <a href="#intelligence" className="hover:text-gold transition-colors">Intelligence</a>
      <a href="#ecosystem" className="hover:text-gold transition-colors">Écosystème</a>
      <a href="#about" className="hover:text-gold transition-colors">À Propos</a>
    </div>
    <div className="flex items-center gap-4">
      {isAuthenticated ? (
        <button 
          onClick={onSignOut}
          className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-gold transition-colors flex items-center gap-2"
        >
          Déconnexion <RefreshCw size={10} />
        </button>
      ) : (
        <button className="gold-border px-6 py-2 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-gold hover:text-black transition-all">
          Déployer Axiom
        </button>
      )}
    </div>
  </nav>
);

const DecisionEngine = () => {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Option[]>([]);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleScenarioSelect = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setCurrentStep(0);
    setSelections([]);
    setOutcome(null);
  };

  const handleOptionSelect = (option: Option) => {
    const newSelections = [...selections, option];
    setSelections(newSelections);

    if (activeScenario && currentStep < activeScenario.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(newSelections);
    }
  };

  const calculateResult = (finalSelections: Option[]) => {
    setIsLoading(true);
    // Simulate complex calculation
    setTimeout(() => {
      const totals = { aggressive: 0, prudent: 0, social: 0, growth: 0 };
      finalSelections.forEach(s => {
        totals.aggressive += s.weights.aggressive;
        totals.prudent += s.weights.prudent;
        totals.social += s.weights.social;
        totals.growth += s.weights.growth;
      });

      let res: Outcome;
      if (totals.aggressive > totals.prudent && totals.aggressive > 15) {
        res = {
          title: "Le Mouvement Assertif",
          description: "Vos données suggèrent un vide de pouvoir. Hésiter maintenant entraînerait une perte de levier.",
          recommendation: "Exécutez avec une vélocité maximale. Le délai est le principal facteur de risque.",
          riskProfile: "Élevé - Disrupteur",
          confidence: 94
        };
      } else if (totals.prudent > totals.aggressive) {
        res = {
          title: "Précision Consolidée",
          description: "Les indicateurs de marché ou biologiques suggèrent une phase de préservation. La durabilité l'emporte sur l'intensité.",
          recommendation: "Standardisez vos gains actuels. Diversifiez votre risque par un repos actif ou des mouvements latéraux.",
          riskProfile: "Conservateur - Stratégique",
          confidence: 98
        };
      } else {
        res = {
          title: "L'Hybride Équilibré",
          description: "Équilibre détecté. Une approche à double voie minimise l'entropie tout en capturant le potentiel.",
          recommendation: "Consacrez 60 % à la production et 40 % à la découverte/au repos.",
          riskProfile: "Équilibré",
          confidence: 88
        };
      }
      setOutcome(res);
      setIsLoading(false);
    }, 1500);
  };

  const reset = () => {
    setActiveScenario(null);
    setCurrentStep(0);
    setSelections([]);
    setOutcome(null);
  };

  return (
    <div id="intelligence" className="min-h-screen container mx-auto px-6 py-32 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 max-w-2xl"
      >
        <span className="text-gold text-xs uppercase tracking-[0.4em] mb-4 block">Noyau Moteur v4.2</span>
        <h2 className="text-5xl md:text-6xl mb-6">Intelligence de Décision</h2>
        <p className="text-white/40 leading-relaxed italic">
          Naviguez dans l'incertitude avec une certitude algorithmique. Sélectionnez votre domaine pour commencer la simulation.
        </p>
      </motion.div>

      <div className="w-full max-w-4xl min-h-[500px] glass rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col justify-center">
        {!activeScenario ? (
          <div className="grid md:grid-cols-2 gap-6 w-full h-full">
            {SCENARIOS.map((s) => (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleScenarioSelect(s)}
                className="group relative p-8 rounded-2xl border border-white/10 hover:border-gold/50 bg-white/5 text-left transition-all"
              >
                <div className="mb-4 w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-all">
                  {s.id === 'career' ? <Award size={24} /> : <Activity size={24} />}
                </div>
                <h3 className="text-2xl mb-2">{s.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{s.description}</p>
                <div className="mt-8 flex items-center gap-2 text-xs uppercase tracking-widest text-gold opacity-0 group-hover:opacity-100 transition-opacity">
                  Initialiser <ArrowRight size={14} />
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center py-20"
              >
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mb-8 text-gold"
                >
                  <RefreshCw size={48} />
                </motion.div>
                <h3 className="text-2xl mb-2 italic">Synthèse des Conséquences</h3>
                <p className="text-white/40 text-sm">Traitement de {selections.length} variables pondérées...</p>
              </motion.div>
            ) : outcome ? (
              <motion.div 
                key="outcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <div className="mb-6 px-4 py-1 rounded-full bg-gold/20 text-gold text-[10px] uppercase tracking-[0.3em] font-bold">
                  Mouvement Recommandé
                </div>
                <h3 className="text-4xl md:text-5xl mb-6 gold-gradient">{outcome.title}</h3>
                <p className="text-xl text-white/80 mb-8 max-w-xl text-center font-light">
                  "{outcome.description}"
                </p>
                
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg mb-12">
                  <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                    <span className="block text-[10px] uppercase text-white/40 tracking-widest mb-1">Profil de Risque</span>
                    <span className="text-sm font-semibold">{outcome.riskProfile}</span>
                  </div>
                  <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                    <span className="block text-[10px] uppercase text-white/40 tracking-widest mb-1">Indice de Confiance</span>
                    <span className="text-sm font-semibold">{outcome.confidence}%</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-gold/5 border border-gold/20 mb-12 w-full max-w-lg">
                  <h4 className="text-xs uppercase text-gold tracking-widest mb-3 flex items-center gap-2">
                    <BrainCircuit size={14} /> Stratégie Affinée
                  </h4>
                  <p className="text-white/70 italic text-sm leading-relaxed">
                    {outcome.recommendation}
                  </p>
                </div>

                <button 
                  onClick={reset}
                  className="text-white/40 hover:text-gold text-xs uppercase tracking-[0.2em] flex items-center gap-2 transition-colors"
                >
                  Réinitialiser le Moteur <RefreshCw size={12} />
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="question"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="flex justify-between items-center mb-12">
                  <span className="text-[10px] uppercase text-gold tracking-widest">Question {currentStep + 1} sur {activeScenario.questions[currentStep + 1] ? activeScenario.questions.length : activeScenario.questions.length}</span>
                  <button onClick={reset} className="text-white/20 hover:text-white transition-colors"><RefreshCw size={16} /></button>
                </div>
                
                <h3 className="text-3xl md:text-4xl mb-12 font-serif max-w-2xl leading-tight italic">
                  {activeScenario.questions[currentStep].text}
                </h3>

                <div className="grid gap-4">
                  {activeScenario.questions[currentStep].options.map((opt, idx) => (
                    <motion.button
                      key={idx}
                      whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.08)" }}
                      onClick={() => handleOptionSelect(opt)}
                      className="group flex justify-between items-center p-6 rounded-xl border border-white/10 bg-white/5 text-left transition-all"
                    >
                      <span className="text-lg font-light group-hover:text-gold transition-colors">{opt.label}</span>
                      <ChevronRight size={20} className="text-white/20 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

const FeatureSection = () => (
  <section id="ecosystem" className="py-32 bg-luxury-black overflow-hidden relative">
    <div className="container mx-auto px-6">
      <div className="grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-gold text-xs uppercase tracking-[0.4em] mb-4 block">Méthodologie Sans Égale</span>
            <h2 className="text-4xl md:text-6xl mb-8 leading-tight">Logique Avancée pour le Décideur Souverain.</h2>
            <p className="text-white/40 text-lg leading-relaxed mb-12">
              La plupart des outils utilisent des listes de contrôle statiques. Axiom emploie des heuristiques pondérées dynamiques et une simulation de conséquences pour révéler le chemin de moindre résistance.
            </p>
            
            <div className="space-y-8">
              {[
                { icon: BrainCircuit, title: "Logique Adaptative", desc: "Notre moteur se recalibre en fonction des entrées neuro-chimiques et économiques en temps réel." },
                { icon: Zap, title: "Orienté Vélocité", desc: "Prioriser le mouvement sur la perfection lorsque la fenêtre d'opportunité est étroite." },
                { icon: ShieldCheck, title: "Atténuation des Risques", desc: "Tests de stress sophistiqués de chaque mouvement recommandé au sein de notre bac à sable." }
              ].map((f, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full gold-border flex items-center justify-center text-gold">
                    <f.icon size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg mb-1 font-medium">{f.title}</h4>
                    <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        <div className="lg:col-span-7 relative">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="relative z-10 p-4 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent gold-border aspect-square max-w-md mx-auto flex items-center justify-center"
          >
            <div className="w-full h-full rounded-[2.5rem] bg-luxury-black overflow-hidden relative flex items-center justify-center">
               <motion.div 
                 animate={{ rotate: 360 }}
                 transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 opacity-20"
               >
                 <div className="absolute top-0 left-0 w-full h-full border-[1px] border-dashed border-gold rounded-full scale-150"></div>
                 <div className="absolute top-0 left-0 w-full h-full border-[1px] border-dashed border-white/20 rounded-full scale-110"></div>
                 <div className="absolute top-0 left-0 w-full h-full border-[1px] border-dashed border-gold/50 rounded-full scale-75"></div>
               </motion.div>
               <div className="relative text-center p-8">
                 <Sparkles className="text-gold mx-auto mb-4" size={32} />
                 <h3 className="text-2xl font-serif mb-2">Affiner les Résultats</h3>
                 <p className="text-white/30 text-[10px] uppercase tracking-widest font-mono">Itération 014A // Conséquence Vérifiée</p>
               </div>
            </div>
          </motion.div>
          
          {/* Decorative gradients */}
          <div className="absolute -top-1/4 -right-1/4 w-[150%] h-[150%] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-20 bg-luxury-black border-t border-white/5">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-gold flex items-center justify-center text-black text-[10px] font-bold">A</div>
        <span className="text-sm font-serif tracking-[0.3em] uppercase">Intelligence Axiom</span>
      </div>
      <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] font-medium text-white/40">
        <a href="#" className="hover:text-gold transition-colors">Codex de Confidentialité</a>
        <a href="#" className="hover:text-gold transition-colors">Conditions d'Intelligence</a>
        <a href="#" className="hover:text-gold transition-colors">Console d'Accès</a>
      </div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-white/20 italic">
        © 2026 Collectif Axiom. Tous droits réservés.
      </div>
    </div>
  </footer>
);

const AuthPortal = ({ onAuthenticate }: { onAuthenticate: () => void }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate auth lag for "prestige" feel
    setTimeout(() => {
      onAuthenticate();
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-luxury-black flex items-center justify-center p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gold/[0.03] blur-[150px] rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
           <Layers className="w-full h-full text-white" strokeWidth={0.2} />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass rounded-[2rem] p-10 md:p-14 border-white/10 shadow-2xl relative overflow-hidden">
          {/* Subtle moving line at the top */}
          <motion.div 
            animate={{ x: [-100, 400] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 h-[1px] w-24 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50"
          />

          <div className="text-center mb-12">
            <div className="w-12 h-12 rounded bg-gold mx-auto mb-6 flex items-center justify-center text-black font-bold text-xl shadow-lg ring-4 ring-gold/10">A</div>
            <h1 className="text-3xl font-serif mb-2 tracking-tight">Accéder au Collectif</h1>
            <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-medium">Vérifier l'Identité pour Continuer</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 ml-1 group-focus-within:text-gold transition-colors">Identification des Identifiants</label>
                <input 
                  type="email" 
                  placeholder="nom@nexus.com"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all placeholder:text-white/10" 
                />
              </div>
              <div className="group">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2 ml-1 group-focus-within:text-gold transition-colors">Code d'Accès</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20 transition-all placeholder:text-white/10" 
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gold text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Vérification...
                </>
              ) : (
                <>
                  Établir la Connexion <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-white/30 text-[10px] uppercase tracking-widest leading-relaxed">
              {mode === 'login' ? "Non autorisé ?" : "Déjà vérifié ?"} 
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="ml-2 text-gold hover:text-white transition-colors"
              >
                {mode === 'login' ? "Demander des Privilèges d'Accès" : "Retour au Portail d'Accès"}
              </button>
            </p>
          </div>
        </div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-[9px] uppercase tracking-[0.4em] text-white/10"
        >
          Lien Sécurisé Chiffré // Axiom Core v4.2
        </motion.p>
      </motion.div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <div className="relative selection:bg-gold selection:text-black">
      <AnimatePresence>
        {!isAuthenticated && (
          <AuthPortal onAuthenticate={() => setIsAuthenticated(true)} />
        )}
      </AnimatePresence>

      <Navbar isAuthenticated={isAuthenticated} onSignOut={() => setIsAuthenticated(false)} />

      <motion.div
        animate={isAuthenticated ? { opacity: 1 } : { opacity: 0 }}
        className={isAuthenticated ? "" : "pointer-events-none select-none blur-sm"}
      >
        {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ opacity, scale }}
          className="container mx-auto px-6 text-center z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="text-gold text-xs uppercase tracking-[0.6em] mb-8 block">Transformer le Choix en Résultat</span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl mb-12 font-serif font-light leading-tight">
              Intelligence de <br className="hidden md:block" /> <span className="italic">Décision</span> Axiom.
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <a href="#intelligence" className="px-10 py-5 rounded-full bg-gold text-black font-semibold text-sm uppercase tracking-widest hover:bg-white transition-all flex items-center gap-3">
                Lancer le Cycle d'Intelligence <CircleArrowRight size={18} />
              </a>
              <button className="px-10 py-5 rounded-full gold-border text-white/80 text-sm uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all">
                Explorer l'Écosystème
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[160px] rounded-full"></div>
          <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-luxury-black to-transparent"></div>
          
          {/* Animated lines */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ rotate: i * 45 }}
                animate={{ rotate: (i * 45) + 360 }}
                transition={{ duration: 10 + (i * 10), repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/20 rounded-full"
                style={{ width: 400 + (i * 200), height: 400 + (i * 200) }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Decision Engine App */}
      <DecisionEngine />

      {/* Feature Section */}
      <FeatureSection />

      {/* Social Proof / Reviews section (Luxury style) */}
      <section className="py-32 border-y border-white/5 bg-luxury-gray">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
             <span className="text-gold text-xs uppercase tracking-[0.4em] mb-4 block">Témoignages de Prestige</span>
             <h2 className="text-4xl md:text-5xl">L'Expérience Axiom</h2>
           </div>
           <div className="grid md:grid-cols-3 gap-8">
             {[
               { name: "Julian Thorne", role: "Directeur de Capital-Risque", quote: "Le moteur de décision a correctement identifié un piège de liquidité 6 mois avant nos analystes. Ce n'est plus optionnel." },
               { name: "Elara Vance", role: "Directrice Artistique", quote: "Cela apporte un niveau de clarté stratégique que je pensais possible uniquement par des années de méditation." },
               { name: "Marcus Blackwell", role: "Athlète de Compétition", quote: "J'utilise le mode Daily Grind tous les matins. C'est le coach que je ne savais pas avoir besoin." }
             ].map((r, i) => (
               <motion.div 
                 key={i} 
                 whileHover={{ y: -10 }}
                 className="p-8 rounded-3xl bg-luxury-black border border-white/5 italic"
               >
                 <Sparkles className="text-gold/30 mb-6" size={20} />
                 <p className="text-white/60 mb-8 leading-relaxed font-light">"{r.quote}"</p>
                 <div>
                   <span className="block text-sm font-semibold">{r.name}</span>
                   <span className="text-[10px] uppercase tracking-widest text-gold/60">{r.role}</span>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-40 text-center relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-7xl mb-12 max-w-4xl mx-auto font-serif leading-tight">
              Faites votre prochain mouvement avec une confiance <span className="italic italic-small gold-gradient">absolue</span>.
            </h2>
            <button className="px-12 py-6 rounded-full bg-gold text-black font-bold text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-white hover:scale-105 transition-all">
              Initier l'Accès
            </button>
          </motion.div>
        </div>
        
        {/* Decorative background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-30">
          <Layers className="w-full h-full text-white/5" strokeWidth={0.5} />
        </div>
      </section>

      </motion.div>

      <Footer />
    </div>
  );
}
