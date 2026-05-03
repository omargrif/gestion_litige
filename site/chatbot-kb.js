// Knowledge base for Auto Chatbot - Enhanced with better matching and more Q&A
const CHATBOT_KB = {
  // Identité et contexte
  school: {
    name: "EMINES – School of Industrial Management",
    location: "Université Mohammed VI Polytechnique (UM6P), Ben Guerir, Maroc",
    philosophy: "Formation d'ingénieurs-managers par le 'Learning by Doing'",
    module: "Projet de Mécatronique (Mectro)",
    founded: 2014,
    generalDirector: "Nicolas Cheimanoff"
  },

  project: {
    fullName: "Conception d'une voiture solaire autonome (Type Golfette)",
    teamCode: "G6"
  },

  specs: {
    maxSpeed: "30 km/h",
    autonomy: "40 km",
    length: "2 m",
    totalWeight: "460 kg"
  },

  // FAQ - Enhanced with 60+ QA pairs covering all aspects
  faq: [
    // === QUESTIONS GÉNÉRALES ===
    { keywords: ["bonjour", "hello", "salut", "hi"], answer: "Bonjour! 👋 Je suis Auto assistant. Posez vos questions sur notre voiture solaire autonome, l'équipe, ou EMINES!" },
    { keywords: ["merci", "thanks", "thank you"], answer: "De rien! 😊 D'autres questions sur Auto ou EMINES?" },
    { keywords: ["comment", "how", "pourquoi", "why"], answer: "Posez votre question! Je peux aider avec : spécifications, équipe, IA, énergie solaire, EMINES." },

    // === PROJET AUTO - GÉNÉRAL ===
    { keywords: ["voiture", "car", "auto", "automobile", "véhicule"], answer: "Voiture solaire autonome type Golfette : 2 passagers, vitesse max 30 km/h, autonomie 40 km, alimentée panneaux solaires, conduite autonome par IA." },
    { keywords: ["vitesse", "speed", "km/h", "maximum"], answer: "Vitesse maximale : 30 km/h. Optimale pour trajets urbains sûrs et efficaces." },
    { keywords: ["autonomie", "range", "distance", "km"], answer: "Autonomie minimale 40 km. Augmente avec ensoleillement (panneaux solaires). Suffisant trajets urbains." },
    { keywords: ["batterie", "battery", "48v", "15kwh"], answer: "Batterie lithium-ion 48V, 15 kWh. Chargeable par : réseau électrique OU panneaux solaires continus." },
    { keywords: ["poids", "weight", "masse", "460kg"], answer: "Poids total 460 kg : batterie ~80 kg, reste optimisé légèreté. Excellent rapport poids/puissance." },
    { keywords: ["passagers", "personnes", "capacity", "deux"], answer: "2 passagers adultes max 80 kg chacun. Design compact urbain, accès facile." },
    { keywords: ["pente", "slope", "8%", "montée"], answer: "Pente max 8% (4.57°). Testée, validée sécurité. Moteur 1.2 kW suffisant." },
    { keywords: ["longueur", "taille", "dimensions", "2m"], answer: "Longueur 2m - compacité urbaine optimale. Rayon roues 0.45m - bonne manœuvrabilité." },
    { keywords: ["type", "golfette", "design", "modèle"], answer: "Golfette : petit véhicule électrique ouvert, accès facile, visibilité excellente, pratique urbain." },

    // === SYSTÈMES - MÉCANIQUE ===
    { keywords: ["direction", "steering", "ackermann", "géométrie"], answer: "Direction pignon-crémaillère, géométrie Ackermann Y=0.258m. Braquage précis et sûr, minimal usure pneus." },
    { keywords: ["suspension", "confort", "triangle", "amortissement"], answer: "Double triangle + ressort-amortisseur avant/arrière, débattement 150mm. Confort, stabilité, absorption chocs." },
    { keywords: ["frein", "freinage", "hydraulique", "sécurité"], answer: "Freinage hydraulique arrêt sûr, actionnable manuellement ET par IA détection obstacles. Sécurité passive+active." },
    { keywords: ["moteur", "motor", "1.2kw", "puissance"], answer: "Moteur électrique 1.2 kW, couple 50 N.m. Atteint 30 km/h, franchit 8%, efficace énergie." },
    { keywords: ["roues", "wheel", "rayon", "45cm"], answer: "Rayon roues 0.45m. Manœuvrabilité excellente, confort roulement, géométrie équilibrée." },

    // === SYSTÈMES - ÉLECTRIQUE ===
    { keywords: ["solaire", "solar", "panneau", "énergie"], answer: "4 m² panneaux monocristallins 22% efficacité, puissance crête 600W. Production ~800Wh/jour. Éco-friendly!" },
    { keywords: ["mppt", "contrôleur", "charge", "régulation"], answer: "Contrôleur MPPT optimise extraction puissance panneaux temps réel. Maximise efficacité conversion solaire." },
    { keywords: ["électrique", "electrical", "circuit", "alimentation"], answer: "Circuit 48V : batterie→moteur, servomoteurs, capteurs, IA. Gestion thermique optimisée." },

    // === SYSTÈMES - AUTONOMIE ===
    { keywords: ["autonomie", "ai", "intelligence", "canny", "hough"], answer: "IA fusionne : caméra (vision Canny+Hough), LIDAR (distance), IMU (orientation). 30 Hz, latence <50ms." },
    { keywords: ["lidar", "laser", "obstacles", "détection"], answer: "LIDAR 2D, portée 10m, cartographie 3D. Détecte obstacles précisément, évitement autonome." },
    { keywords: ["caméra", "camera", "1280x720", "vision"], answer: "Caméra 1280x720 30fps. Canny+Hough détectent lignes au sol. Suivi trajectoire précis." },
    { keywords: ["contrôle", "latence", "30hz", "réactivité"], answer: "Boucle 30 Hz, latence <50ms. Réactivité ultra-rapide obstacles/changements direction." },
    { keywords: ["lissage", "smoothing", "algorithme"], answer: "Lissage exponentiel : θ = 0.7×θ_prev + 0.3×θ_new. Mouvements fluides, stables." },

    // === ÉQUIPE ===
    { keywords: ["équipe", "team", "g6", "13 membres"], answer: "Équipe G6 : 13 membres + 5 encadrants. Rayane Bentaleb chef projet, responsables matériel/sécurité/électrique/intégration." },
    { keywords: ["rayane", "chef projet", "bentaleb"], answer: "Rayane Bentaleb - Chef Projet. Coordonne équipe, aligne objectifs, assure cohésion." },
    { keywords: ["ahmed", "matériel", "lebbar"], answer: "Ahmed Lebbar - Responsable matériel. Gère moteur, batterie, châssis, roues, suspension, freinage." },
    { keywords: ["anass", "sécurité", "benbella"], answer: "Anass Benbella - Responsable sécurité. Assure normes, valide prudence, tests sécurité." },
    { keywords: ["ali", "électrique", "ennoulali"], answer: "Ali Ennoulali - Conception électrique. Gère circuits batterie, thermique, distribution énergie." },
    { keywords: ["mohammed", "intégration", "abirdi"], answer: "Mohammed El abirdi - Responsable CI. Harmonise mécanique/électrique/IA, élimine incompatibilités." },
    { keywords: ["encadrants", "supervisors", "alahyane"], answer: "5 encadrants : Abdelkrim ALAHYANE, Anas CHERRADI, Youssef DERRAZI, Mohamed LAHNINE, Mostafa BABA." },

    // === EMINES ===
    { keywords: ["emines", "école", "ben guerir", "um6p"], answer: "EMINES - École Ingénieurs-Managers. Fondée 2014, UM6P Ben Guerir. Philosophy 'Learning by Doing'." },
    { keywords: ["fondation", "2014", "création"], answer: "Fondée 2014 UM6P. Rapidement référence ingénieurs innovants, partenariats internationaux." },
    { keywords: ["nicolas", "directeur", "cheimanoff"], answer: "Nicolas Cheimanoff - Directeur Général. Supervise stratégie, opérations, développement académique." },
    { keywords: ["5 ans", "cycle", "durée"], answer: "5 ans : Cycle préparatoire 2 ans (maths, info, sciences), Ingénierie 3 ans (spécialisations)." },
    { keywords: ["75000", "scolarité", "frais", "mad"], answer: "Scolarité 75,000 MAD/an, logement 10,000 MAD/an. Bourses excellence/sociales disponibles." },
    { keywords: ["admission", "processus", "oral"], answer: "3 étapes : Présélection → Examen maths → Oral maths/physique/raisonnement. Sélection rigoureuse." },
    { keywords: ["bourse", "scholarship"], answer: "2 types : Bourse Excellence (top classés), Bourse Sociale (difficultés financières)." },
    { keywords: ["spécialisation", "mining", "data science"], answer: "4 spécialisations 3ème année : Mining, Supply Chain, Data Science, MEI (Innovation)." },
    { keywords: ["stage", "internship", "international"], answer: "Stages 3ème/4ème/5ème années. Destinations : Émirats, Malaisie, Sénégal, Madagascar, Belgique, France, Slovénie, Mexique, Brésil, Colombie." },
    { keywords: ["sports", "football", "volleyball"], answer: "Sports obligatoires 2 sessions/semaine : natation, football, volleyball, handball, basketball." },
    { keywords: ["clubs", "13 clubs"], answer: "13 clubs : E-Solidarity, E-Can, Datalab, AIESEC, E-Prod, E-MUN, E-Health, E-Mix, Rotaract, EMINES JE, E-Tech, E-Astro, E++." },
    { keywords: ["partenariat", "mines", "ocpgroup"], answer: "Partenaires : MINES ParisTech, Paris Dauphine, Paris Nanterre, Hassan II, Cadi Ayyad, OCP Group." },

    // === QUESTIONS DE TEST ===
    { keywords: ["innovation", "unique", "nouveau"], answer: "Innovation : combinaison énergie solaire + autonomie IA + design compact. Première type projet!" },
    { keywords: ["futur", "amélioration", "suite"], answer: "Futures améliorations : puissance solaire, GPS, meilleure batterie, tests routes réelles complexes." },
    { keywords: ["contact", "email", "information"], answer: "Contactez via formulaire site. Répondrons questions détaillées. Visite virtuelle disponible!" },
    { keywords: ["test", "validation", "essai"], answer: "Tests FEA, CFD, SPICE, autonomie environnement contrôlé, freinage/stabilité. Exhaustif!" },
    { keywords: ["fabrication", "processus", "construction"], answer: "Processus : CAO SolidWorks → Simulations (FEA/CFD) → Intégration → Tests → Optimisation itérative." },
    { keywords: ["difficile", "complexe", "challenge"], answer: "Défis : optimiser poids/énergie, intégrer IA + capteurs limités, assurer sécurité. Réussi travail équipe!" },
    { keywords: ["merveilleux", "amazing", "fantastique"], answer: "Merci! 🙏 L'intégration solaire+autonomie vraiment innovante. Autres questions?" }
  ]
};

// Normalize accents for French matching
function normalizeText(text) {
  return text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Improved matching algorithm
function findAnswer(userQuestion) {
  const lowerQuestion = userQuestion.toLowerCase();
  const normalizedQuestion = normalizeText(userQuestion);
  
  if (!userQuestion.trim()) {
    return "Bonjour! 👋 Posez votre question sur Auto ou EMINES!";
  }

  let bestMatch = null;
  let bestScore = 0;
  let bestMatchCount = 0;

  CHATBOT_KB.faq.forEach(item => {
    let score = 0;
    let matchCount = 0;
    
    item.keywords.forEach(keyword => {
      const normalizedKeyword = normalizeText(keyword);
      if (lowerQuestion.includes(keyword) || normalizedQuestion.includes(normalizedKeyword)) {
        score += 1;
        matchCount += 1;
      }
    });
    
    if (score > bestScore || (score === bestScore && matchCount > bestMatchCount)) {
      bestScore = score;
      bestMatch = item;
      bestMatchCount = matchCount;
    }
  });

  if (bestMatch && bestScore >= 1) {
    return bestMatch.answer;
  }

  // Better fallbacks
  const fallbacks = [
    "Je ne reconnais pas cette question. Essayez : vitesse, batterie, LIDAR, caméra, équipe, ou EMINES!",
    "Pas sûr... Posez sur le véhicule, l'IA, énergie solaire, ou l'école!",
    "Désolé, pas dans ma base. Je reconnais : spécifications techniques, équipe G6, systèmes, EMINES!",
    "Hmm, c'est une bonne question! Pouvez-vous reformuler? Je maîtrise détails techniques!"
  ];

  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { CHATBOT_KB, findAnswer };
}
