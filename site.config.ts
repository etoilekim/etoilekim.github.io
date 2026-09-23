import { defineSiteConfig } from "./src/config/site";
export const siteConfig = defineSiteConfig({
  title: "Namhoon Kim", author: "Namhoon Kim", siteUrl: "https://etoilekim.github.io",
  description: "Namhoon Kim is a Ph.D. student at Georgia Tech working with Sara Fridovich-Keil on computational imaging, signal representations, and reliable inverse problems.",
  keywords: ["Namhoon Kim", "computational imaging", "inverse problems", "neural representations", "uncertainty quantification", "Georgia Tech"],
  hero: {
    headline: "Representing, reconstructing, and understanding the visual world.",
    subheadline: "I study how representations and priors shape what we can recover from imperfect measurements, and how to understand when a reconstruction can be trusted.",
    profileImage: "/images/namhoon.jpeg", profileAlt: "Portrait of Namhoon Kim", profileImageWidth: 360, profileImageHeight: 531,
  },
  affiliations: [{ role: "Ph.D. student in Machine Learning", department: "Electrical and Computer Engineering", institution: "Georgia Institute of Technology", url: "https://www.gatech.edu/" }],
  navLinks: [{ href: "/", label: "Home" }, { href: "/projects/", label: "Publications" }, { href: "/cv/", label: "CV" }],
  researchInterests: ["Computational imaging", "Signal representations", "Inverse problems", "Uncertainty quantification"],
  socialLinks: [
    { label: "Email", href: "mailto:namhoon@gatech.edu", icon: "i-ph-envelope" },
    { label: "Scholar", href: "https://scholar.google.com/citations?user=OXpGAvAAAAAJ", icon: "i-academicons-google-scholar" },
    { label: "GitHub", href: "https://github.com/etoilekim", icon: "i-mdi-github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/etoilekim/", icon: "i-mdi-linkedin" },
  ],
  footer: { showAuthor: true, showProfileLinks: false },
  homeBlocks: { showcase: { enabled: false }, publications: { enabled: false }, posts: { enabled: false } },
});
export default siteConfig;
