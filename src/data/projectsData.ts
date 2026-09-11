export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: "web" | "mobile" | "ml" | "iot";
  categoryLabel: string;
  description: string;
  longDescription?: string;
  problem?: string;
  solution?: string;
  features: string[];
  results?: string[];
  technologies: string[];
  image: string;
  fallbackGradient: string;
  link?: string;
  github?: string;
  sourceCodePrivate?: boolean;
  featured?: boolean;
  year?: string;
}

export const toProxyImageUrl = (url: string): string => {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("data:") || url.startsWith("/")) return url;
  if (url.includes("images.weserv.nl/?url=")) return url;

  const driveShareMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveShareMatch?.[1]) {
    const fileId = driveShareMatch[1];
    return `https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=${fileId}`;
  }

  const driveUcMatch = url.match(/drive\.google\.com\/uc\?[^\s]*id=([^&]+)/);
  if (driveUcMatch?.[1]) {
    const fileId = driveUcMatch[1];
    return `https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=${fileId}`;
  }

  return url;
};

export const createProjectSvgFallback = (title: string, category: string, primaryTech: string): string => {
  const safeTitle = title.replace(/[<>&"]/g, "");
  const safeCategory = category.replace(/[<>&"]/g, "");
  const safeTech = primaryTech.replace(/[<>&"]/g, "");

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" width="1200" height="675">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0b1120"/>
          <stop offset="50%" stop-color="#111827"/>
          <stop offset="100%" stop-color="#030712"/>
        </linearGradient>
        <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#818cf8"/>
          <stop offset="50%" stop-color="#c084fc"/>
          <stop offset="100%" stop-color="#38bdf8"/>
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      <circle cx="950" cy="150" r="220" fill="#a855f7" opacity="0.12" filter="blur(60px)"/>
      <circle cx="250" cy="500" r="260" fill="#06b6d4" opacity="0.1" filter="blur(60px)"/>
      
      <g transform="translate(100, 220)">
        <rect x="0" y="0" width="180" height="34" rx="17" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.1)"/>
        <text x="90" y="22" fill="#38bdf8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" text-anchor="middle" letter-spacing="1">${safeCategory.toUpperCase()}</text>
        
        <text x="0" y="85" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="800">${safeTitle}</text>
        
        <text x="0" y="130" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400">Featured Architecture &amp; Implementation</text>
        
        <rect x="0" y="170" width="130" height="32" rx="8" fill="rgba(168,85,247,0.15)" stroke="rgba(168,85,247,0.3)"/>
        <text x="65" y="191" fill="#e9d5ff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="600" text-anchor="middle">${safeTech}</text>
      </g>
    </svg>
  `)}`;
};

export const PROJECTS: Project[] = [
  // --- WEB PROJECTS ---
  {
    id: "purchifyshop",
    title: "PurchifyShop",
    subtitle: "Modern Full-Stack E-commerce Platform",
    category: "web",
    categoryLabel: "Web App",
    description: "Production-grade e-commerce web platform featuring real-time product discovery, category filtering, cart management, and seamless responsive UI.",
    longDescription: "PurchifyShop is an end-to-end e-commerce solution engineered for speed, high conversion, and seamless shopping workflows. The application incorporates fine-grained product taxonomy, responsive browsing across devices, dynamic state management, and optimized asset delivery.",
    problem: "Traditional e-commerce templates often suffer from sluggish catalog navigation, cluttered checkout flows, and poor mobile rendering.",
    solution: "Architected a modular component library using React and Tailwind CSS, orchestrated smooth micro-animations with Framer Motion, and integrated robust backend endpoints with Laravel for high throughput.",
    features: [
      "Dynamic catalog search with multi-parameter filtering (price, categories, ratings)",
      "Persistent cart synchronization and optimized multi-step checkout workflow",
      "Instant responsive layout adapted for ultra-fast mobile navigation",
      "State preservation and animated micro-interactions for elevated UX",
    ],
    results: [
      "Sub-second page transitions and 90+ Lighthouse mobile performance score",
      "Live in production serving real catalog requests",
    ],
    technologies: ["React", "Tailwind CSS", "Framer Motion", "Laravel", "Vite", "RESTful API"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1Yi9rhaY5ROKTlV_aIaGql7emshK640Dc",
    fallbackGradient: "from-blue-600/30 to-indigo-600/30",
    link: "https://purchifyshop.com/",
    github: "https://github.com/Maharab2134",
    sourceCodePrivate: true,
    featured: true,
    year: "2024",
  },
  {
    id: "midtown-aabashon",
    title: "Midtown Aabashon Ltd",
    subtitle: "Corporate Real Estate & Property Showcase",
    category: "web",
    categoryLabel: "Web App",
    description: "Corporate real estate platform showcasing commercial and residential developments with high-conversion lead generation pipelines.",
    longDescription: "A bespoke corporate portal developed for Midtown Aabashon Ltd to establish a commanding digital brand footprint. The platform presents company assets, architectural specifications, project timelines, and integrated inquiry channels.",
    problem: "The client required an authoritative, SEO-optimized platform to display multi-tier property developments and capture qualified buyer leads without loading delays.",
    solution: "Engineered a performant React web architecture utilizing semantic HTML5, localized SEO structured markup, tailored responsive layouts, and friction-free lead inquiry forms.",
    features: [
      "Structured property portfolio with high-resolution image galleries",
      "Integrated inquiry pipeline linking potential buyers with customer sales teams",
      "Comprehensive SEO architecture with social metadata and schema markup",
      "Cross-device fluidity tested across smartphones, tablets, and desktop resolutions",
    ],
    results: [
      "Live corporate portal delivering enhanced brand credibility and steady inquiries",
      "100% responsive cross-browser compatibility",
    ],
    technologies: ["React", "Tailwind CSS", "Node.js", "SEO Optimization", "Responsive Design"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1XR0TijAWiGsUX67Y0zCBNyJwTnZiojP4",
    fallbackGradient: "from-purple-600/30 to-pink-600/30",
    link: "https://midtownaabashonltd.com/",
    github: "https://github.com/Maharab2134",
    sourceCodePrivate: true,
    featured: true,
    year: "2024",
  },
  {
    id: "authnova",
    title: "AuthNova Security Suite",
    subtitle: "Full-Stack Authentication & Security Hardening Platform",
    category: "web",
    categoryLabel: "Full Stack",
    description: "Production-ready authentication system featuring dual JWT token rotation, 2FA, rate limiting, and brute-force defenses.",
    longDescription: "AuthNova is an enterprise-grade authentication platform built with React, Node.js, Express, and MongoDB. It implements secure JWT-based access and refresh token flow, bcrypt password hashing, two-factor authentication, account lockouts, login history audit logs, and security headers with Helmet.",
    problem: "Many web applications implement naive authentication vulnerable to XSS token theft, CSRF, and automated credential stuffing attacks.",
    solution: "Designed a zero-trust auth pipeline using HTTP-only cookies, token rotation, automated device fingerprinting, Redis-compatible rate limiters, and strict CORS policies.",
    features: [
      "Double JWT token rotation with short-lived access and secure refresh tokens",
      "Time-based One-Time Password (TOTP) two-factor authentication",
      "Automated suspicious login alerts with IP and user-agent tracking",
      "Rate-limiting and anti-brute-force defense mechanisms",
    ],
    results: [
      "Zero security regression in OWASP Top 10 vulnerability checks",
      "Standardized backend auth boilerplate reusable across multiple client products",
    ],
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "Mongoose", "JWT", "Security Hardening"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1OSRuklnOpq9D5LDy8SWsJwjEqc_gz_Uw",
    fallbackGradient: "from-emerald-600/30 to-teal-600/30",
    github: "https://github.com/Maharab2134/secur-auth-system",
    sourceCodePrivate: false,
    featured: true,
    year: "2024",
  },
  {
    id: "tripfly-bd",
    title: "TripFly BD",
    subtitle: "Travel & Tour Booking Web Portal",
    category: "web",
    categoryLabel: "Web App",
    description: "Full-stack travel booking application with flight and tour comparisons, customized itineraries, and booking management.",
    longDescription: "TripFly BD connects travelers with customized travel packages and tour booking solutions. Features interactive trip planners, destination guides, itinerary breakdowns, and secure booking inquiries.",
    problem: "Travelers in the regional market face fragmented portals with confusing reservation procedures and lack of clear package breakdowns.",
    solution: "Constructed an intuitive single-page travel experience with clear cost breakdowns, dynamic date pickers, destination highlights, and scalable backend queries.",
    features: [
      "Interactive destination explorer with categorized tour packages",
      "Real-time itinerary preview and date-sensitive pricing indicators",
      "Scalable REST API backend designed for high-concurrency booking inquiries",
    ],
    results: [
      "Reduced checkout friction with straightforward reservation forms",
      "Adopted by regional tour travelers for comprehensive trip booking",
    ],
    technologies: ["React", "Tailwind CSS", "Node.js", "PostgreSQL", "JWT", "REST API"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1npkGAUsEzqOWNhpJzGhsV7umYPbCcFEf",
    fallbackGradient: "from-cyan-600/30 to-blue-600/30",
    link: "https://www.tripflybd.com/",
    github: "https://github.com/Maharab2134",
    sourceCodePrivate: true,
    featured: false,
    year: "2024",
  },
  {
    id: "amin-webtech",
    title: "Amin WebTech",
    subtitle: "Digital Agency & Technology Solutions Website",
    category: "web",
    categoryLabel: "Web App",
    description: "Modern agency platform showcasing enterprise web and cloud engineering services with high-conversion landing architecture.",
    longDescription: "Engineered a high-performance business website with tailored service showcases, interactive portfolio carousels, client testimonials, and automated consultation scheduling.",
    problem: "The agency needed to project technical excellence and convert high-ticket enterprise clients with an elite, trustworthy visual identity.",
    solution: "Crafted sleek dark-mode aesthetics using modern glassmorphism, responsive micro-animations, and fast Core Web Vitals performance.",
    features: [
      "Interactive services matrix and technical capability breakdowns",
      "Client testimonial carousels with smooth touch gesture support",
      "Direct consultation inquiry forms with instant confirmation states",
    ],
    results: [
      "Substantial increase in client inquiry conversion rate",
      "Flawless 100/100 performance and accessibility scores",
    ],
    technologies: ["React", "Tailwind CSS", "Framer Motion", "Node.js", "Vite"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1gey8dyGWWP3PkATaZyOo5izsiqoEuNL0",
    fallbackGradient: "from-violet-600/30 to-purple-600/30",
    link: "https://aminwebtech.com/",
    github: "https://github.com/Maharab2134",
    sourceCodePrivate: true,
    featured: false,
    year: "2024",
  },
  {
    id: "student-projects-platform",
    title: "Student Projects Platform",
    subtitle: "Collaborative Academic Repository & Peer Review System",
    category: "web",
    categoryLabel: "Full Stack",
    description: "Centralized collaborative academic platform enabling university students to showcase capstone projects, exchange peer reviews, and connect with mentors.",
    longDescription: "Developed to bridge the gap between academic project completion and professional portfolio showcase. Students can submit repositories, post live demonstration links, and receive structured peer evaluations.",
    problem: "Academic student projects often remain buried in private repositories without structured feedback or public visibility for recruiters.",
    solution: "Built a centralized web portal with file uploads via Multer, role-based access control, search taxonomy, and peer rating algorithms.",
    features: [
      "Structured project submission with live demo and repository linking",
      "Peer review and rating system with moderation mechanisms",
      "Category-based filtering across CSE, Software Engineering, and AI domains",
    ],
    results: [
      "Successfully deployed on Vercel with active student engagement at BUBT",
    ],
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "Multer"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=11QTjup6nMFBZPFJfcZvU9onSz9zc5tqm",
    fallbackGradient: "from-amber-600/30 to-orange-600/30",
    link: "https://student-projects-platform.vercel.app/",
    github: "https://github.com/Maharab2134/student-projects-platform",
    sourceCodePrivate: false,
    featured: false,
    year: "2023",
  },
  {
    id: "pathpilot",
    title: "PathPilot Career Platform",
    subtitle: "Intelligent Career Assessment & Roadmap Platform",
    category: "web",
    categoryLabel: "Full Stack",
    description: "Career assessment web application featuring skill-gap analysis, interactive competency quizzes, and algorithmic pathway recommendations.",
    longDescription: "PathPilot evaluates user capabilities, technical interests, and problem-solving styles to chart custom software engineering learning trajectories.",
    problem: "Aspiring developers struggle with curriculum paralysis due to conflicting guides and unclear career progression milestones.",
    solution: "Engineered an interactive roadmap generator with skill testing assessments and real-time visualization of competency progression using Chart.js.",
    features: [
      "Dynamic multi-step competency assessment engine",
      "Personalized software engineering trajectory recommendations",
      "Skill gap visualization with progress milestone tracking",
    ],
    results: [
      "Helped dozens of junior engineering students chart clear career paths",
    ],
    technologies: ["React", "TypeScript", "Node.js", "Express", "MongoDB", "Chart.js"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1Mue_kK8G70L_hojQijfp5jVlX8yJYHV-",
    fallbackGradient: "from-indigo-600/30 to-cyan-600/30",
    github: "https://github.com/Maharab2134/PathPilot",
    sourceCodePrivate: false,
    featured: false,
    year: "2024",
  },
  {
    id: "foodshare-web",
    title: "FoodShare Community Web",
    subtitle: "Surplus Food Redistribution & Hunger Relief Network",
    category: "web",
    categoryLabel: "Full Stack",
    description: "Social impact web platform connecting restaurants and community food donors with volunteers to reduce food waste.",
    longDescription: "FoodShare coordinates surplus food donations between local food vendors and charity volunteers, utilizing geolocation matching and real-time donor listings.",
    problem: "Enormous amounts of edible food are discarded daily by restaurants due to lack of immediate redistribution channels.",
    solution: "Developed a real-time donation dispatch board with Socket.io updates and Google Maps integration to route volunteer pick-ups rapidly.",
    features: [
      "Real-time food donation postings with expiration countdowns",
      "Volunteer pickup claims and status tracking via WebSockets",
      "Donor analytics tracking meals saved and carbon offset estimates",
    ],
    results: [
      "Award-winning social project concept in university hackathons",
    ],
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Google Maps API", "Express.js"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1oGgvwPBWbmULSUlN6DFac668_CuyVD-i",
    fallbackGradient: "from-emerald-600/30 to-green-600/30",
    github: "https://github.com/Maharab2134/FoodShare_Web",
    sourceCodePrivate: false,
    featured: false,
    year: "2023",
  },

  // --- MOBILE PROJECTS ---
  {
    id: "netbagz",
    title: "NetBagZ E-commerce Mobile App",
    subtitle: "Cross-Platform Mobile Shopping with Real-Time Inventory",
    category: "mobile",
    categoryLabel: "Mobile App",
    description: "High-performance React Native mobile e-commerce application with real-time inventory management, Stripe payment processing, and smooth animations.",
    longDescription: "NetBagZ is a comprehensive mobile shopping application providing instant search, cart persistence, secure payment integrations, order status tracking, and push notifications.",
    problem: "Mobile e-commerce experiences frequently suffer from high latency, dropped checkout sessions, and cumbersome payment steps.",
    solution: "Engineered with React Native and Redux Toolkit for predictive state caching, coupled with a Node.js microservice architecture and Stripe mobile SDK.",
    features: [
      "Lightning-fast product search with predictive autocomplete",
      "Stripe payment gateway integration with 1-click tokenized checkout",
      "Real-time order tracking and push notifications via Firebase Cloud Messaging",
      "Offline-first cart synchronization with Redux Persist",
    ],
    results: [
      "Smooth 60fps animations across both iOS and Android target devices",
      "Modular clean architecture separating UI, state, and network layers",
    ],
    technologies: ["React Native", "Node.js", "MongoDB", "Redux Toolkit", "Stripe", "Firebase", "Express.js"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1N_z7JZcts-Le2hgJPR9qSytTxMoTzgv2",
    fallbackGradient: "from-purple-600/30 to-indigo-600/30",
    github: "https://github.com/Maharab2134/NetBagZ",
    sourceCodePrivate: false,
    featured: true,
    year: "2023",
  },
  {
    id: "bachlife",
    title: "BachLife Finance Tracker",
    subtitle: "Flutter Personal Finance & Expense Management App",
    category: "mobile",
    categoryLabel: "Mobile App",
    description: "Cross-platform mobile personal finance app built with Flutter and Firebase, featuring budget categorization, expense analytics, and savings goals.",
    longDescription: "BachLife helps individuals, students, and freelancers track daily expenditures, categorize spending habits, set milestone savings goals, and visualize cash flow trends with interactive charts.",
    problem: "Traditional budgeting apps are often overly complex or bloated with paywalls, discouraging regular financial tracking.",
    solution: "Designed an intuitive Material 3 interface with single-tap expense logging, automated monthly budget breakdowns, and offline-first local persistence.",
    features: [
      "1-tap transaction logging with customizable spending categories",
      "Visual cashflow analytics and monthly spending breakdown charts",
      "Cloud synchronization with Firebase Authentication and Firestore",
      "Offline storage fallback using Hive / SharedPreferences",
    ],
    results: [
      "High user retention among peer test groups",
      "Seamless cross-platform build for Android & iOS from a single Dart codebase",
    ],
    technologies: ["Flutter", "Dart", "Firebase", "Provider", "Chart Visualization", "Material 3"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1uTZCWKh6PftTikrXZOde-l4spvCPWBEM",
    fallbackGradient: "from-green-600/30 to-emerald-600/30",
    github: "https://github.com/Maharab2134/BachLife-app",
    sourceCodePrivate: false,
    featured: true,
    year: "2024",
  },
  {
    id: "food-delivery-app",
    title: "Food Express Mobile App",
    subtitle: "On-Demand Food Ordering & Delivery Tracking",
    category: "mobile",
    categoryLabel: "Mobile App",
    description: "Complete food delivery mobile ecosystem connecting customers with local dining menus, automated cart calculations, and live dispatch tracking.",
    longDescription: "Built with Flutter and Node.js to provide an end-to-end food ordering experience. Features restaurant discovery, customizable dish options, instant cart calculations, and live driver routing.",
    problem: "Real-time dispatch synchronization and accurate order status updates require reliable low-latency mobile state management.",
    solution: "Leveraged Flutter's reactive UI combined with Socket.io event listeners and Google Maps SDK for smooth live location rendering.",
    features: [
      "Interactive restaurant menu browsing with dietary filters",
      "Live order dispatch tracking on interactive Google Maps",
      "Secure payment workflows and order history archiving",
    ],
    results: [
      "Comprehensive full-stack architecture demo with working mobile client and backend",
    ],
    technologies: ["Flutter", "Dart", "Node.js", "MongoDB", "Google Maps API", "Express.js"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1ayPzSd5py__Qx1tssMfoCvckFkKrEBOZ",
    fallbackGradient: "from-rose-600/30 to-red-600/30",
    github: "https://github.com/Maharab2134/food-delivery",
    sourceCodePrivate: false,
    featured: false,
    year: "2023",
  },
  {
    id: "social-media-app",
    title: "Pulse Social Mobile App",
    subtitle: "Real-Time Social Networking & Direct Messaging App",
    category: "mobile",
    categoryLabel: "Mobile App",
    description: "Modern social network application built with React Native and Socket.io, featuring story publishing, feeds, and instant encrypted chat.",
    longDescription: "A full-featured mobile social experience with photo sharing, dynamic community feeds, instant push notifications, and bi-directional messaging.",
    problem: "Maintaining snappy feed scrolling while handling live incoming messages requires careful memory and thread management in mobile JavaScript.",
    solution: "Optimized FlatList virtualized rendering, asynchronous image caching, and isolated WebSockets workers for background sync.",
    features: [
      "Dynamic activity feed with infinite scrolling and like/comment threads",
      "Instant 1-on-1 and group messaging powered by WebSockets",
      "Media upload pipeline with automated thumbnail compression",
    ],
    results: [
      "Consistent 60fps feed scrolling with instant message delivery",
    ],
    technologies: ["React Native", "Socket.io", "Node.js", "MongoDB", "Redis", "AWS S3"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1Kq8wcbRws98TnO3lqmRSNYx04NlR1oXk",
    fallbackGradient: "from-blue-600/30 to-violet-600/30",
    github: "https://github.com/Maharab2134/Social_Media_App",
    sourceCodePrivate: false,
    featured: false,
    year: "2023",
  },

  // --- AI & MACHINE LEARNING ---
  {
    id: "image-classification",
    title: "Deep Image Classifier",
    subtitle: "Computer Vision Model with Transfer Learning",
    category: "ml",
    categoryLabel: "AI / ML",
    description: "High-accuracy computer vision classification pipeline using transfer learning (ResNet50 / MobileNet) with a deployed Flask inference microservice.",
    longDescription: "Engineered a production-ready computer vision pipeline capable of multi-class classification on custom visual datasets. Achieved 95% validation accuracy through data augmentation, learning rate scheduling, and fine-tuning top layers.",
    problem: "Training deep convolutional neural networks from scratch on limited datasets often leads to catastrophic overfitting.",
    solution: "Employed pre-trained feature extractors via transfer learning, augmented with random transformations, and packaged with a lightweight REST inference API.",
    features: [
      "Transfer learning architecture achieving 95% benchmark accuracy",
      "Automated image pre-processing and dynamic data augmentation pipeline",
      "Dockerized Flask / FastAPI inference endpoint for instant web integration",
    ],
    results: [
      "Inference latency under 120ms per visual query",
      "Demonstrated practical ML deployment readiness",
    ],
    technologies: ["TensorFlow", "Keras", "Python", "OpenCV", "NumPy", "Flask", "Pandas"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1u94a_6dY2HjrRldtcVg2YaHaaifNI42t",
    fallbackGradient: "from-amber-600/30 to-yellow-600/30",
    github: "https://github.com/Maharab2134/image-classifier",
    sourceCodePrivate: false,
    featured: true,
    year: "2024",
  },
  {
    id: "sentiment-analyzer",
    title: "NLP Sentiment Analyzer",
    subtitle: "Transformer-Powered Text Sentiment Analysis Engine",
    category: "ml",
    categoryLabel: "AI / ML",
    description: "Natural Language Processing system analyzing sentiment polarity in user feedback, social discussions, and reviews with BERT embeddings.",
    longDescription: "A sentiment classification engine built for social and consumer feedback comprehension. Fine-tuned transformer models evaluate contextual polarity (positive, neutral, negative) along with emotional intensity scores.",
    problem: "Traditional bag-of-words and lexicon-based models fail to interpret sarcasm, negations, and complex linguistic nuances.",
    solution: "Implemented fine-tuned BERT and DistilBERT architectures through the HuggingFace Transformers library with FastAPI endpoints.",
    features: [
      "Transformer-based contextual sentiment classification",
      "Batch evaluation and real-time single-sentence analysis modes",
      "Clean REST API documentation with Swagger / OpenAPI",
    ],
    results: [
      "Achieved 91.4% F1-score across benchmark product review datasets",
    ],
    technologies: ["PyTorch", "Transformers", "BERT", "Python", "FastAPI", "NLTK", "Scikit-learn"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1rpRFs4UedKCCcHdYL_v0wGPfdOZ0qg9E",
    fallbackGradient: "from-orange-600/30 to-rose-600/30",
    github: "https://github.com/Maharab2134/sentiment-analyzer",
    sourceCodePrivate: false,
    featured: false,
    year: "2024",
  },
  {
    id: "time-series-forecasting",
    title: "Predictive Time-Series Forecaster",
    subtitle: "LSTM & Prophet Trend Forecasting Pipeline",
    category: "ml",
    categoryLabel: "AI / ML",
    description: "Deep learning time-series model utilizing LSTM recurrent networks and Facebook Prophet for trend analysis and anomaly detection.",
    longDescription: "A multivariate forecasting platform designed to model sequential data patterns, cyclical fluctuations, and anomaly points in operational metrics.",
    problem: "Simple statistical moving averages fail to capture complex non-linear relationships and seasonal cycles in real-world time-series data.",
    solution: "Constructed dual modeling pipelines: an LSTM neural network for fine-grained multi-step prediction and Prophet for seasonal decomposing.",
    features: [
      "Multi-step forecasting with 95% confidence intervals",
      "Automated anomaly detection flagging out-of-distribution values",
      "Interactive data visualization charts built with Plotly",
    ],
    results: [
      "Significantly reduced Mean Absolute Percentage Error (MAPE) compared to baseline ARIMA",
    ],
    technologies: ["TensorFlow", "LSTM", "Prophet", "Python", "Pandas", "Plotly", "FastAPI"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1uL9IaOAvIIUeMriPFY9gB5dZDh3KImrE",
    fallbackGradient: "from-purple-600/30 to-cyan-600/30",
    github: "https://github.com/Maharab2134/forecasting",
    sourceCodePrivate: false,
    featured: false,
    year: "2024",
  },

  // --- IOT & HARDWARE ---
  {
    id: "smart-home-iot",
    title: "Smart Home Automation Hub",
    subtitle: "ESP32 & MQTT Cloud Connected Home System",
    category: "iot",
    categoryLabel: "IoT / Hardware",
    description: "Microcontroller-based smart home automation hub featuring ESP32, MQTT telemetry, relay control, and mobile remote management.",
    longDescription: "An end-to-end IoT platform enabling homeowners to automate appliance schedules, monitor power consumption, and receive emergency sensor alerts through mobile apps.",
    problem: "Proprietary smart home systems lock users into expensive walled ecosystems without local network control fallbacks.",
    solution: "Engineered an open ESP32 hardware architecture communicating over MQTT with a lightweight Node.js broker and Flutter companion app.",
    features: [
      "Sub-100ms remote device switching via lightweight MQTT messaging",
      "Real-time sensor telemetry (temperature, humidity, fire detection)",
      "Local fallback offline switching when Internet connectivity drops",
    ],
    results: [
      "Successfully built, wired, and demonstrated working physical hardware prototype",
    ],
    technologies: ["ESP32", "Arduino C++", "MQTT", "Node.js", "Flutter", "Firebase", "Sensors"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1-n_olWQeEIS10Ng2-xCdVTGiBdmbwOJA",
    fallbackGradient: "from-teal-600/30 to-blue-600/30",
    github: "https://github.com/Maharab2134/smart-home-iot",
    sourceCodePrivate: false,
    featured: true,
    year: "2024",
  },
  {
    id: "agricultural-monitoring",
    title: "Smart Agriculture Monitoring",
    subtitle: "Precision Soil & Automated Irrigation IoT Solution",
    category: "iot",
    categoryLabel: "IoT / Hardware",
    description: "IoT solution for precision agriculture monitoring soil moisture, ambient humidity, and controlling automated solar irrigation pumps.",
    longDescription: "Built to conserve irrigation water and optimize crop yield by measuring multi-depth soil moisture levels and triggering automated drip irrigation.",
    problem: "Over-watering and inaccurate manual irrigation waste up to 40% of agricultural water reserves.",
    solution: "Deployed solar-powered microcontroller nodes streaming sensor telemetry via MQTT to a central telemetry dashboard.",
    features: [
      "Multi-depth soil moisture and ambient temperature telemetry",
      "Threshold-based automatic water pump control with manual override",
      "Historical data logging and weather forecast correlation",
    ],
    results: [
      "Demonstrated 30% water conservation in pilot test setups",
    ],
    technologies: ["Raspberry Pi", "Arduino", "Python", "MQTT", "React", "MongoDB"],
    image: "https://images.weserv.nl/?url=drive.google.com/uc?export=view%26id=1bTt2507LWcYpotpPHVEwLg5zu4G8s2-z",
    fallbackGradient: "from-emerald-600/30 to-teal-600/30",
    github: "https://github.com/Maharab2134/agriculture-iot",
    sourceCodePrivate: false,
    featured: false,
    year: "2023",
  },
];

export const getProjectById = (id: string): Project | undefined => {
  return PROJECTS.find((p) => p.id.toLowerCase() === id.toLowerCase());
};

export const getFeaturedProjects = (): Project[] => {
  return PROJECTS.filter((p) => p.featured);
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (!category || category === "all") return PROJECTS;
  return PROJECTS.filter((p) => p.category === category);
};
