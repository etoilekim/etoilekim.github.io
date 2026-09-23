# Content sources and editorial notes

Prepared 2026-09-22. The old Google Sites biography was not used as the basis of the new Home page.

## Identity and current research

- User-supplied CV, last updated August 2026. Copied without modification to `public/files/CV_Namhoon_Kim.pdf`.
- [VOILA Lab](https://voilalab.github.io/) and [Sara Fridovich-Keil](https://sarafridov.github.io/).
- Profile portrait: existing lab asset, `images/teampic/namhoon.jpeg` in the VOILA Lab website repository.
- The Home biography summarizes the research themes of the four projects below. It does not assert a new unpublished project or a future research commitment.

## First-author research

| Project | Main publication | Related workshop version |
| --- | --- | --- |
| 3D Field of Junctions | ECCV 2026; equal first authorship with Narges Moeini | VISION Workshop at CVPR 2026, low-dose CT version |
| INRs vs. grids | NeurIPS 2025 | — |
| Uncertainty under distribution shift | IEEE CAMSAP 2025, invited paper | Statistical Frontiers in LLMs and Foundation Models, NeurIPS 2024 |
| VI-PRISM | Public preprint, 2026 | — |

The journal submission listed as under review in the CV is presented as a preprint on Projects; no journal acceptance is implied. Workshop versions are grouped with the corresponding main paper to avoid duplicating the research description. Coauthored papers without first authorship remain in the original CV.

### 3D Field of Junctions

- [Project](https://voilalab.github.io/3D-Field-of-Junctions/)
- [Paper](https://arxiv.org/abs/2603.02149)
- [Code](https://github.com/voilalab/3D-Field-of-Junctions)
- Thumbnail: the first teaser figure on the project page, `static/images/teaser.png`, showing low-dose CT, cryo-ET, and point-cloud comparisons.
- The CV and project page confirm ECCV 2026 and equal contribution. Author order was determined by coin flip.

### INRs vs. grids

- [Project](https://voilalab.github.io/INR-benchmark/)
- [Accepted paper](https://openreview.net/forum?id=OZljvntsto)
- [Preprint](https://arxiv.org/abs/2506.11139)
- [Code](https://github.com/voilalab/INR-benchmark)
- Thumbnail: user-supplied figure showing sphere patterns, Sierpinski triangles, and bandlimited signals at increasing complexity.
- Title follows the accepted paper and CV (singular “Representation”).

### Uncertainty quantification

- [Project](https://voilalab.github.io/uncertainty_quantification_LPN/)
- [Paper](https://arxiv.org/abs/2510.10947)
- [Code](https://github.com/voilalab/uncertainty_quantification_LPN)
- [2024 workshop presentation](https://neurips.cc/virtual/2024/105621)
- Thumbnail: user-supplied MNIST reconstruction comparison at 11, 22, and 33 angles, with a ground-truth row.
- Description treats reconstruction variability as an empirical indicator, without claiming a general uncertainty guarantee.

### VI-PRISM

- [Paper](https://arxiv.org/abs/2602.02713)
- [Code](https://github.com/voilalab/VI-PRISM)
- Figure: [original material maps](https://arxiv.org/html/2602.02713v1/material_maps.png).
- No dedicated project page was identified, so the entry links directly to the paper and code.

Scientific source images are preserved unchanged. `ResearchThumbnail.astro` composes exact source viewports in a fixed 3:2 layout, with labels outside the image panels. No image data is generated, retouched, or stretched. The linked project pages provide the complete original figures.

- 3D FoJ: noisy-input detail and 3D FoJ result for all three modalities; other baseline columns are omitted. The source's overlaid method captions are excluded and replaced by shared row labels.
- INRs vs. grids: complete tiles at complexity 0.1, 0.3, 0.5, and 0.7, retaining all three signal families.
- Uncertainty: complete digit 0, 1, 4, and 7 tiles for 11 angles, 33 angles, and ground truth. The intermediate 22-angle row is omitted to keep the thumbnail readable.
