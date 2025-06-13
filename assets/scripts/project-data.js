/* Project information used by project.html to populate details. */
const PROJECTS = {
  "real-estate": {
    title: "Salesforce Real Estate Management",
    image: "assets/img/real-estate-project.png",
    summary: "A Salesforce solution that optimizes real estate operations and tracking for agents.",
    repo: "https://github.com/sagarsahore/Salesforce_Projects/blob/main/Real%20Estate%20Optimization%20for%20Caine%20Statham.md",
    role: [
      "Configured Sales Cloud features and automation",
      "Integrated property data flows from external platforms"
    ],
    featuresDesc: "The system streamlines property listings and client management.",
    features: [
      "Lead assignment automation",
      "Interactive dashboards",
      "Custom Lightning components"
    ],
    tech: "Salesforce Sales Cloud, Apex, Lightning Web Components",
    challenges: [
      { challenge: "Data consistency across objects", solution: "Built validation rules and triggers" },
      { challenge: "User onboarding", solution: "Created simple page layouts and training guides" }
    ]
  },
  "imdb": {
    title: "Salesforce IMDB Clone",
    image: "assets/img/imdb_project.png",
    summary: "An IMDB-style application built on Salesforce showing movie data.",
    repo: "https://github.com/sagarsahore/Salesforce_Projects/blob/main/Salesforce-imdb-project.md",
    role: [
      "Designed object schema and relationships",
      "Implemented Apex classes for data import"
    ],
    featuresDesc: "Allows users to browse and rate movies within Salesforce.",
    features: [
      "Movie catalog with search",
      "Rating and review system",
      "Responsive Lightning pages"
    ],
    tech: "Salesforce Platform, Apex, LWC",
    challenges: [
      { challenge: "Large data import", solution: "Used batch Apex" },
      { challenge: "Complex relationships", solution: "Leveraged junction objects" }
    ]
  },
  "cricket": {
    title: "Salesforce Cricket Dashboard",
    image: "assets/img/cricketdashboard_project.png",
    summary: "Displays IPL statistics inside Salesforce for quick insights.",
    repo: "https://github.com/sagarsahore/Salesforce-Cricket-IPL-Dashboard",
    role: [
      "Developed Apex REST integrations",
      "Built interactive Lightning dashboards"
    ],
    featuresDesc: "Provides real-time match and player statistics.",
    features: [
      "Dynamic charts",
      "Team and player profiles",
      "Mobile-first design"
    ],
    tech: "Salesforce, Apex, Chart.js",
    challenges: [
      { challenge: "Real-time data updates", solution: "Scheduled REST calls with caching" },
      { challenge: "Visualizing complex stats", solution: "Customized Chart.js components" }
    ]
  },
  "ecommerce": {
    title: "MERN Stack E-commerce Website",
    image: "assets/img/ecommerce-project.png",
    summary: "A full-stack online store with secure checkout and admin dashboards.",
    repo: "https://github.com/sagarsahore/Full_Stack_Project",
    role: [
      "Implemented API using Node and Express",
      "Created React storefront and admin panel"
    ],
    featuresDesc: "Supports product management and real-time order tracking.",
    features: [
      "User authentication",
      "Shopping cart",
      "Admin product controls"
    ],
    tech: "MongoDB, Express, React, Node.js",
    challenges: [
      { challenge: "Payment processing", solution: "Integrated Stripe securely" },
      { challenge: "Scalable catalog", solution: "Implemented pagination and lazy loading" }
    ]
  },
  "web-redesign": {
    title: "Website Redesign Concept",
    image: "assets/img/attachment-06.jpg",
    summary: "Conceptual UX redesign for a marketing website.",
    repo: "#",
    role: [
      "Created wireframes and mockups",
      "Implemented responsive HTML/CSS prototype"
    ],
    featuresDesc: "Focused on improving brand consistency and user flow.",
    features: [
      "Clean layout",
      "Accessible color palette",
      "Mobile friendly"
    ],
    tech: "HTML, CSS, UX Design",
    challenges: [
      { challenge: "Legacy style guide", solution: "Introduced modern components while keeping branding" }
    ]
  },
  "app-prototype": {
    title: "Mobile App Prototype",
    image: "assets/img/attachment-05.jpg",
    summary: "A rapid prototype of a cross\u2011platform mobile application.",
    repo: "#",
    role: [
      "Designed UI/UX",
      "Implemented core Flutter screens"
    ],
    featuresDesc: "Demonstrates main flows for investors.",
    features: [
      "Login and user profile",
      "Push notification mockup",
      "Firebase backend"
    ],
    tech: "Flutter, Firebase",
    challenges: [
      { challenge: "Sync across devices", solution: "Used Firebase auth and realtime database" }
    ]
  },
  "data-dashboard": {
    title: "Data Visualization Dashboard",
    image: "assets/img/attachment-04.jpg",
    summary: "Interactive dashboard presenting business KPIs.",
    repo: "#",
    role: [
      "Engineered ETL scripts",
      "Built visualizations with D3.js"
    ],
    featuresDesc: "Transforms complex datasets into clear visuals.",
    features: [
      "Filterable charts",
      "Downloadable reports",
      "Responsive layout"
    ],
    tech: "Python, D3.js",
    challenges: [
      { challenge: "Handling large CSV files", solution: "Optimized parsing with generators" }
    ]
  }
};
