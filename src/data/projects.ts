export interface ResearchProject {
  id: string; shortTitle: string; title: string; venue: string; year: string;
  category: string; authors: string; equalContribution?: string; question: string;
  summary: string; image: string; imageAlt: string;
  links: { label: string; href: string }[];
  related?: { title: string; venue: string; href: string };
}
// Related workshop papers are grouped with their full-paper research project.
export const projects: ResearchProject[] = [
  {
    id: "3d-foj", shortTitle: "3D Field of Junctions",
    title: "3D Field of Junctions: A Noise-Robust, Training-Free Structural Prior for Volumetric Inverse Problems",
    venue: "ECCV", year: "2026", category: "Geometric priors",
    authors: "Namhoon Kim*, Narges Moeini*, Justin Romberg, Sara Fridovich-Keil",
    equalContribution: "* Equal contribution; author order determined by coin flip.",
    question: "Recovering 3D structure without training data.",
    summary: "We represent a volume as overlapping junctions of 3D wedges, fitting local geometry while encouraging consistency across patches. This training-free prior preserves sharp boundaries in noisy low-dose CT, cryo-electron tomography, and point clouds, and can be used within iterative reconstruction algorithms.",
    image: "/images/3d-foj-teaser.png", imageAlt: "Noisy inputs above 3D FoJ results for low-dose CT, cryo-electron tomography, and point-cloud denoising.",
    links: [
      { label: "Project page", href: "https://voilalab.github.io/3D-Field-of-Junctions/" },
      { label: "Paper", href: "https://arxiv.org/abs/2603.02149" },
      { label: "Code", href: "https://github.com/voilalab/3D-Field-of-Junctions" },
    ],
    related: { title: "3D Field of Junctions: A Noise-Robust, Training-Free Structural Prior for Low-Dose CT", venue: "VISION Workshop at CVPR 2026", href: "https://vision-workshop-26.github.io/cvpr-2026/" },
  },
  {
    id: "inr-vs-grid", shortTitle: "INRs vs. grids",
    title: "Grids Often Outperform Implicit Neural Representation at Compressing Dense Signals",
    venue: "NeurIPS", year: "2025", category: "Signal representations",
    authors: "Namhoon Kim, Sara Fridovich-Keil",
    question: "When is a neural representation the right choice?",
    summary: "We compare neural, hybrid, and grid representations across 2D and 3D signals at matched parameter budgets. Regularized interpolated grids often fit dense signals faster and more accurately, while neural representations can be advantageous for lower-dimensional structure such as shape contours. The benchmark connects these differences to signal bandwidth, model capacity, and inverse tasks.",
    image: "/images/inr-signal-examples.png", imageAlt: "Sphere patterns, Sierpinski triangles, and bandlimited signals at complexity levels 0.1, 0.3, 0.5, and 0.7.",
    links: [
      { label: "Project page", href: "https://voilalab.github.io/INR-benchmark/" },
      { label: "Paper", href: "https://openreview.net/forum?id=OZljvntsto" },
      { label: "Code", href: "https://github.com/voilalab/INR-benchmark" },
    ],
  },
  {
    id: "uncertainty", shortTitle: "Uncertainty under distribution shift",
    title: "Towards Distribution-Shift Uncertainty Estimation for Inverse Problems with Generative Priors",
    venue: "IEEE CAMSAP · Invited paper", year: "2025", category: "Reliable reconstruction",
    authors: "Namhoon Kim, Sara Fridovich-Keil",
    question: "Recognizing when a learned prior may be unreliable.",
    summary: "A learned prior can produce a convincing reconstruction even when the target differs from its training data. We use variation across reconstructions from randomized measurements as an instance-level indicator of distribution shift. Experiments on tomographic reconstruction of MNIST digits show increased instability for out-of-distribution targets, without calibration data or retraining.",
    image: "/images/uncertainty-reconstructions.png", imageAlt: "Digits 0, 1, 4, and 7 reconstructed from 11 and 33 projection angles, compared with ground truth.",
    links: [
      { label: "Project page", href: "https://voilalab.github.io/uncertainty_quantification_LPN/" },
      { label: "Paper", href: "https://arxiv.org/abs/2510.10947" },
      { label: "Code", href: "https://github.com/voilalab/uncertainty_quantification_LPN" },
    ],
    related: { title: "Uncertainty Quantification for Inverse Problems with Generative Priors under Distribution Shift", venue: "Statistical Frontiers in LLMs and Foundation Models Workshop at NeurIPS 2024", href: "https://neurips.cc/media/neurips-2024/Slides/105621_PNAiCov.pdf" },
  },
  {
    id: "vi-prism", shortTitle: "VI-PRISM",
    title: "Perfusion Imaging and Single Material Reconstruction in Polychromatic Photon Counting CT",
    venue: "Preprint", year: "2026", category: "Physics-based imaging",
    authors: "Namhoon Kim, Ashwin Pananjady, Amir Pourmorteza, Sara Fridovich-Keil",
    question: "Reconstructing contrast-agent concentration with fewer photons.",
    summary: "We adapt a variational-inequality reconstruction method to polychromatic photon-counting perfusion CT, estimating iodine concentration with a known static background. Digital-phantom experiments investigate how to distribute a limited photon budget across projection views and demonstrate improved reconstruction over filtered back-projection in low-dose settings.",
    image: "/images/vi-prism.png", imageAlt: "Ground-truth air, water, and iodine material maps and CT image of the digital perfusion phantom.",
    links: [
      { label: "Paper", href: "https://arxiv.org/abs/2602.02713" },
      { label: "Code", href: "https://github.com/voilalab/VI-PRISM" },
    ],
  },
];
