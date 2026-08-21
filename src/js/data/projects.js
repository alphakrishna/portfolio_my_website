// Projects — first item renders as the featured (larger) block.
// Add liveUrl / codeUrl when you have public links; empty strings hide the link.
export const projects = [
  {
    glyph: "WT",
    title: "WaveTag",
    role: "Associate SDE · BDH IT Solutions",
    blurb:
      "An anonymous vehicle-contact system. Scanners open a browser-native page in under 500ms — no app, no sign-up — while owners run a PWA dashboard. A Next.js Edge gateway maps each physical QR tag to an opaque token in sub-50ms, and Exotel bridges masked PSTN calls in <3s so no real number is ever exposed.",
    tech: ["Next.js", "React", "Edge Runtime", "Exotel API", "Upstash Redis", "MongoDB Atlas"],
    liveUrl: "",
    codeUrl: "",
    featured: true,
  },
  {
    glyph: "EA",
    title: "Employee Activity Monitoring",
    role: "Junior SDE · VS Associates",
    blurb:
      "React dashboards delivering individual and team-level metrics for 100+ employees. Cut dashboard load time 40% with React.memo, custom hooks and component-level state isolation, and secured access with stateless JWT + Redis-managed refresh tokens (RBAC).",
    tech: ["React.js", "JWT", "Redis", "RBAC", "Performance"],
    liveUrl: "",
    codeUrl: "",
  },
  {
    glyph: "DV",
    title: "Data Visualization Platform",
    role: "Junior SDE · VS Associates",
    blurb:
      "Interactive, accessible interfaces for exploring relationship networks. Used Union-Find (DSU) to dynamically cluster 1,000+ client relationship graphs into connected families, enabling scalable rendering — deployed on AWS for fast asset delivery.",
    tech: ["React.js", "Union-Find / DSU", "AWS", "Data Viz"],
    liveUrl: "",
    codeUrl: "",
  },
  {
    glyph: "ML",
    title: "Startup Acquisition Predictor",
    role: "Software Intern · DRDO",
    blurb:
      "A Flask ML backend predicting startup acquisition likelihood with classifier models, backed by pandas/NumPy preprocessing pipelines that cleaned and transformed 500+ startup records into training-ready features.",
    tech: ["Flask", "Scikit-learn", "Pandas", "NumPy"],
    liveUrl: "",
    codeUrl: "",
  },
  {
    glyph: "IC",
    title: "InCITe 2023 Conference Site",
    role: "Tech Lead · Amity University",
    blurb:
      "The official conference website for InCITe 2023 — responsive, intuitive UX that boosted attendee engagement by 30%. Also 1st place at InCITe for ARITech, an AR-based learning project.",
    tech: ["JavaScript", "Responsive UI", "UX"],
    liveUrl: "",
    codeUrl: "",
  },
];
