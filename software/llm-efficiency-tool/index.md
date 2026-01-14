---
layout: homepage
title: LLM Efficiency Measurement Tool
permalink: /software/llm-efficiency-tool/
---

# LLM Efficiency Measurement Tool

**Benchmarking energy consumption, throughput, and FLOPs in LLM inference**

A Python framework for measuring what actually matters when deploying large language models. Deployment choices—parallelism, batching, precision—can induce **50×+ variation** in energy-per-token for the same model. This tool quantifies it.

[GitHub Repository](https://github.com/henrycgbaker/llm-efficiency-measurement-tool) · [Research Findings](/research/llm-energy-efficiency/)

---

**Contents:** [Overview](#overview) · [Quick Start](#quick-start) · [Feature Evolution](#feature-evolution) · [Configuration](#configuration) · [Architecture](#architecture) · [Citation](#citation)

---

## Overview

### What It Measures

| Category | Metrics |
|----------|---------|
| **Energy** | GPU energy (NVML), CPU energy (RAPL), RAM energy, total system (CodeCarbon), CO₂ emissions |
| **Throughput** | Tokens/second, latency/token, time to first token, batch throughput |
| **Compute** | FLOPs/token (measured via calflops), FLOPs (analytical), peak GPU memory, device utilisation |

### Key Capabilities

- **Multi-GPU distributed inference** via HuggingFace Accelerate with tensor and pipeline parallelism
- **YAML configuration** with inheritance for clean experiment management
- **Late aggregation pattern** preserving raw per-GPU results for flexible analysis
- **Built-in datasets**: Alpaca, ShareGPT, GSM8k, MMLU, WikiText, FineWeb-Edu (plus any HuggingFace dataset)
- **Production deployment** via Docker, Docker Compose, or VS Code devcontainer

---

## Quick Start

1. **Clone and install** the repository using pip or Poetry
2. **Create a YAML config** specifying model, precision, batch size, and dataset
3. **Run an experiment** with `llm-energy-measure experiment <config.yaml>`
4. **View results** with `llm-energy-measure results show <experiment_id>`

The CLI supports grid searches over precision, batch size, and parallelism for systematic deployment analysis. Any HuggingFace model works out of the box.

See the [GitHub README](https://github.com/henrycgbaker/llm-efficiency-measurement-tool) for detailed installation and usage instructions.

---

## Feature Evolution

<div style="max-height: 500px; overflow-y: auto; border: 1px solid #e1e4e8; border-radius: 6px; padding: 16px; margin: 16px 0;" markdown="1">

### v2.0.0 — Architectural Refactor (January 2026)

Ground-up rewrite with modern patterns:

- **Dependency injection** throughout the codebase
- **Late aggregation pattern** — raw per-GPU results preserved before aggregation
- **Pydantic validation** for all configuration and results
- **Batching strategies** — four MLPerf-aligned modes: static, dynamic, sorted, sorted_dynamic with optional token budgets
- **Traffic simulation** — constant or Poisson arrival patterns with configurable QPS for production-like load testing
- **Decoder presets** — deterministic, standard, creative, factual modes plus fine-grained sampling control
- **Multi-cycle experiments** — run 1-10 repetitions for statistical robustness
- **Scheduled execution** — daemon mode with interval-based or time-of-day scheduling
- **Proper parallelism** — tensor parallel and pipeline parallel sharding replacing naive device mapping

---

### v1.16.0 — Production Containerisation (January 2026)

Deployment-focused release:

- **Multi-stage Dockerfile** for minimal production images
- **Docker Compose profiles** for production and development workflows
- **VS Code devcontainer** configuration with GPU passthrough
- **Makefile targets** for common operations
- **CUDA compatibility fixes** for multi-GPU environments

---

### v1.15.0 — Test Coverage & Quality (December 2025)

Quality assurance milestone:

- **416 passing tests** including 8 end-to-end CLI tests and 47 integration tests
- **Methodology documentation** covering energy tracking via CodeCarbon, FLOPs estimation strategies, and distributed GPU result aggregation

---

### v1.13.0 — CLI & Experiment Orchestration (December 2025)

User-friendly command-line interface:

- **Typer-based CLI** with subcommands for experiment, config, and results management
- **ExperimentOrchestrator** with dependency injection
- **ExperimentContext** for managing experiment lifecycle

---

### v1.10.0 — Package Rename & Architecture (December 2025)

Major refactoring establishing the modern codebase:

- **Renamed** from `llm-bench` → `llm-energy-measure`
- **Energy backend plugin registry** for extensible measurement backends
- **FlopsEstimator** with three-strategy fallback (calflops → analytical → parameter-based)
- **Results aggregation** with verification checks
- **Pydantic domain models** for type-safe configuration and results

---

### v1.0.0 — Research Phase Complete (December 2025)

Stable multi-model benchmarking validated on production hardware (4× A100-40GB):

- **Scenario-based YAML configuration** with inheritance support
- **CSV export** for downstream analysis
- **Failed experiment detection** and recovery
- **Large model stability** improvements for 7B+ parameter models

---

### v0.5.0 — Core Measurement (March 2025)

Foundation release establishing the measurement pipeline:

- **Distributed results aggregation** across multiple GPUs
- **FLOPs calculation** with quantisation awareness
- **Robust process cleanup** for reliable benchmarking
- **Optimum benchmark integration** for standardised evaluation

</div>

### Roadmap

Active development areas:

- **vLLM backend** — Production-grade inference server measurements
- **Streaming metrics** — Real-time power monitoring during generation
- **Multi-node support** — Distributed inference across machines
- **Agentic workloads** — Multi-step reasoning and tool-use patterns
- **Automated reporting** — Generate comparison reports across runs

---

## Configuration

### Key Parameters

| Category | Parameter | Options |
|----------|-----------|---------|
| **Precision** | `model.precision` | float32, float16, bfloat16 |
| **Quantisation** | `model.quantization` | null, 4bit, 8bit |
| **Batching** | `batching.strategy` | static, dynamic, sorted, sorted_dynamic |
| **Parallelism** | `hardware.sharding` | tensor_parallel, pipeline_parallel, none |
| **Traffic** | `traffic.pattern` | constant, poisson |
| **Decoder** | `generation.preset` | deterministic, standard, creative, factual |

Configs use YAML with an `_extends` directive for inheritance—override only what changes across experiments.

---

## Architecture

The tool follows a **configuration-driven, three-stage pipeline** designed for reproducible distributed benchmarking.

### High-Level Pipeline

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                           MEASUREMENT PIPELINE                                  │
└────────────────────────────────────────────────────────────────────────────────┘
                                       │
                 ┌─────────────────────┴─────────────────────┐
                 ▼                                           ▼
┌────────────────────────────────┐         ┌────────────────────────────────┐
│       1. CONFIGURATION         │         │         2. EXECUTION           │
│  ────────────────────────────  │         │  ────────────────────────────  │
│  • Model & precision           │────────▶│  • HuggingFace Accelerate      │
│  • Hardware sharding           │         │  • Tensor/pipeline parallelism │
│  • Generation parameters       │         │  • Barrier synchronisation     │
│  • YAML inheritance            │         │  • Per-process metric tracking │
└────────────────────────────────┘         └───────────────┬────────────────┘
                                                           │
                                     ┌─────────────────────┼─────────────────────┐
                                     ▼                     ▼                     ▼
                                ┌─────────┐           ┌─────────┐           ┌─────────┐
                                │  GPU 0  │           │  GPU 1  │           │  GPU N  │
                                │ ─────── │           │ ─────── │           │ ─────── │
                                │ Energy  │           │ Energy  │           │ Energy  │
                                │ Tokens  │           │ Tokens  │           │ Tokens  │
                                │ Memory  │           │ Memory  │           │ Memory  │
                                │ FLOPs   │           │ FLOPs   │           │ FLOPs   │
                                └────┬────┘           └────┬────┘           └────┬────┘
                                     │                     │                     │
                                     └─────────────────────┼─────────────────────┘
                                                           ▼
                                     ┌────────────────────────────────┐
                                     │        3. AGGREGATION          │
                                     │  ────────────────────────────  │
                                     │  • Late aggregation pattern    │
                                     │  • Raw per-GPU results saved   │
                                     │  • Flexible post-hoc analysis  │
                                     │  • CSV/JSON export             │
                                     └────────────────────────────────┘
```

---

### Stage 1: Configuration System

Declarative YAML configuration with inheritance via `_extends` enables reproducible experiments without code changes.

**Configuration Inheritance:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONFIGURATION INHERITANCE                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   base.yaml         │     Base configuration with sensible defaults
│ ─────────────────── │
│ model: llama-3.2-3B │
│ precision: float16  │
│ batch_size: 16      │
│ num_gpus: 1         │
└──────────┬──────────┘
           │
           │ _extends: base.yaml
           ▼
┌─────────────────────┐     ┌─────────────────────┐
│  multi-gpu.yaml     │     │  quantized.yaml     │
│ ─────────────────── │     │ ─────────────────── │
│ num_gpus: 4         │     │ quantization: 4bit  │
│ sharding: tensor_   │     │ precision: null     │
│           parallel  │     │                     │
└──────────┬──────────┘     └─────────────────────┘
           │
           │ _extends: multi-gpu.yaml
           ▼
┌─────────────────────┐
│  experiment.yaml    │     Final experiment: inherits all, overrides batch
│ ─────────────────── │
│ batch_size: 32      │
│ traffic: poisson    │
└─────────────────────┘
```

**Example Configuration:**

```yaml
_extends: configs/base.yaml

model:
  name: meta-llama/Llama-3.2-3B
  precision: float16
  quantization: null

hardware:
  sharding: tensor_parallel
  num_gpus: 4
  device_ids: [0, 1, 2, 3]

batching:
  strategy: sorted_dynamic    # MLPerf-aligned
  max_batch_size: 32
  token_budget: 4096

traffic:
  pattern: poisson
  qps: 10.0

generation:
  preset: deterministic       # or: standard, creative, factual
  max_new_tokens: 256
```

All configuration is **Pydantic-validated** at load time—invalid configs fail fast with clear error messages.

---

### Stage 2: Distributed Execution

The runner orchestrates multi-GPU inference via HuggingFace Accelerate with precise lifecycle management.

**Execution Flow:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXECUTION LIFECYCLE                                 │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  1. INITIALISATION                                                          │
│  ───────────────────────────────────────────────────────────────────────    │
│  • Load model onto GPU(s) with specified sharding strategy                  │
│  • Configure distributed backend (NCCL/Gloo)                                │
│  • Initialise CodeCarbon energy tracker                                     │
│  • Set up per-process metric collectors                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  2. WARM-UP (results discarded)                                             │
│  ───────────────────────────────────────────────────────────────────────    │
│  • 3 dummy forward passes                                                   │
│  • Triggers CUDA lazy initialisations                                       │
│  • Stabilises GPU clock frequencies                                         │
│  • Populates KV cache                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  3. MEASUREMENT                                                             │
│  ───────────────────────────────────────────────────────────────────────    │
│                                                                             │
│    ┌─────────────────────────────────────────────────────────────────┐      │
│    │  for each batch in dataloader:                                  │      │
│    │      ┌──────────────────────────────────────────────────────┐   │      │
│    │      │  barrier_sync()           # Synchronise all GPUs     │   │      │
│    │      │  start_batch_timer()                                 │   │      │
│    │      │  outputs = model.generate(batch, **gen_config)       │   │      │
│    │      │  stop_batch_timer()                                  │   │      │
│    │      │  record_tokens(outputs)   # Per-process counting     │   │      │
│    │      │  record_memory()          # Peak GPU memory          │   │      │
│    │      └──────────────────────────────────────────────────────┘   │      │
│    └─────────────────────────────────────────────────────────────────┘      │
│                                                                             │
│  • Energy tracked continuously via CodeCarbon                               │
│  • Each GPU process maintains independent metrics                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  4. COLLECTION                                                              │
│  ───────────────────────────────────────────────────────────────────────    │
│  • Stop CodeCarbon tracker                                                  │
│  • Gather per-GPU metrics via distributed primitives                        │
│  • Compute FLOPs (see estimation pipeline below)                            │
│  • Save raw results to JSON (one file per GPU)                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Stage 3: Late Aggregation

The **late aggregation pattern** is central to the design philosophy: raw per-GPU results are preserved before any aggregation.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       LATE AGGREGATION PATTERN                               │
└─────────────────────────────────────────────────────────────────────────────┘

    Raw Results (preserved)                    Aggregated Results
    ─────────────────────────                  ─────────────────────────

    ┌─────────────────────┐
    │ gpu_0_results.json  │───┐
    │ • energy: 0.0023 kWh│   │
    │ • tokens: 1024      │   │
    │ • memory: 12.4 GB   │   │
    └─────────────────────┘   │
                              │
    ┌─────────────────────┐   │     ┌─────────────────────────────────┐
    │ gpu_1_results.json  │───┼────▶│      experiment_summary.json    │
    │ • energy: 0.0021 kWh│   │     │ ─────────────────────────────── │
    │ • tokens: 1024      │   │     │ • total_energy: 0.0089 kWh      │
    │ • memory: 11.8 GB   │   │     │ • total_tokens: 4096            │
    └─────────────────────┘   │     │ • tokens_per_second: 142.3      │
                              │     │ • energy_per_token: 2.17e-6 kWh │
    ┌─────────────────────┐   │     │ • peak_memory: 12.4 GB          │
    │ gpu_2_results.json  │───┤     │ • flops_per_token: 1.2e9        │
    │ • energy: 0.0024 kWh│   │     └─────────────────────────────────┘
    │ • tokens: 1024      │   │
    │ • memory: 12.1 GB   │   │
    └─────────────────────┘   │
                              │
    ┌─────────────────────┐   │
    │ gpu_3_results.json  │───┘
    │ • energy: 0.0021 kWh│
    │ • tokens: 1024      │
    │ • memory: 11.9 GB   │
    └─────────────────────┘

    Benefits:
    ─────────
    ✓ Debug anomalous GPU behaviour
    ✓ Re-aggregate for different analyses
    ✓ Full reproducibility from raw data
    ✓ Identify load imbalances
```

---

### Metric Collection Architecture

The tool collects three categories of metrics, each with multiple measurement sources.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        METRIC COLLECTION                                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│        ENERGY           │  │       THROUGHPUT        │  │        COMPUTE          │
│  ─────────────────────  │  │  ─────────────────────  │  │  ─────────────────────  │
│                         │  │                         │  │                         │
│  ┌───────────────────┐  │  │  ┌───────────────────┐  │  │  ┌───────────────────┐  │
│  │ GPU Energy (NVML) │  │  │  │ Tokens/second     │  │  │  │ FLOPs/token       │  │
│  │ Per-device Joules │  │  │  │ End-to-end rate   │  │  │  │ (see pipeline)    │  │
│  └───────────────────┘  │  │  └───────────────────┘  │  │  └───────────────────┘  │
│                         │  │                         │  │                         │
│  ┌───────────────────┐  │  │  ┌───────────────────┐  │  │  ┌───────────────────┐  │
│  │ CPU Energy (RAPL) │  │  │  │ Latency/token     │  │  │  │ Peak GPU Memory   │  │
│  │ Package + DRAM    │  │  │  │ Mean, P50, P99    │  │  │  │ Per-device max    │  │
│  └───────────────────┘  │  │  └───────────────────┘  │  │  └───────────────────┘  │
│                         │  │                         │  │                         │
│  ┌───────────────────┐  │  │  ┌───────────────────┐  │  │  ┌───────────────────┐  │
│  │ RAM Energy        │  │  │  │ Time to First     │  │  │  │ Device Util %     │  │
│  │ System memory     │  │  │  │ Token (TTFT)      │  │  │  │ Compute + memory  │  │
│  └───────────────────┘  │  │  └───────────────────┘  │  │  └───────────────────┘  │
│                         │  │                         │  │                         │
│  ┌───────────────────┐  │  │  ┌───────────────────┐  │  │                         │
│  │ CO₂ Emissions     │  │  │  │ Batch Throughput  │  │  │                         │
│  │ Grid carbon int.  │  │  │  │ Requests/second   │  │  │                         │
│  └───────────────────┘  │  │  └───────────────────┘  │  │                         │
│                         │  │                         │  │                         │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘

        CodeCarbon                    Native timing              calflops + fallbacks
```

---

### FLOPs Estimation Pipeline

FLOPs estimation uses a three-strategy fallback chain for robustness across different model architectures.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      FLOPs ESTIMATION PIPELINE                               │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │           Input: Model              │
                    │  (architecture, params, seq_len)    │
                    └──────────────────┬──────────────────┘
                                       │
                                       ▼
                    ┌─────────────────────────────────────┐
                    │     Strategy 1: calflops            │
                    │  ─────────────────────────────────  │
                    │  • Traces actual computation graph  │
                    │  • Most accurate for supported      │
                    │    architectures                    │
                    │  • Handles custom attention         │
                    └──────────────────┬──────────────────┘
                                       │
                         ┌─────────────┴─────────────┐
                         │                           │
                    ✓ Success                   ✗ Failure
                         │                           │
                         ▼                           ▼
              ┌─────────────────┐     ┌─────────────────────────────────────┐
              │  Return FLOPs   │     │     Strategy 2: Analytical          │
              └─────────────────┘     │  ─────────────────────────────────  │
                                      │  • Architecture-specific formulas   │
                                      │  • Transformer: 2 × params × tokens │
                                      │  • Accounts for attention, FFN      │
                                      └──────────────────┬──────────────────┘
                                                         │
                                           ┌─────────────┴─────────────┐
                                           │                           │
                                      ✓ Success                   ✗ Failure
                                           │                           │
                                           ▼                           ▼
                                ┌─────────────────┐     ┌─────────────────────────────────────┐
                                │  Return FLOPs   │     │     Strategy 3: Parameter-based     │
                                └─────────────────┘     │  ─────────────────────────────────  │
                                                        │  • Fallback: 2 × params × tokens    │
                                                        │  • Works for any model              │
                                                        │  • Less accurate but guaranteed     │
                                                        └──────────────────┬──────────────────┘
                                                                           │
                                                                           ▼
                                                                ┌─────────────────┐
                                                                │  Return FLOPs   │
                                                                └─────────────────┘
```

---

### Code Structure

```
src/llm_energy_measure/
├── cli.py              # Typer CLI: experiment, config, results subcommands
├── config/
│   ├── loader.py       # YAML parsing with _extends inheritance
│   ├── validation.py   # Pydantic schemas and validation
│   └── presets.py      # Decoder presets (deterministic, creative, etc.)
├── core/
│   ├── runner.py       # Distributed inference orchestration
│   ├── energy.py       # CodeCarbon integration, energy backends
│   ├── flops.py        # Three-strategy FLOPs estimation
│   └── metrics.py      # Throughput and latency collectors
├── domain/
│   ├── config.py       # ExperimentConfig, ModelConfig, etc.
│   ├── results.py      # InferenceResults, EnergyMetrics, etc.
│   └── enums.py        # Precision, ShardingStrategy, BatchingMode
├── orchestration/
│   ├── orchestrator.py # ExperimentOrchestrator with DI
│   ├── context.py      # ExperimentContext lifecycle management
│   └── scheduler.py    # Daemon mode, interval/time-based scheduling
└── results/
    ├── persistence.py  # JSON/CSV save and load
    ├── aggregation.py  # Late aggregation logic
    └── export.py       # Result formatting and export
```

---

### Multi-Strategy Subsystems

Several components support pluggable strategies for flexible experimentation:

| Subsystem | Strategies | Purpose |
|-----------|------------|---------|
| **Batching** | static, dynamic, sorted, sorted_dynamic | MLPerf-aligned request aggregation with optional token budgets |
| **Traffic** | constant, poisson | Simulate production load patterns at configurable QPS |
| **Sharding** | none, tensor_parallel, pipeline_parallel | Distribute model layers across GPUs |
| **FLOPs** | calflops → analytical → parameter-based | Three-strategy fallback for robust estimation |
| **Decoder** | deterministic, standard, creative, factual | Preset sampling configurations |

This architecture enables measuring how parallelism, batching, and precision interact—factors the [research](/research/llm-energy-efficiency/) found can induce 4-6× variation in energy consumption.

---

## Citation

If you use this tool in research, please cite:

> Baker, H. (2025). *The Implementation Gap: Inducing Variation in LLM Inference-time Energy Efficiency for Fixed Computational Workloads*. Masters of Data Science for Public Policy thesis, Hertie School.

---

[← Back to Software](/software/)

<p style="text-align: center; color: #6a737d; font-size: 0.85em; margin-top: 2em;">Last updated: January 2026</p>
