// Skill groups — edit freely; the grid re-renders from this array.
// `art` is a tiny inline SVG illustration (animated via CSS) shown in the icon
// box; it inherits the card's accent colour through `currentColor`. `icon` is a
// plain-glyph fallback used if `art` is ever removed.
export const skills = [
  {
    icon: "</>",
    art: `<svg class="skill-art" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 7 4 12 9 17"/><polyline points="15 7 20 12 15 17"/><line class="sk-blink" x1="12" y1="8.5" x2="12" y2="15.5"/></svg>`,
    title: "Languages",
    items: ["JavaScript", "TypeScript", "Python", "C / C++", "SQL", "HTML5", "CSS3"],
  },
  {
    icon: "▲",
    art: `<svg class="skill-art" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><rect class="sk-pulse" x="6" y="12.2" width="10" height="2.4" rx="1.2" fill="currentColor" stroke="none"/></svg>`,
    title: "Frontend",
    items: ["React.js", "Next.js", "GSAP", "Responsive UI", "Design Systems", "Perf Tuning"],
  },
  {
    icon: "⚙",
    art: `<svg class="skill-art" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g class="sk-spin"><circle cx="12" cy="12" r="3.4"/><line x1="12" y1="3" x2="12" y2="5.6"/><line x1="12" y1="18.4" x2="12" y2="21"/><line x1="3" y1="12" x2="5.6" y2="12"/><line x1="18.4" y1="12" x2="21" y2="12"/><line x1="5.6" y1="5.6" x2="7.4" y2="7.4"/><line x1="16.6" y1="16.6" x2="18.4" y2="18.4"/><line x1="16.6" y1="7.4" x2="18.4" y2="5.6"/><line x1="5.6" y1="18.4" x2="7.4" y2="16.6"/></g></svg>`,
    title: "Backend & APIs",
    items: ["Flask", "Django", "REST APIs", "JWT Auth", "RBAC", "Edge Runtime"],
  },
  {
    icon: "◈",
    art: `<svg class="skill-art" viewBox="0 0 24 24" fill="currentColor" stroke="none"><rect class="sk-bar" x="4" y="5" width="3.6" height="15" rx="1"/><rect class="sk-bar" x="10.2" y="5" width="3.6" height="15" rx="1"/><rect class="sk-bar" x="16.4" y="5" width="3.6" height="15" rx="1"/></svg>`,
    title: "Data & ML",
    items: ["Pandas", "NumPy", "Scikit-learn", "Union-Find / DSU", "Data Viz"],
  },
  {
    icon: "▤",
    art: `<svg class="skill-art" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6 V18 C5 19.4 8.1 20.6 12 20.6 C15.9 20.6 19 19.4 19 18 V6"/><path class="sk-fade" d="M5 12 C5 13.4 8.1 14.6 12 14.6 C15.9 14.6 19 13.4 19 12"/></svg>`,
    title: "Databases",
    items: ["MongoDB", "Redis", "Upstash", "Relational DBs"],
  },
  {
    icon: "☁",
    art: `<svg class="skill-art" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g fill="currentColor" stroke="none"><circle cx="9.5" cy="16" r="3"/><circle cx="14.6" cy="15.4" r="3.7"/><rect x="6.4" y="15.6" width="11.4" height="4" rx="2"/></g><g class="sk-bob"><line x1="12" y1="12" x2="12" y2="4"/><polyline points="9 7 12 4 15 7"/></g></svg>`,
    title: "Cloud & DevOps",
    items: ["AWS (EC2)", "Azure", "GCP", "Git / GitHub", "Linux", "CI/CD"],
  },
  {
    icon: "✦",
    art: `<svg class="skill-art" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path class="sk-twinkle" d="M12 2 L13.7 9.4 L21 11 L13.7 12.6 L12 20 L10.3 12.6 L3 11 L10.3 9.4 Z"/></svg>`,
    title: "Craft & Practice",
    items: ["SOLID", "Design Patterns", "Agile / Scrum", "Profiling", "Scalability"],
  },
];
