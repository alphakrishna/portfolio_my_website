// Case studies — client problems solved, told as Problem -> Approach -> Outcome.
// Keep these truthful; add a `link` when the work is public.
export const caseStudies = [
  {
    context: "Diagnostics referral lab",
    title: "A test-finder site the lab can trust with zero patient data",
    problem:
      "A histopathology and molecular-diagnostics lab needed referring doctors and patients to find the right test fast and look credible, without a heavy CMS to maintain or any patient data at risk.",
    approach:
      "Built 20+ pages in plain HTML, CSS, and JavaScript (no framework, no build step), a rule-based chatbot that acts as a test-finder, a de-identified case-study library, and Web3Forms enquiry flows, all themed from CSS tokens with per-page SEO and GA4.",
    outcome:
      "Loads fast and deploys anywhere, stores no patient data (DPDP-safe), and stays accessible down to 320px at WCAG AA.",
    tech: ["Vanilla JS", "HTML5 / CSS3", "Rule-based Chatbot", "SEO / GA4"],
    link: "",
  },
  {
    context: "Personal brand · Advisory",
    title: "Turning 29 years of authority into a site that wins consulting leads",
    problem:
      "A senior diagnostics leader needed a personal brand site that conveyed decades of authority and turned visitors into consulting and partnership enquiries.",
    approach:
      "Designed a healthcare-grade brand site: an animated hero that cycles seven positioning lines, a live ticker of career milestones, a cutout portrait with soft teal-to-white gradients, and scroll-reveal sections across About, Consulting, Journey, Academic, and Blog.",
    outcome:
      "A fast, responsive, SEO-ready presence with a one-step enquiry flow, live at drarpangandhi.com.",
    tech: ["Responsive UI", "Scroll Animations", "SEO", "Blog"],
    link: "https://drarpangandhi.com/",
  },
  {
    context: "Transportation · Data platform",
    title: "Mapping 1,000+ relationships without the page grinding to a halt",
    problem:
      "A transportation client needed to visualise 1,000+ interlinked relationships with generation-level detail, on an architecture that stayed fast and scalable as the data grew.",
    approach:
      "Built dynamic rendering on a DSU (Union-Find) data structure with custom RESTful APIs and a lightweight React front end, deployed on AWS.",
    outcome:
      "Cut initial load times and kept the graph responsive at scale, with a clean API other teams could build on.",
    tech: ["React.js", "DSU / Union-Find", "REST APIs", "AWS"],
    link: "",
  },
];
