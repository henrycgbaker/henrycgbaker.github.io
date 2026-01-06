---
layout: homepage
title: LLM Efficiency Measurement Tool
permalink: /software/llm-efficiency-tool/
---

# LLM Efficiency Measurement Tool

**Benchmarking Energy Consumption and Throughput in Large Language Model Inference**

A Python framework for measuring what actually matters when deploying LLMs: energy consumption, throughput, and the interaction between deployment choices and efficiency.

[GitHub Repository](https://github.com/henrycgbaker/llm-efficiency-measurement-tool) · [Research Article](/research/llm-energy-efficiency/)

---

## Why This Tool Exists

When evaluating large language models, the industry focuses heavily on **capabilities**: benchmark scores, parameter counts, context lengths. But for anyone actually *deploying* these models—cloud providers, enterprises, researchers—a different question dominates: **what will this cost to run?**

### The FLOPs Fallacy

A common assumption is that computational cost (measured in FLOPs—floating-point operations) directly predicts energy consumption. The logic seems sound: more computation = more energy.

But this assumption breaks down in practice:

| Configuration | FLOPs per Token | Energy per Token | Ratio |
|---------------|-----------------|------------------|-------|
| Single GPU, batch=1, FP32 | X | 1.0× (baseline) | - |
| Single GPU, batch=32, FP16 | X | 0.15× | 6.7× more efficient |
| 4 GPUs, batch=1, FP32 | X | 4.2× | 4.2× *less* efficient |

Same model, same FLOPs, wildly different energy costs. **How you deploy matters as much as what you deploy.**

### The Gap This Tool Fills

Existing benchmarking focuses on:
- **Capability benchmarks** (MMLU, GSM8k, etc.): measure what models can do
- **Speed benchmarks** (tokens/second): measure raw throughput
- **FLOPs estimation**: measure theoretical compute

What's missing:
- **Actual energy consumption** under different deployment configurations
- **The interaction effects** between parallelism, batching, precision, and efficiency
- **Realistic workload simulation** beyond synthetic benchmarks

This tool measures the full picture: energy, throughput, and FLOPs together, across configurable deployment scenarios.

---

## What It Measures

The tool captures three categories of metrics:

### Energy Consumption

| Metric | Source | Description |
|--------|--------|-------------|
| **GPU energy** | NVIDIA NVML | Joules consumed by GPU compute |
| **CPU energy** | Intel RAPL / estimates | Processor energy draw |
| **RAM energy** | Estimates | Memory subsystem power |
| **Total energy** | CodeCarbon | Aggregated system consumption |
| **CO₂ emissions** | CodeCarbon | Based on grid carbon intensity |

Energy measurements use [CodeCarbon](https://codecarbon.io/), the emerging standard for ML energy tracking (±10-15% accuracy).

### Throughput Metrics

| Metric | Description |
|--------|-------------|
| **Tokens per second** | Generation speed |
| **Latency per token** | Time between tokens |
| **Time to first token** | Initial response latency |
| **Batch throughput** | Tokens/second at different batch sizes |

### Computational Metrics

| Metric | Method | Description |
|--------|--------|-------------|
| **FLOPs per token** | calflops | Measured forward pass operations |
| **FLOPs (analytical)** | Architecture-based | Theoretical compute from model structure |
| **Peak memory** | torch.cuda | Maximum GPU memory during inference |

---

## How It Works

### Architecture Overview

![Tool Architecture](figures/architecture.png)
*The measurement pipeline: configuration → distributed execution → late aggregation.*

The tool uses a three-stage architecture:

```
┌──────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│   Config     │───▶│  Distributed Runner  │───▶│   Aggregation    │
│   (YAML)     │    │  (accelerate)        │    │   (on-demand)    │
└──────────────┘    └──────────────────────┘    └──────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
         ┌────────┐     ┌────────┐     ┌────────┐
         │ GPU 0  │     │ GPU 1  │     │ GPU 2  │
         │ ────── │     │ ────── │     │ ────── │
         │ Energy │     │ Energy │     │ Energy │
         │ Tokens │     │ Tokens │     │ Tokens │
         │ Memory │     │ Memory │     │ Memory │
         └────────┘     └────────┘     └────────┘
              │               │               │
              └───────────────┴───────────────┘
                              │
                              ▼
                     ┌────────────────┐
                     │  Raw Results   │
                     │  (per-process) │
                     └────────────────┘
```

### Late Aggregation Pattern

A key design decision: **raw results are saved per-GPU before aggregation**.

Why this matters:
- **Debuggability**: If results look wrong, you can inspect individual GPU contributions
- **Flexibility**: Aggregate differently for different analyses (mean vs sum vs max)
- **Reproducibility**: Raw data preserved for future reanalysis

Results are stored as:
```
results/
├── run_20240115_143022/
│   ├── raw/
│   │   ├── process_0_metrics.json
│   │   ├── process_1_metrics.json
│   │   └── process_2_metrics.json
│   ├── aggregated_metrics.json
│   └── config.yaml
```

### Distributed Execution

The tool uses HuggingFace's [Accelerate](https://huggingface.co/docs/accelerate) for multi-GPU inference:

- **Tensor parallelism**: Model layers distributed across GPUs
- **Per-process tracking**: Each GPU reports its own metrics
- **Synchronised execution**: Barrier-based coordination for accurate timing

This enables measuring how parallelism affects efficiency—a critical factor the research found can induce 4-6× variation in energy consumption.

---

## Configuration

### YAML-Based Setup

Experiments are configured via YAML files with inheritance support:

```yaml
# configs/experiment.yaml
_extends: configs/base.yaml

model:
  name: meta-llama/Llama-3.2-3B
  precision: float16
  quantization: null

generation:
  max_input_tokens: 500
  max_output_tokens: 500
  temperature: 1.0
  top_p: 0.9

hardware:
  devices: [0, 1, 2, 3]
  num_processes: 4

data:
  dataset: HuggingFaceFW/fineweb-edu
  split: train
  num_samples: 128
```

### Configuration Inheritance

The `_extends` directive enables hierarchical configs:

```
base.yaml                    # Defaults
├── llama-base.yaml          # LLaMA family settings
│   ├── llama-1b.yaml        # 1B model specifics
│   └── llama-3b.yaml        # 3B model specifics
└── mistral-base.yaml        # Mistral family settings
```

Override only what changes—cleaner configs, fewer errors.

### Key Parameters

| Category | Parameters | Options |
|----------|------------|---------|
| **Precision** | `precision` | float32, float16, bfloat16 |
| **Quantisation** | `quantization` | null, 4bit, 8bit |
| **Parallelism** | `num_processes` | 1-N (number of GPUs) |
| **Batching** | `batch_size` | 1-64+ |
| **Generation** | `temperature`, `top_p`, `top_k` | Sampling parameters |
| **Latency sim** | `delay_ms`, `burst_size` | Simulate network conditions |

---

## Technical Deep-Dives

### Energy Measurement Pipeline

Energy tracking wraps the inference loop:

```python
# Simplified measurement flow
tracker = EmissionsTracker()
tracker.start()

for batch in dataloader:
    outputs = model.generate(batch)
    record_tokens(outputs)

emissions_data = tracker.stop()
```

CodeCarbon queries hardware counters:
- **NVIDIA GPUs**: NVML `nvmlDeviceGetTotalEnergyConsumption()`
- **Intel CPUs**: RAPL (Running Average Power Limit) via `/sys/class/powercap/`
- **AMD CPUs**: Estimated from TDP and utilisation

Measurements capture:
- Total energy (Joules)
- Power draw over time (Watts)
- Carbon emissions (kg CO₂eq, based on grid region)

### FLOPs Calculation Methods

The tool supports multiple FLOPs estimation approaches:

**1. calflops (measured)**
```python
from calflops import calculate_flops
flops, macs, params = calculate_flops(
    model=model,
    input_shape=(batch_size, seq_length),
    output_as_string=False
)
```
Traces actual forward pass operations—most accurate for complex architectures.

**2. Architecture-based (analytical)**
```
FLOPs ≈ 2 × params × seq_length  # Simplified
```
For transformers:
```
FLOPs = layers × (
    12 × hidden² × seq +           # Attention
    8 × hidden × intermediate × seq # MLP
)
```
Useful when profiling overhead is prohibitive.

**3. Parameter-based (heuristic)**
```
FLOPs ≈ 2 × parameters × tokens_generated
```
Roughest estimate, but fast and model-agnostic.

### Handling Measurement Noise

Shared servers introduce variance. The tool addresses this through:

- **Multiple runs**: Execute experiments across different time windows
- **Warm-up passes**: 3 dummy forward passes before measurement (discarded)
- **Fresh process initialisation**: Each run starts from clean state
- **Statistical reporting**: Report mean, std, and percentiles

---

## Deployment Options

### Local Installation (Poetry)

```bash
git clone https://github.com/henrycgbaker/llm-efficiency-measurement-tool
cd llm-efficiency-measurement-tool
poetry install
poetry run python run_experiment.py --config configs/experiment.yaml
```

### Docker (Reproducible)

```bash
# Production: baked-in package
docker build -t llm-efficiency .
docker run --gpus all llm-efficiency --config configs/experiment.yaml

# Development: mounted source
docker-compose -f docker-compose.dev.yml up
```

### VS Code Devcontainer

The repository includes a `.devcontainer/` configuration for full IDE support with GPU passthrough—ideal for iterative development.

---

## Built-in Datasets

The tool supports standard benchmarking datasets:

| Dataset | Purpose | Default Columns |
|---------|---------|-----------------|
| **Alpaca** | Instruction following | instruction, input |
| **ShareGPT** | Conversational | conversations |
| **GSM8k** | Mathematical reasoning | question |
| **MMLU** | General knowledge | question, choices |
| **WikiText** | Language modelling | text |
| **FineWeb-Edu** | Educational text | text |

Custom datasets work via HuggingFace Hub paths:

```yaml
data:
  dataset: your-org/your-dataset
  split: train
  text_column: content
```

---

## Example Results

A typical output includes:

```
══════════════════════════════════════════════════════════════
  LLM EFFICIENCY MEASUREMENT - RUN SUMMARY
══════════════════════════════════════════════════════════════
  Model:        meta-llama/Llama-3.2-3B
  Precision:    float16
  GPUs:         4× A100-40GB
  Batch size:   32
  Samples:      128
══════════════════════════════════════════════════════════════

  THROUGHPUT
  ──────────
  Tokens generated:     64,000
  Tokens/second:        847.3
  Latency/token:        1.18 ms
  Time to first token:  23.4 ms

  ENERGY
  ──────
  Total energy:         42.7 kJ
  Energy/token:         0.67 mJ
  GPU energy:           38.2 kJ (89.5%)
  CPU energy:           3.1 kJ (7.3%)
  RAM energy:           1.4 kJ (3.2%)

  EMISSIONS
  ─────────
  CO₂ equivalent:       12.3 g
  Grid region:          DE (Germany)

  COMPUTE
  ───────
  FLOPs/token:          6.2 GFLOPs
  Peak GPU memory:      28.4 GB
  Utilisation (avg):    78.3%

══════════════════════════════════════════════════════════════
```

---

## Research Findings

This tool powered a comprehensive study of LLM inference efficiency. Key findings:

| Factor | Effect on Energy | Insight |
|--------|------------------|---------|
| **Tensor parallelism** | +100-500% | More GPUs often *increases* energy for small models |
| **Batch size** | -60-90% | Larger batches dramatically improve efficiency |
| **FP16 vs FP32** | -35-40% | Half precision yields consistent gains |
| **INT8/INT4** | Variable | Benefits depend on backend optimisation |
| **Decoding strategy** | <5% | Minimal impact—choose based on quality needs |

**The headline finding**: Implementation choices can induce **50×+ variation** in energy-per-token for the same model. Deployment decisions matter as much as model selection.

See the [full research article](/research/llm-energy-efficiency/) for detailed analysis and methodology.

---

## Comparison to Alternatives

| Tool | Energy | Throughput | FLOPs | Multi-GPU | Config System |
|------|--------|------------|-------|-----------|---------------|
| **This tool** | ✓ | ✓ | ✓ | ✓ (distributed) | YAML with inheritance |
| **CodeCarbon** | ✓ | ✗ | ✗ | Partial | N/A (library only) |
| **ML Energy Score** | ✓ | ✓ | ✗ | ✗ | Fixed configs |
| **vLLM benchmarks** | ✗ | ✓ | ✗ | ✓ | CLI args |
| **DeepSpeed profiler** | ✗ | ✓ | ✓ | ✓ | JSON configs |

This tool uniquely combines energy, throughput, and FLOPs measurement in a single configurable framework designed for systematic deployment analysis.

---

## Getting Started

### Minimal Example

```bash
# Clone and install
git clone https://github.com/henrycgbaker/llm-efficiency-measurement-tool
cd llm-efficiency-measurement-tool
pip install -e .

# Run with default config
python run_experiment.py --config configs/quick_test.yaml
```

### Grid Search

For systematic deployment analysis:

```yaml
# configs/grid_search.yaml
sweep:
  precision: [float32, float16]
  batch_size: [1, 8, 32]
  num_processes: [1, 2, 4]
```

```bash
python run_grid_search.py --config configs/grid_search.yaml
```

### Custom Models

Any HuggingFace model works:

```yaml
model:
  name: mistralai/Mistral-7B-v0.1
  # or local path
  name: /path/to/local/model
```

---

## Roadmap

Active development areas:

- **vLLM backend**: Production-grade inference server measurements
- **Streaming metrics**: Real-time power monitoring during generation
- **Multi-node support**: Distributed inference across machines
- **Agentic workloads**: Multi-step reasoning and tool-use patterns
- **Automated reporting**: Generate comparison reports across runs

Contributions welcome—see [issues](https://github.com/henrycgbaker/llm-efficiency-measurement-tool/issues) for planned features.

---

## Citation

If you use this tool in research, please cite:

```bibtex
@mastersthesis{baker2025llm,
  title={Benchmarking LLM Energy Efficiency:
         Implementation-Level Factors in Inference-Time Consumption},
  author={Baker, Henry},
  year={2025},
  school={Hertie School of Governance}
}
```

---

[← Back to Software](/software/)
