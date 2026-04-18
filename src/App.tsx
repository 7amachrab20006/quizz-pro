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
  Sparkles,
  Book,
  Monitor,
  Globe,
  Music,
  Gamepad2,
  Trophy,
  Users,
  Wallet,
  Dna,
  Languages,
  Sun,
  Timer,
  CheckCircle2,
  XCircle,
  BarChart3,
  Rocket
} from "lucide-react";

// --- Types ---

type QuizType = 'simulation' | 'knowledge';

interface SuperCategory {
  id: string;
  title: string;
  icon: any;
}

interface Option {
  label: string;
  value: string;
  weights?: {
    aggressive: number;
    prudent: number;
    social: number;
    growth: number;
  };
  isCorrect?: boolean;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
}

interface Quiz {
  id: string;
  superCategoryId: string;
  type: QuizType;
  title: string;
  description: string;
  questions: Question[];
  timeLimit?: number; // In seconds
}

interface Outcome {
  title: string;
  description: string;
  recommendation?: string;
  riskProfile?: string;
  confidence?: number;
  score?: number;
  rank?: 'Débutant' | 'Intermédiaire' | 'Expert';
}
// --- Data ---

const SUPER_CATEGORIES: SuperCategory[] = [
  { id: 'acad', title: 'Académie', icon: Book },
  { id: 'tech', title: 'Technologie', icon: Monitor },
  { id: 'cult', title: 'Culture G', icon: Globe },
  { id: 'ent', title: 'Entertainment', icon: Music },
  { id: 'sports', title: 'Sports & JO', icon: Trophy },
  { id: 'logic', title: 'Logique & QI', icon: Zap },
  { id: 'biz', title: 'Finance & Biz', icon: Wallet },
  { id: 'life', title: 'Vie & Santé', icon: Activity },
  { id: 'space', title: 'Espace & Science', icon: Rocket },
  { id: 'lang', title: 'Langues', icon: Languages },
  { id: 'fun', title: 'Fun & Random', icon: Sparkles },
  { id: 'rel', title: 'Religions', icon: Sun },
];

const LEADERBOARD = [
  { name: "Satoshi_N", score: 980, rank: "Expert" },
  { name: "Elon_M", score: 920, rank: "Expert" },
  { name: "Ada_Lov", score: 880, rank: "Intermediate" },
  { name: "Alan_T", score: 850, rank: "Intermediate" },
  { name: "Marie_C", score: 810, rank: "Intermediate" },
];

const QUIZZES: Quiz[] = [
  // --- Académique (Education) ---
  {
    id: "math",
    superCategoryId: "acad",
    type: "knowledge",
    title: "Mathématiques",
    description: "Algèbre, géométrie et calcul différentiel.",
    timeLimit: 120,
    questions: [
      { id: "m1", text: "Quelle est la racine carrée de 144 ?", options: [{ label: "10", value: "a" }, { label: "12", value: "b", isCorrect: true }, { label: "14", value: "c" }] },
      { id: "m2", text: "Résoudre 2x + 5 = 15", options: [{ label: "x = 5", value: "a", isCorrect: true }, { label: "x = 10", value: "b" }, { label: "x = 7.5", value: "c" }] },
      { id: "m3", text: "Quel est l'aire d'un cercle de rayon 2 ? (π ≈ 3.14)", options: [{ label: "12.56", value: "a", isCorrect: true }, { label: "6.28", value: "b" }, { label: "15.7", value: "c" }] },
      { id: "m4", text: "Somme des angles d'un triangle ?", options: [{ label: "90°", value: "a" }, { label: "180°", value: "b", isCorrect: true }, { label: "360°", value: "c" }] },
      { id: "m5", text: "Quelle est la valeur de x dans x² = 9 ?", options: [{ label: "3 ou -3", value: "a", isCorrect: true }, { label: "9", value: "b" }, { label: "1", value: "c" }] }
    ]
  },
  {
    id: "phys",
    superCategoryId: "acad",
    type: "knowledge",
    title: "Physique",
    description: "Mécanique classique et thermodynamique.",
    questions: [
      { id: "p1", text: "Quelle est la vitesse de la lumière (approx) ?", options: [{ label: "300,000 km/s", value: "a", isCorrect: true }, { label: "150,000 km/s", value: "b" }, { label: "1,000,000 km/s", value: "c" }] },
      { id: "p2", text: "Loi de Newton : F = ?", options: [{ label: "m * a", value: "a", isCorrect: true }, { label: "m * v", value: "b" }, { label: "m * g²", value: "c" }] },
      { id: "p3", text: "Unité de mesure de l'énergie ?", options: [{ label: "Pascal", value: "a" }, { label: "Joule", value: "b", isCorrect: true }, { label: "Watt", value: "c" }] },
      { id: "p4", text: "Qui a découvert la gravité après avoir vu une pomme tomber ?", options: [{ label: "Einstein", value: "a" }, { label: "Newton", value: "b", isCorrect: true }, { label: "Galilée", value: "c" }] },
      { id: "p5", text: "Quel gaz est nécessaire à la combustion ?", options: [{ label: "Azote", value: "a" }, { label: "Oxygène", value: "b", isCorrect: true }, { label: "CO2", value: "c" }] }
    ]
  },
  {
    id: "chem",
    superCategoryId: "acad",
    type: "knowledge",
    title: "Chimie",
    description: "Tableau périodique et réactions moléculaires.",
    questions: [
      { id: "c1", text: "Symbole chimique de l'Or ?", options: [{ label: "Ag", value: "a" }, { label: "Au", value: "b", isCorrect: true }, { label: "Fe", value: "c" }] },
      { id: "c2", text: "H2O est la formule de ?", options: [{ label: "L'eau", value: "a", isCorrect: true }, { label: "Le sel", value: "b" }, { label: "L'air", value: "c" }] },
      { id: "c3", text: "Quel est le pH neutre ?", options: [{ label: "0", value: "a" }, { label: "7", value: "b", isCorrect: true }, { label: "14", value: "c" }] },
      { id: "c4", text: "Particule chargée négativement dans un atome ?", options: [{ label: "Proton", value: "a" }, { label: "Neutron", value: "b" }, { label: "Électron", value: "c", isCorrect: true }] },
      { id: "c5", text: "Le diamant est composé de ?", options: [{ label: "Soufre", value: "a" }, { label: "Carbone", value: "b", isCorrect: true }, { label: "Silicon", value: "c" }] }
    ]
  },
  {
    id: "cs",
    superCategoryId: "acad",
    type: "knowledge",
    title: "Computer Science",
    description: "Algorithmes, structures de données et logique binaire.",
    questions: [
      { id: "cs1", text: "Quel est le moteur de recherche le plus utilisé ?", options: [{ label: "Bing", value: "a" }, { label: "Google", value: "b", isCorrect: true }, { label: "DuckDuckGo", value: "c" }] },
      { id: "cs2", text: "Nombre de bits dans un octet (byte) ?", options: [{ label: "4", value: "a" }, { label: "8", value: "b", isCorrect: true }, { label: "16", value: "c" }] },
      { id: "cs3", text: "Structure de données LIFO ?", options: [{ label: "Pile (Stack)", value: "a", isCorrect: true }, { label: "File (Queue)", value: "b" }, { label: "Tableau", value: "c" }] },
      { id: "cs4", text: "Protocole sécurisé pour le web ?", options: [{ label: "HTTP", value: "a" }, { label: "HTTPS", value: "b", isCorrect: true }, { label: "FTP", value: "c" }] },
      { id: "cs5", text: "Qui est considéré comme le premier programmeur ?", options: [{ label: "Alan Turing", value: "a" }, { label: "Ada Lovelace", value: "b", isCorrect: true }, { label: "Bill Gates", value: "c" }] }
    ]
  },
  {
    id: "svt",
    superCategoryId: "acad",
    type: "knowledge",
    title: "Biologie (SVT)",
    description: "Génétique, écosystèmes et biologie humaine.",
    questions: [
      { id: "svt1", text: "Où se trouve l'ADN dans une cellule animale ?", options: [{ label: "Noyau", value: "a", isCorrect: true }, { label: "Cytoplasme", value: "b" }, { label: "Membrane", value: "c" }] },
      { id: "svt2", text: "Combien d'os possède un humain adulte ?", options: [{ label: "150", value: "a" }, { label: "206", value: "b", isCorrect: true }, { label: "300", value: "c" }] },
      { id: "svt3", text: "Organe pompant le sang ?", options: [{ label: "Poumons", value: "a" }, { label: "Cerveau", value: "b" }, { label: "Cœur", value: "c", isCorrect: true }] },
      { id: "svt4", text: "Phénomène permettant aux plantes de capter l'énergie solaire ?", options: [{ label: "Respiration", value: "a" }, { label: "Photosynthèse", value: "b", isCorrect: true }, { label: "Transpiration", value: "c" }] },
      { id: "svt5", text: "Groupe sanguin donneur universel ?", options: [{ label: "A+", value: "a" }, { label: "AB-", value: "b" }, { label: "O-", value: "c", isCorrect: true }] }
    ]
  },
  {
    id: "hist",
    superCategoryId: "acad",
    type: "knowledge",
    title: "Histoire",
    description: "Grands empires et révolutions mondiales.",
    questions: [
      { id: "h1", text: "En quelle année a débuté la Révolution Française ?", options: [{ label: "1789", value: "a", isCorrect: true }, { label: "1776", value: "b" }, { label: "1804", value: "c" }] },
      { id: "h2", text: "Qui était le premier président des USA ?", options: [{ label: "Lincoln", value: "a" }, { label: "Washington", value: "b", isCorrect: true }, { label: "Jefferson", value: "c" }] },
      { id: "h3", text: "Construction de la Muraille de Chine commencée sous quelle dynastie ?", options: [{ label: "Qin", value: "a", isCorrect: true }, { label: "Han", value: "b" }, { label: "Ming", value: "c" }] },
      { id: "h4", text: "Quel pays a été le premier à atteindre la Lune ?", options: [{ label: "URSS", value: "a" }, { label: "USA", value: "b", isCorrect: true }, { label: "Chine", value: "c" }] },
      { id: "h5", text: "Date de la chute du mur de Berlin ?", options: [{ label: "1985", value: "a" }, { label: "1989", value: "b", isCorrect: true }, { label: "1991", value: "c" }] }
    ]
  },

  // --- Technologie ---
  {
    id: "prog_lang",
    superCategoryId: "tech",
    type: "knowledge",
    title: "Langages de Code",
    description: "C, Python, JavaScript et plus.",
    questions: [
      { id: "pl1", text: "Lequel est un langage compilé ?", options: [{ label: "Python", value: "a" }, { label: "C", value: "b", isCorrect: true }, { label: "PHP", value: "c" }] },
      { id: "pl2", text: "Symbole pour les commentaires sur une ligne en JS ?", options: [{ label: "//", value: "a", isCorrect: true }, { label: "#", value: "b" }, { label: "<!--", value: "c" }] },
      { id: "pl3", text: "Lequel est orienté objet ?", options: [{ label: "Java", value: "a", isCorrect: true }, { label: "C", value: "b" }, { label: "Assembly", value: "c" }] },
      { id: "pl4", text: "Mot-clé pour définir une fonction en Python ?", options: [{ label: "func", value: "a" }, { label: "def", value: "b", isCorrect: true }, { label: "function", value: "c" }] },
      { id: "pl5", text: "Framework JS créé par Facebook ?", options: [{ label: "Angular", value: "a" }, { label: "React", value: "b", isCorrect: true }, { label: "Vue", value: "c" }] }
    ]
  },
  {
    id: "cyber",
    superCategoryId: "tech",
    type: "knowledge",
    title: "Cybersécurité",
    description: "Protection des données et menaces réseau.",
    questions: [
      { id: "cy1", text: "Que signifie 'VPN' ?", options: [{ label: "Virtual Private Network", value: "a", isCorrect: true }, { label: "Variable Port Node", value: "b" }] },
      { id: "cy2", text: "Type d'attaque saturant un serveur ?", options: [{ label: "Phishing", value: "a" }, { label: "DDoS", value: "b", isCorrect: true }, { label: "Malware", value: "c" }] },
      { id: "cy3", text: "Hacker 'éthique' ?", options: [{ label: "Black Hat", value: "a" }, { label: "White Hat", value: "b", isCorrect: true }, { label: "Grey Hat", value: "c" }] }
    ]
  },

  // --- Culture ---
  {
    id: "capitals",
    superCategoryId: "cult",
    type: "knowledge",
    title: "Capitales & Monuments",
    description: "Monuments célèbres et capitales mondiales.",
    questions: [
      { id: "cap1", text: "Capitale du Japon ?", options: [{ label: "Kyoto", value: "a" }, { label: "Tokyo", value: "b", isCorrect: true }, { label: "Osaka", value: "c" }] },
      { id: "cap2", text: "Où se trouve le Colisée ?", options: [{ label: "Athènes", value: "a" }, { label: "Rome", value: "b", isCorrect: true }, { label: "Paris", value: "c" }] },
      { id: "cap3", text: "Capitale de la France ?", options: [{ label: "Lyon", value: "a" }, { label: "Marseille", value: "b" }, { label: "Paris", value: "c", isCorrect: true }] },
      { id: "cap4", text: "Qui a construit les pyramides de Gizeh ?", options: [{ label: "Romains", value: "a" }, { label: "Égyptiens", value: "b", isCorrect: true }, { label: "Grecs", value: "c" }] },
      { id: "cap5", text: "Où est la Statue de la Liberté ?", options: [{ label: "Washington", value: "a" }, { label: "New York", value: "b", isCorrect: true }, { label: "Boston", value: "c" }] }
    ]
  },

  // --- Divertissement ---
  {
    id: "movies_tv",
    superCategoryId: "ent",
    type: "knowledge",
    title: "Cinéma & Séries",
    description: "Films cultes, séries TV et célébrités.",
    questions: [
      { id: "mov1", text: "Qui joue Iron Man au cinéma ?", options: [{ label: "Chris Evans", value: "a" }, { label: "Robert Downey Jr", value: "b", isCorrect: true }, { label: "Tom Holland", value: "c" }] },
      { id: "mov2", text: "Série avec des dragons et un trône de fer ?", options: [{ label: "The Witcher", value: "a" }, { label: "Game of Thrones", value: "b", isCorrect: true }, { label: "Vikings", value: "c" }] },
      { id: "mov3", text: "Réalisateur de 'Inception' ?", options: [{ label: "Spielberg", value: "a" }, { label: "Nolan", value: "b", isCorrect: true }, { label: "Scorsese", value: "c" }] },
      { id: "mov4", text: "Quel film a gagné l'Oscar du meilleur film en 2020 ?", options: [{ label: "Joker", value: "a" }, { label: "Parasite", value: "b", isCorrect: true }, { label: "1917", value: "c" }] },
      { id: "mov5", text: "Série se déroulant dans une banque d'Espagne ?", options: [{ label: "Elite", value: "a" }, { label: "La Casa de Papel", value: "b", isCorrect: true }, { label: "Narcos", value: "c" }] }
    ]
  },

  // --- Performance (Sports) ---
  {
    id: "sports_mix",
    superCategoryId: "sports",
    type: "knowledge",
    title: "Omnisports",
    description: "Basket, Tennis, JO et Coupe du Monde.",
    questions: [
      { id: "sm1", text: "Joueur de basket avec le plus de bagues NBA ?", options: [{ label: "Jordan", value: "a" }, { label: "Bill Russell", value: "b", isCorrect: true }, { label: "LeBron", value: "c" }] },
      { id: "sm2", text: "Record de victoires à Roland Garros ?", options: [{ label: "Federer", value: "a" }, { label: "Nadal", value: "b", isCorrect: true }, { label: "Djokovic", value: "c" }] },
      { id: "sm3", text: "Fréquence des Jeux Olympiques d'été ?", options: [{ label: "2 ans", value: "a" }, { label: "4 ans", value: "b", isCorrect: true }, { label: "5 ans", value: "c" }] },
      { id: "sm4", text: "Vainqueur CDM Football 1998 ?", options: [{ label: "Brésil", value: "a" }, { label: "France", value: "b", isCorrect: true }, { label: "Italie", value: "c" }] },
      { id: "sm5", text: "Sport de Usain Bolt ?", options: [{ label: "Natation", value: "a" }, { label: "Saut en hauteur", value: "b" }, { label: "Sprint (Athlétisme)", value: "c", isCorrect: true }] }
    ]
  },

  // --- Business & Finance ---
  {
    id: "finance_basics",
    superCategoryId: "biz",
    type: "knowledge",
    title: "Finance & Entreprenariat",
    description: "Économie, Marketing et Trading.",
    questions: [
      { id: "fb1", text: "Que signifie 'ROI' en marketing ?", options: [{ label: "Return on Investment", value: "a", isCorrect: true }, { label: "Risk of Inflation", value: "b" }] },
      { id: "fb2", text: "L'offre et la ... ?", options: [{ label: "Vente", value: "a" }, { label: "Demande", value: "b", isCorrect: true }, { label: "Cote", value: "c" }] },
      { id: "fb3", text: "Plus grande capitalisation boursière crypto ?", options: [{ label: "Ethereum", value: "a" }, { label: "Bitcoin", value: "b", isCorrect: true }, { label: "Solana", value: "c" }] }
    ]
  },

  // --- Logique & QI ---
  {
    id: "iq_logic",
    superCategoryId: "logic",
    type: "knowledge",
    title: "Tests de Logique",
    description: "Suites logiques et casse-têtes.",
    questions: [
      { id: "iq1", text: "2, 4, 8, 16, ... ?", options: [{ label: "24", value: "a" }, { label: "32", value: "b", isCorrect: true }, { label: "64", value: "c" }] },
      { id: "iq2", text: "Pain est à boulanger ce que viande est à ... ?", options: [{ label: "Cuisinier", value: "a" }, { label: "Boucher", value: "b", isCorrect: true }, { label: "Fermier", value: "c" }] },
      { id: "iq3", text: "Si tous les A sont B, et certains B sont C, alors tous les A sont C ?", options: [{ label: "Vrai", value: "a" }, { label: "Faux", value: "b", isCorrect: true }] }
    ]
  },

  // --- Vie Quotidienne ---
  {
    id: "health_nutrition",
    superCategoryId: "life",
    type: "knowledge",
    title: "Santé & Nutrition",
    description: "Bien-être, fitness et alimentation.",
    questions: [
      { id: "hn1", text: "Vitamine produite par le soleil ?", options: [{ label: "A", value: "a" }, { label: "C", value: "b" }, { label: "D", value: "c", isCorrect: true }] },
      { id: "hn2", text: "Combien de verres d'eau recommandés par jour (moyenne) ?", options: [{ label: "4", value: "a" }, { label: "8", value: "b", isCorrect: true }, { label: "15", value: "c" }] },
      { id: "hn3", text: "Lequel est un sucre lent ?", options: [{ label: "Miel", value: "a" }, { label: "Riz complet", value: "b", isCorrect: true }, { label: "Bonbon", value: "c" }] }
    ]
  },

  // --- Détente ---
  {
    id: "would_rather",
    superCategoryId: "fun",
    type: "simulation",
    title: "Tu préfères... ?",
    description: "Le jeu des choix impossibles.",
    questions: [
      {
        id: "wr1",
        text: "Préfères-tu voler comme un oiseau ou respirer sous l'eau ?",
        options: [
          { label: "Voler", value: "fly", weights: { aggressive: 20, prudent: 0, social: 10, growth: 10 } },
          { label: "Respirer sous l'eau", value: "swim", weights: { aggressive: 10, prudent: 10, social: 0, growth: 20 } },
        ]
      }
    ]
  },

  // --- Langues ---
  {
    id: "languages_mix",
    superCategoryId: "lang",
    type: "knowledge",
    title: "Polyglotte Express",
    description: "Français, Anglais, Arabe.",
    questions: [
      { id: "lg1", text: "Comment dit-on 'Merci' en Arabe ?", options: [{ label: "Shukran", value: "a", isCorrect: true }, { label: "Marhaba", value: "b" }] },
      { id: "lg2", text: "Traduction de 'Bread' ?", options: [{ label: "Beurre", value: "a" }, { label: "Pain", value: "b", isCorrect: true }] }
    ]
  },

  // --- Spiritualité ---
  {
    id: "religious_culture",
    superCategoryId: "rel",
    type: "knowledge",
    title: "Cultures Religieuses",
    description: "Histoire et sagesses du monde.",
    questions: [
      { id: "rc1", text: "Mois de jeûne en Islam ?", options: [{ label: "Ramadan", value: "a", isCorrect: true }, { label: "Muharram", value: "b" }] },
      { id: "rc2", text: "Combien de commandements (Moïse) ?", options: [{ label: "5", value: "a" }, { label: "10", value: "b", isCorrect: true }] }
    ]
  },
  // --- Langues ---
  {
    id: "grammar_fr",
    superCategoryId: "lang",
    type: "knowledge",
    title: "Grammaire Française",
    description: "Conjugaison et syntaxe.",
    questions: [
      { id: "gfr1", text: "Auxiliaire pour 'Mourir' au passé composé ?", options: [{ label: "Avoir", value: "a" }, { label: "Être", value: "b", isCorrect: true }] }
    ]
  },

  // --- Fun / Random ---
  {
    id: "char_sim",
    superCategoryId: "fun",
    type: "simulation",
    title: "Quel Héros es-tu ?",
    description: "Découvre ton archétype légendaire.",
    questions: [
      {
        id: "c1",
        text: "Face au danger, tu préfères...",
        options: [
          { label: "L'approche frontale", value: "war", weights: { aggressive: 20, prudent: 0, social: 0, growth: 10 } },
          { label: "La ruse et l'ombre", value: "rog", weights: { aggressive: 10, prudent: 20, social: 0, growth: 0 } },
        ]
      }
    ]
  },
  {
    id: "trick_q",
    superCategoryId: "fun",
    type: "knowledge",
    title: "Questions Pièges",
    description: "Ne te fais pas avoir !",
    questions: [
      { id: "tq1", text: "Si un avion s'écrase à la frontière entre les USA et le Canada, où enterre-t-on les survivants ?", options: [{ label: "USA", value: "a" }, { label: "Canada", value: "b" }, { label: "On n'enterre pas les survivants", value: "c", isCorrect: true }] }
    ]
  },

  // --- Technologie Additionnelle ---
  {
    id: "hardware",
    superCategoryId: "tech",
    type: "knowledge",
    title: "Hardware PC",
    description: "Composants et architecture physique.",
    questions: [
      { id: "hw1", text: "Cerveau de l'ordinateur ?", options: [{ label: "GPU", value: "a" }, { label: "CPU", value: "b", isCorrect: true }, { label: "RAM", value: "c" }] }
    ]
  },
  {
    id: "networks",
    superCategoryId: "tech",
    type: "knowledge",
    title: "Réseaux & Web",
    description: "Protocoles et infrastructure internet.",
    questions: [
      { id: "nw1", text: "Adresse unique d'un appareil sur un réseau ?", options: [{ label: "IP", value: "a", isCorrect: true }, { label: "URL", value: "b" }] }
    ]
  },

  // --- Sports ---
  {
    id: "olympics",
    superCategoryId: "sports",
    type: "knowledge",
    title: "Histoire des J.O.",
    description: "Des cités grecques aux temps modernes.",
    questions: [
      { id: "ol1", text: "Couleur absente des anneaux olympiques ?", options: [{ label: "Bleu", value: "a" }, { label: "Rose", value: "b", isCorrect: true }, { label: "Noir", value: "c" }] }
    ]
  },

  // --- Culture G Additionnelle ---
  {
    id: "flags",
    superCategoryId: "cult",
    type: "knowledge",
    title: "Drapeaux du Monde",
    description: "Vexillologie pour experts.",
    questions: [
      { id: "fl1", text: "Drapeau pur Libyen (1977-2011) ?", options: [{ label: "Vert", value: "a", isCorrect: true }, { label: "Rouge", value: "b" }] }
    ]
  },
  
  {
    id: "productivity",
    superCategoryId: "life",
    type: "simulation",
    title: "Productivité & Études",
    description: "Arbitrage stratégique entre travail et loisir.",
    questions: [
      {
        id: "deadline",
        text: "Quelle est l'imminence de votre prochaine 'Preuve de Performance' ?",
        options: [
          { label: "Critique (< 24h)", value: "crit", weights: { aggressive: 20, prudent: -10, social: -10, growth: 15 } },
          { label: "Stratégique (2-5 jours)", value: "med", weights: { aggressive: 10, prudent: 5, social: 5, growth: 10 } },
          { label: "Sereine (7 jours+)", value: "low", weights: { aggressive: -5, prudent: 15, social: 10, growth: 5 } },
        ]
      }
    ]
  }
];

// --- Components ---

const Navbar = ({ isAuthenticated, onSignOut, setView }: { isAuthenticated: boolean, onSignOut: () => void, setView: (v: any) => void }) => (
  <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-luxury-black/50 backdrop-blur-md border-b border-white/5">
    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <div className="w-8 h-8 rounded bg-gold flex items-center justify-center text-black font-bold">A</div>
      <span className="text-xl font-serif tracking-widest uppercase group-hover:text-gold transition-colors">Axiom</span>
    </div>
    <div className="hidden md:flex gap-8 text-xs uppercase tracking-[0.2em] font-medium text-white/60">
      <button onClick={() => setView('grid')} className="hover:text-gold transition-colors">Intelligence</button>
      <button onClick={() => setView('intel')} className="hover:text-gold transition-colors">Flux Stratégique</button>
      <button onClick={() => setView('leaderboard')} className="hover:text-gold transition-colors">Classement</button>
      <button onClick={() => setView('history')} className="hover:text-gold transition-colors">Historique</button>
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

const DecisionEngine = ({ view, setView }: { view: string, setView: (v: any) => void }) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Option[]>([]);
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSuperCat, setSelectedSuperCat] = useState<string>('acad');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [history, setHistory] = useState<{date: string, scenario: string, result: string, resultId: string}[]>(() => {
    const saved = localStorage.getItem('axiom_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('axiom_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (activeQuiz?.timeLimit && view === 'quiz' && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => (prev !== null ? prev - 1 : null)), 1000);
    } else if (timeLeft === 0 && view === 'quiz') {
      calculateResult(selections);
    }
    return () => clearInterval(timer);
  }, [view, timeLeft, activeQuiz]);

  const handleQuizSelect = (quiz: Quiz) => {
    // Randomize questions and options for better replayability
    const randomizedQuestions = [...quiz.questions]
      .sort(() => Math.random() - 0.5)
      .map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
      }));

    setActiveQuiz({ ...quiz, questions: randomizedQuestions });
    setCurrentStep(0);
    setSelections([]);
    setOutcome(null);
    setTimeLeft(quiz.timeLimit || null);
    setView('quiz');
  };

  const handleOptionSelect = (option: Option) => {
    const newSelections = [...selections, option];
    setSelections(newSelections);

    if (activeQuiz && currentStep < activeQuiz.questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(newSelections);
    }
  };

  const calculateResult = (finalSelections: Option[]) => {
    setIsLoading(true);
    setView('result');
    setTimeout(() => {
      let res: Outcome;

      if (activeQuiz?.type === 'knowledge') {
        const correctCount = finalSelections.filter(s => s.isCorrect).length;
        const total = activeQuiz.questions.length;
        const score = Math.round((correctCount / total) * 100);
        let rank: Outcome['rank'] = 'Débutant';
        if (score > 80) rank = 'Expert';
        else if (score > 50) rank = 'Intermédiaire';

        res = {
          title: `Score d'Intelligence : ${score}%`,
          description: `Vous avez répondu correctement à ${correctCount} sur ${total} variables spectrales.`,
          rank: rank,
          score: score
        };
      } else {
        const totals = { aggressive: 0, prudent: 0, social: 0, growth: 0 };
        finalSelections.forEach(s => {
          if (s.weights) {
            totals.aggressive += s.weights.aggressive;
            totals.prudent += s.weights.prudent;
            totals.social += s.weights.social;
            totals.growth += s.weights.growth;
          }
        });

        if (totals.aggressive > totals.prudent && totals.aggressive > 5) {
          res = {
            title: "Le Mouvement Assertif",
            description: "Les indicateurs suggèrent une opportunité de rupture. Temporiser maintenant reviendrait à accepter la stagnation.",
            recommendation: "Exécutez avec une vélocité maximale. Ne laissez pas l'analyse paralyser l'action.",
            riskProfile: "Disruption Sophistiquée",
            confidence: 94
          };
        } else if (totals.prudent > totals.aggressive) {
          res = {
            title: "Précision Consolidée",
            description: "Le système détecte un besoin de stabilisation. La durabilité est votre meilleur atout actuel.",
            recommendation: "Protégez vos gains. Établissez une base solide avant toute nouvelle expansion.",
            riskProfile: "Excellence Conservatrice",
            confidence: 98
          };
        } else {
          res = {
            title: "L'Hybride Équilibré",
            description: "Un état d'équilibre rare a été détecté. Une approche multiaxiale est préconisée.",
            recommendation: "Répartissez vos ressources : 60% maintien, 40% innovation.",
            riskProfile: "Croissance Harmonieuse",
            confidence: 88
          };
        }
      }
      
      setOutcome(res);
      setHistory(prev => [{
        date: new Date().toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        scenario: activeQuiz?.title || "Inconnu",
        result: res.title,
        resultId: Math.random().toString(36).substr(2, 9)
      }, ...prev].slice(0, 5));
      setIsLoading(false);
    }, 1500);
  };

  const reset = () => {
    setActiveQuiz(null);
    setCurrentStep(0);
    setSelections([]);
    setOutcome(null);
    setTimeLeft(null);
    setView('grid');
  };

  const filteredQuizzes = QUIZZES.filter(q => q.superCategoryId === selectedSuperCat);

  return (
    <div id="intelligence" className="min-h-screen container mx-auto px-6 py-32 flex flex-col items-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10 max-w-4xl"
      >
        <span className="text-gold text-xs uppercase tracking-[0.4em] mb-4 block font-bold">Axiom Intelligence Hub v5.0</span>
        <h2 className="text-5xl md:text-7xl mb-8 font-serif leading-tight">Portail de Connaissance</h2>
        
        <div className="flex gap-4 justify-center flex-wrap mb-10">
           <button onClick={() => setView('grid')} className={`text-[10px] uppercase tracking-widest px-6 py-2 rounded-full transition-all flex items-center gap-2 ${view === 'grid' ? 'bg-gold text-black font-bold' : 'border border-white/10 text-white/40 hover:text-white'}`}>
             <Zap size={10} /> Quêtes Actives
           </button>
           <button onClick={() => setView('intel')} className={`text-[10px] uppercase tracking-widest px-6 py-2 rounded-full transition-all flex items-center gap-2 ${view === 'intel' ? 'bg-gold text-black font-bold' : 'border border-white/10 text-white/40 hover:text-white'}`}>
             <Globe size={10} /> Flux Stratégique
           </button>
           <button onClick={() => setView('leaderboard')} className={`text-[10px] uppercase tracking-widest px-6 py-2 rounded-full transition-all flex items-center gap-2 ${view === 'leaderboard' ? 'bg-gold text-black font-bold' : 'border border-white/10 text-white/40 hover:text-white'}`}>
             <Trophy size={10} /> Classement
           </button>
           <button onClick={() => setView('history')} className={`text-[10px] uppercase tracking-widest px-6 py-2 rounded-full transition-all flex items-center gap-2 ${view === 'history' ? 'bg-gold text-black font-bold' : 'border border-white/10 text-white/40 hover:text-white'}`}>
             <BarChart3 size={10} /> Historique
           </button>
        </div>

        {view === 'grid' && (
          <div className="flex gap-3 justify-center flex-wrap mb-12 max-w-5xl mx-auto">
            {SUPER_CATEGORIES.map(cat => (
              <button 
                key={cat.id}
                onClick={() => setSelectedSuperCat(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest transition-all border ${selectedSuperCat === cat.id ? 'bg-white/10 border-gold text-gold shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'border-white/5 text-white/40 hover:border-white/20 hover:text-white'}`}
              >
                <cat.icon size={12} /> {cat.title}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      <div className="w-full max-w-6xl glass rounded-[4rem] p-8 md:p-14 relative overflow-hidden min-h-[700px] flex flex-col justify-center shadow-3xl">
        <AnimatePresence mode="wait">
          {view === 'grid' && (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredQuizzes.length > 0 ? filteredQuizzes.map((q) => (
                <motion.button
                  key={q.id}
                  whileHover={{ y: -8, borderColor: "rgba(212, 175, 55, 0.4)" }}
                  onClick={() => handleQuizSelect(q)}
                  className="group relative p-10 rounded-[2.5rem] border border-white/5 bg-white/[0.02] text-left transition-all overflow-hidden flex flex-col h-full"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                    <AwardsIcon id={q.id} />
                  </div>
                  <div className="mb-6 flex justify-between items-start">
                    <div className="p-3 rounded-2xl bg-gold/10 text-gold border border-gold/20">
                      {q.type === 'knowledge' ? <Book size={20} /> : <Zap size={20} />}
                    </div>
                    {q.timeLimit && (
                      <span className="text-[9px] uppercase tracking-widest text-white/40 flex items-center gap-1">
                        <Timer size={10} /> {q.timeLimit}s
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl mb-4 font-serif group-hover:text-gold transition-colors">{q.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-10 flex-grow">{q.description}</p>
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gold font-bold">
                    Engager <ArrowRight size={14} />
                  </div>
                </motion.button>
              )) : (
                <div className="col-span-full py-40 text-center">
                  <p className="text-white/20 italic text-xl">Module d'intelligence en cours de chargement...</p>
                </div>
              )}
            </motion.div>
          )}

          {view === 'history' && (
            <motion.div 
              key="history"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 max-w-4xl mx-auto w-full"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-serif italic text-gold">Archives de Performance</h3>
                <button onClick={() => { setHistory([]); localStorage.removeItem('axiom_history'); }} className="text-[10px] text-red-400 uppercase tracking-widest hover:text-red-300">Réinitialiser</button>
              </div>
              {history.length > 0 ? history.map((h, i) => (
                <div key={i} className="flex justify-between items-center p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold border border-gold/20">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-gold/40 tracking-widest mb-1 font-bold">{h.date}</span>
                      <h4 className="text-2xl font-serif">{h.scenario}</h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[10px] uppercase text-white/20 tracking-widest mb-1 font-bold">Résultat Archivé</span>
                    <span className="text-lg italic font-medium text-white/80">{h.result}</span>
                  </div>
                </div>
              )) : (
                <div className="text-center py-32 border border-white/5 rounded-3xl border-dashed">
                  <p className="text-white/20 italic">Aucune donnée neuro-numérique n'a été indexée.</p>
                </div>
              )}
            </motion.div>
          )}

          {view === 'intel' && (
            <motion.div 
              key="intel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-6xl mx-auto w-full"
            >
              <div className="grid lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl">
                    <h4 className="text-[10px] uppercase text-gold tracking-[0.3em] font-bold mb-6">Index de Sentiment</h4>
                    <div className="space-y-4">
                      {[
                        { label: "Confiance Marché", val: 78, color: "bg-green-500" },
                        { label: "Risque Géopolitique", val: 42, color: "bg-red-500" },
                        { label: "Vélocité Tech", val: 91, color: "bg-blue-500" }
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-[9px] uppercase tracking-widest text-white/40 mb-2">
                            <span>{item.label}</span>
                            <span>{item.val}%</span>
                          </div>
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${item.val}%` }}
                              className={`h-full ${item.color}`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-8 rounded-[2rem] border border-white/5 bg-gold/[0.02]">
                    <h4 className="text-[10px] uppercase text-gold tracking-[0.3em] font-bold mb-4">Focus Stratégique</h4>
                    <p className="text-white/40 text-xs leading-relaxed italic">
                      "L'accélération de l'IA générative dans les infrastructures critiques redéfinit les barrières à l'entrée du marché."
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-3 space-y-8">
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-4xl font-serif italic text-gold">Flux d'Intelligence <span className="text-white opacity-20">Personnalisé</span></h3>
                    <div className="text-[10px] uppercase tracking-widest text-white/20 flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Mise à jour en continu
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { 
                        category: "Finance", 
                        title: "Pivot des Banques Centrales : Analyse de l'Impact sur la Dette Souveraine", 
                        summary: "Les nouvelles projections suggèrent un assouplissement plus lent que prévu, forçant les entreprises à restructurer leurs plans d'investissement à long terme.",
                        impact: "Élevé",
                        time: "Il y a 12 min"
                      },
                      { 
                        category: "Technologie", 
                        title: "L'Aube de l'Informatique Quantique Commerciale", 
                        summary: "Trois nouveaux laboratoires annoncent une stabilité de qubit record, ouvrant la voie à une cryptographie post-quantique indispensable dès 2027.",
                        impact: "Critique",
                        time: "Il y a 45 min"
                      },
                      { 
                        category: "Énergie", 
                        title: "Fusion Nucléaire : Nouvelle Percée au National Ignition Facility", 
                        summary: "Un gain d'énergie net constant a été maintenu pendant 120 secondes, raccourcissant l'horizon des énergies propres illimitées.",
                        impact: "Transformateur",
                        time: "Il y a 2h"
                      },
                      { 
                        category: "Logistique", 
                        title: "Routes Maritimes de l'Arctique : Ouverture d'une Nouvelle Voie Commerciale", 
                        summary: "La fonte des glaces record permet une réduction de 40% du temps de transit entre l'Asie et l'Europe pour la première fois cette saison.",
                        impact: "Moyen",
                        time: "Il y a 4h"
                      }
                    ].map((news, idx) => (
                      <motion.div 
                        key={idx}
                        whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.04)" }}
                        className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] transition-all cursor-pointer group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <span className="px-3 py-1 rounded-full border border-gold/20 text-gold text-[9px] uppercase tracking-widest font-bold">
                            {news.category}
                          </span>
                          <span className="text-[9px] uppercase text-white/20 tracking-widest">{news.time}</span>
                        </div>
                        <h4 className="text-2xl font-serif mb-3 group-hover:text-gold transition-colors">{news.title}</h4>
                        <p className="text-white/40 text-sm leading-relaxed mb-6">{news.summary}</p>
                        <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                           <div className="flex items-center gap-2">
                             <span className="text-[9px] uppercase tracking-widest text-white/20">Impact :</span>
                             <span className={`text-[10px] font-bold uppercase ${news.impact === 'Critique' || news.impact === 'Transformateur' ? 'text-red-400' : 'text-gold'}`}>{news.impact}</span>
                           </div>
                           <ArrowRight size={14} className="ml-auto text-white/10 group-hover:text-gold group-hover:translate-x-1 transition-all" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'leaderboard' && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto w-full"
            >
              <div className="text-center mb-16">
                <h3 className="text-4xl font-serif italic text-gold mb-4">Elite Network</h3>
                <p className="text-white/40 text-xs uppercase tracking-widest">Les esprits les plus vifs de la plateforme</p>
              </div>
              
              <div className="gold-border rounded-[2.5rem] overflow-hidden bg-white/[0.02]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="px-10 py-6 text-xs uppercase tracking-widest text-gold font-bold">Rang</th>
                      <th className="px-10 py-6 text-xs uppercase tracking-widest text-gold font-bold">Profil</th>
                      <th className="px-10 py-6 text-xs uppercase tracking-widest text-gold font-bold text-right">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LEADERBOARD.map((user, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.04] transition-colors group">
                        <td className="px-10 py-8">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm ${idx === 0 ? 'bg-gold text-black font-bold' : 'border border-white/10 text-white/40'}`}>
                            {idx + 1}
                          </div>
                        </td>
                        <td className="px-10 py-8">
                          <div className="font-serif text-xl group-hover:text-gold transition-colors">{user.name}</div>
                          <div className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{user.rank}</div>
                        </td>
                        <td className="px-10 py-8 text-right font-mono text-gold text-2xl font-light">
                          {user.score} <span className="text-[10px] text-white/20 ml-1">PTS</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {view === 'quiz' && activeQuiz && (
            <motion.div 
              key="quiz"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex flex-col w-full"
            >
              <div className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-gold tracking-[0.3em] font-bold mb-1">Question {currentStep + 1} / {activeQuiz.questions.length}</span>
                    <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / activeQuiz.questions.length) * 100}%` }}
                        className="h-full bg-gold shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] uppercase text-white/20 tracking-widest hidden md:block">| {activeQuiz.title}</span>
                </div>
                
                <div className="flex items-center gap-6">
                  {timeLeft !== null && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-500/20 bg-red-500/10 text-red-400">
                      <Timer size={14} className={timeLeft < 10 ? "animate-pulse" : ""} />
                      <span className="font-mono text-sm font-bold">{timeLeft}s</span>
                    </div>
                  )}
                  <button onClick={reset} className="text-white/20 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"><RefreshCw size={20} /></button>
                </div>
              </div>
              
              <h3 className="text-4xl md:text-6xl mb-20 font-serif max-w-4xl font-light leading-tight">
                {activeQuiz.questions[currentStep].text}
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {activeQuiz.questions[currentStep].options.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 15, scale: 1.02, backgroundColor: "rgba(255,255,255,0.06)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect(opt)}
                    className="group relative flex justify-between items-center p-10 rounded-3xl border border-white/10 bg-white/[0.02] text-left transition-all"
                  >
                    <div className="flex items-center gap-6">
                       <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold group-hover:border-gold group-hover:text-gold transition-colors font-mono">
                         0{idx + 1}
                       </div>
                       <span className="text-2xl font-light text-white/80 group-hover:text-gold transition-colors">{opt.label}</span>
                    </div>
                    <ChevronRight size={28} className="text-white/5 group-hover:text-gold group-hover:translate-x-2 transition-all" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center py-10 w-full"
            >
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="mb-14 text-gold"
                  >
                    <RefreshCw size={100} strokeWidth={0.5} />
                  </motion.div>
                  <h3 className="text-4xl mb-6 italic font-serif">Algorithme en cours...</h3>
                  <p className="text-white/20 text-xs uppercase tracking-[0.8em] font-bold">Calibration de l'Intelligence de Décision</p>
                </div>
              ) : outcome && (
                <div className="text-center w-full max-w-4xl">
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-12 px-8 py-3 rounded-full border border-gold/30 bg-gold/10 inline-block"
                  >
                    <div className="flex items-center gap-3">
                      <Award size={16} className="text-gold" />
                      <span className="text-gold text-[12px] uppercase tracking-[0.5em] font-bold">Rapport d'Intelligence Reçu</span>
                    </div>
                  </motion.div>
                  
                  <h3 className="text-6xl md:text-8xl mb-12 gold-gradient font-serif leading-tight font-light italic">{outcome.title}</h3>
                  <p className="text-3xl text-white/60 mb-20 font-light leading-relaxed italic max-w-3xl mx-auto">
                    "{outcome.description}"
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-8 w-full mb-20">
                    <div className="p-10 rounded-[3rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><BarChart3 size={120} /></div>
                      <span className="block text-[10px] uppercase text-white/30 tracking-widest mb-4 font-bold">Performance Cognitive</span>
                      <span className="text-6xl font-serif text-white">{outcome.score !== undefined ? `${outcome.score}%` : `${outcome.confidence}%`}</span>
                    </div>
                    <div className="p-10 rounded-[3rem] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity"><Trophy size={120} /></div>
                      <span className="block text-[10px] uppercase text-white/30 tracking-widest mb-4 font-bold">Graduation Axiom</span>
                      <span className="text-2xl font-semibold text-gold tracking-widest uppercase">{outcome.rank || outcome.riskProfile}</span>
                    </div>
                  </div>

                  {outcome.recommendation && (
                    <div className="p-14 rounded-[3.5rem] bg-gold/[0.03] border border-gold/10 mb-20 text-left relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"><BrainCircuit size={100} /></div>
                      <h4 className="text-xs uppercase text-gold tracking-widest mb-6 flex items-center gap-3 font-bold">
                        <Zap size={14} /> Protocole Stratégique
                      </h4>
                      <p className="text-white/80 italic text-2xl leading-relaxed font-light">
                        {outcome.recommendation}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-6 justify-center">
                    <button 
                      onClick={reset}
                      className="gold-border px-14 py-6 rounded-full text-xs uppercase tracking-[0.4em] font-bold hover:bg-gold hover:text-black transition-all shadow-2xl"
                    >
                      Initier une Nouvelle Mission
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const AwardsIcon = ({ id }: { id: string }) => {
  if (id === 'math') return <Zap size={80} />;
  if (id === 'phys') return <Sparkles size={80} />;
  if (id === 'prog') return <Monitor size={80} />;
  if (id === 'football') return <Trophy size={80} />;
  if (id === 'crypto') return <Wallet size={80} />;
  return <AwardsIcon id="default" />;
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
  const [view, setView] = useState<'grid' | 'quiz' | 'result' | 'history' | 'leaderboard' | 'intel'>('grid');
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

      <Navbar isAuthenticated={isAuthenticated} onSignOut={() => setIsAuthenticated(false)} setView={setView} />

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
              <button 
                onClick={() => {
                  const el = document.getElementById('intelligence');
                  el?.scrollIntoView({ behavior: 'smooth' });
                  setView('grid');
                }}
                className="px-10 py-5 rounded-full bg-gold text-black font-semibold text-sm uppercase tracking-widest hover:bg-white transition-all flex items-center gap-3 text-left"
              >
                Lancer le Cycle d'Intelligence <CircleArrowRight size={18} />
              </button>
              <button className="px-10 py-5 rounded-full gold-border text-white/80 text-sm uppercase tracking-widest hover:text-white hover:bg-white/5 transition-all">
                Explorer l'Écosystème
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Hero Background Elements */}
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
      <DecisionEngine view={view} setView={setView} />

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
