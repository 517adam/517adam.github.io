---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
* **The Hong Kong University of Science and Technology (HKUST)**
  * B.Sc. in Computer Science and Mathematics (Double Major)
  * Sep. 2023 -- June 2027 (Expected)
  * Cumulative GPA: 3.923 / 4.3
  * Selected Coursework: Advanced Deep Learning Architecture (Postgrad level), Graph Neural Networks, Large Language Models, Honors Probability.

* **École Polytechnique Fédérale de Lausanne (EPFL)**
  * Exchange Student
  * Spring 2026 (Nominated)

* **Stanford University**
  * International Honors Program (Summer Session)
  * June 2025 -- Aug. 2025
  * Coursework: Machine Learning (CS229), Design and Analysis of Algorithms (CS161)

Research Experience
======
* **Pathology Report Generation via Multi-modal Learning** (Sep. 2025 -- Present)
  * Research Assistant, Supervised by Prof. Hao Chen, HKUST Smart Lab
  * Proposed a novel multi-modal framework to automatically generate pathology reports from Whole Slide Images (WSI).
  * Developing a two-stage training pipeline for pathology report generation, leveraging a highly structured, high-quality dataset to enhance generation accuracy.
  * Addressed the scarcity of high-quality paired WSI-report datasets by constructing a large-scale instruction-tuning dataset.
  * Designed a modality-alignment algorithm to enhance consistency between visual features and text descriptions, and proposed a disentanglement method to decouple template artifacts from diagnostic information.
  * Leveraged State-of-the-Art Vision-Language Models (VLMs) to assist pathologists, targeting measurable improvements in clinical workflow efficiency.

* **Cancer Diagnosis and Prognosis with Whole Slide Images** (Sep. 2024 -- Sep. 2025)
  * Undergraduate Researcher, Supervised by Prof. Hao Chen (UROP), HKUST Smart Lab
  * Conducted a comprehensive survey on deep learning methods for cancer diagnosis, synthesizing insights from over 10 seminal papers and recent benchmarks.
  * Implemented and evaluated deep learning baselines, including MotCAT and MACT, to analyze performance gaps in cancer subtype classification.
  * Identified key computational bottlenecks inherent in gigapixel resolution and high-dimensional feature spaces that limit traditional ML models.

* **iFLYTEK Co., Ltd.** (June 2024 -- Aug. 2024)
  * AI Data Processing Intern, Hefei, China
  * Developed automated Python scripts for large-scale web data collection, improving data acquisition efficiency.
  * Preprocessed unstructured data to support the unsupervised training of Large Language Models (LLMs).
  * Analyzed data quality and summarized findings in technical reports presented to the senior research team.

Projects
======
* **Zero-Shot Spatial Reasoning with Large Language Models** (Mar. 2025 -- May 2025)
  * Course Project
  * Investigated the spatial reasoning capabilities of LLMs in zero-shot settings using custom prompt engineering.
  * Designed and executed experiments to evaluate model performance on complex geometric reasoning tasks.

Awards & Honors
======
* **Dean's List**, HKUST (2023 -- 2025, Awarded 4 times)
* **University Scholarship** (Top 2% Students), HKUST (2023 -- 2024)

Skills
======
* **Languages**: Mandarin (Native), English (Professional Proficiency, TOEFL: 102)
* **Programming**: Python (PyTorch, TensorFlow), C++, MATLAB, R, HTML/CSS
* **Tools**: Linux, Git, Docker, LaTeX, Vim

Publications
======
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>

