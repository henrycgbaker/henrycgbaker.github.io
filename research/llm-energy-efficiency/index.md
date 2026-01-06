---
layout: homepage
title: Benchmarking LLM Energy Efficiency
permalink: /research/llm-energy-efficiency/
---

<!-- TODO: Expand this landing page with more detailed content, interactive visualisations, and potentially Jupyter notebooks. This is initial scaffolding. -->

# Benchmarking LLM Energy Efficiency

**Masters of Data Science for Public Policy Thesis, 2025**
Hertie School of Governance · Advisor: Prof. Lina Kaack · **Data Science Thesis Award 2025**

[Download Thesis (PDF)](/assets/files/research/llm-energy-efficiency-thesis.pdf) · [GitHub: llm-efficiency-measurement-tool](https://github.com/henrycgbaker/llm-efficiency-measurement-tool)

---

## The Problem

The adoption of large language models across digital services has led to increased scrutiny over their energy costs. Data-centre demand from AI workloads is projected to more than quadruple by 2030, potentially accounting for 9-12% of total energy demand in the US. Crucially, inference-time consumption now dominates AI energy usage—Google and Meta report 60-70% of their AI-driven energy consumption is inference-related.

Yet the practice of benchmarking LLM inference-time energy efficiency remains under-considered. A common simplifying assumption is to take the number of FLOPs (floating-point operations) required per generated token as a proxy for inference-time energy costs. However, FLOPs quantify the number of arithmetic operations required to generate a given output, but they do not capture the energy efficiency with which those operations are executed.

**The core insight:** Two systems with the same theoretical compute requirement may exhibit markedly different energy profiles. Implementation-level factors—how models are deployed—can induce substantial variation in energy consumption, even when FLOPs counts remain constant.

---

## Key Findings

Through a comprehensive grid search of implementation parameters, this research demonstrates substantial variability in energy efficiency:

| Model        | Max/Min Fold Change | 95/5 Percentile Fold | Coefficient of Variation |
| ------------ | ------------------- | -------------------- | ------------------------ |
| LLaMA-3.2-1B | 516.5×              | 61.0×                | 127.7%                   |
| LLaMA-3.2-3B | 293.5×              | 51.0×                | 123.5%                   |

While the explored parameter space includes many impractical configurations—meaning these extreme figures should not be interpreted as directly achievable gains in production—the results underscore the importance of standardised benchmarking methods representative of real-world operational contexts.

![Distribution of energy outcomes across grid search configurations](figures/boxplot.png)
_Distribution of energy outcomes showing substantial variability within each model._

### Tensor Parallelism

Increasing the number of processes over which model layers are distributed leads to a moderately super-linear increase in energy-per-token. This has the largest effect of all tested parameters, with both models more than doubling energy consumption with the addition of a single extra process.

This behaviour reflects a naive unoptimised implementation and is consistent with known limitations when model size is small relative to available GPU capacity. As GPUs are added, not only does another device need powering, but energy overheads from inter-device communication and coordination increase disproportionately to realised throughput gains.

### Batch Size Effects

![Batch size vs throughput relationship](figures/batch_throughput_norm.png)
_Normalised throughput across different batch sizes._

Batch size significantly affects the throughput-energy tradeoff, with larger batches improving device utilisation and partially offsetting inefficiencies from parallelism.

### Precision and Quantisation

![Precision effects on energy consumption](figures/precision_norm.png)
_Effect of numerical precision on normalised energy consumption._

Different numerical precisions (FP32, FP16, INT8) show distinct energy profiles, with lower-precision formats generally reducing energy consumption while introducing accuracy tradeoffs.

### Latency-Energy Tradeoffs

![Latency vs energy across precision levels](figures/latency_energy_precision.png)
_The relationship between latency and energy consumption varies by precision level._

---

## Implications

### For Researchers

FLOP-counting narrows attention to immutable model attributes, conceptually restricting intervention scope to the moment of model selection. This framing overlooks downstream system-level implementation decisions and tradeoffs that shape the energy efficiency of real-world deployments.

### For Policy-Makers

The neglect of implementation-level variation translates to a lack of standardised test-time controls. This gap creates opportunities for motivated actors to present artificially efficient performance metrics by testing under unrealistic configurations. Consumers and policymakers are left with little insight into the true energy cost of querying an LLM.

### For Practitioners

The substantial variability demonstrated here highlights opportunities for energy optimisation through informed deployment choices—not just model selection.

---

## Ongoing Development

The measurement tool developed for this research is being actively expanded to support:

- Agentic AI workflows and multi-step reasoning
- Broader hardware configurations
- Production-grade inference frameworks

See the [llm-efficiency-measurement-tool](https://github.com/henrycgbaker/llm-efficiency-measurement-tool) repository for the latest developments.

---

## Future Directions

- Executing experiments on dedicated compute clusters and scaling to larger model families
- Broader parameter coverage: load shaping, dynamic power management, thermal-aware scheduling
- Finer-grained temporal analysis of power draw and device utilisation
- Relaxing the fixed-FLOPs constraint to model the conditional FLOPs-energy relationship
- Integration with sustainable systems research and life-cycle assessment (LCA) models

---

_Full academic thesis available as [PDF](/assets/files/research/llm-energy-efficiency-thesis.pdf)._

[← Back to Research](/research/)
