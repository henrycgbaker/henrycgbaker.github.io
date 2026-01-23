---
layout: homepage
title: LLM Efficiency Measurement Tool
permalink: /software/llm-efficiency-tool/
---

# LLenergyMeasure

**Benchmarking energy consumption, throughput, and FLOPs in LLM inference**

A Python framework for measuring what actually matters when deploying large language models. Deployment choices—parallelism, batching, precision, and inference backend—can induce **50×+ variation** in energy-per-token for the same model. This tool quantifies it across multiple backends (PyTorch, vLLM, TensorRT).

[GitHub Repository](https://github.com/henrycgbaker/LLenergyMeasure) · [Research Findings](/research/llm-energy-efficiency/)

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

- **Multiple inference backends** — PyTorch (native TP/PP), vLLM (production server), TensorRT (NVIDIA optimised)
- **Multi-GPU distributed inference** via HuggingFace Accelerate, vLLM, or TensorRT with tensor and pipeline parallelism
- **Campaign orchestration** for running multiple configs across cycles with statistical comparison
- **YAML configuration** with backend-specific parameters and inheritance for clean experiment management
- **Late aggregation pattern** preserving raw per-GPU results for flexible analysis
- **Built-in datasets**: Alpaca, ShareGPT, GSM8k, MMLU, WikiText, FineWeb-Edu (plus any HuggingFace dataset)
- **Production deployment** via Docker with one-click setup, Docker Compose profiles, or VS Code devcontainer

---

## Quick Start

1. **Clone and install** the repository using pip or Poetry
2. **Create a YAML config** specifying model, backend, precision, batch size, and dataset
3. **Run an experiment** with `lem experiment <config.yaml>`
4. **View results** with `lem results show <experiment_id>`

The CLI (`lem`) supports grid searches over precision, batch size, parallelism, and backends for systematic deployment analysis. Any HuggingFace model works out of the box.

See the [GitHub README](https://github.com/henrycgbaker/LLenergyMeasure) for detailed installation and usage instructions.

---

## Feature Evolution

<div style="max-height: 500px; overflow-y: auto; border: 1px solid #e1e4e8; border-radius: 6px; padding: 16px; margin: 16px 0;" markdown="1">

### v2.0.0 — Architectural Refactor & Multi-Backend Support (January 2026)

Ground-up rewrite with modern patterns and production-grade backends:

- **Multiple inference backends** — PyTorch (native), vLLM (production server), TensorRT (NVIDIA optimised)
- **Backend-native configuration** — backend-specific parameters nested under backend name (e.g., `vllm.gpu_memory_utilization`)
- **Campaign orchestration** — run multiple configs across cycles with interleaved/shuffled/grouped execution, warmup prompts, and thermal management gaps for statistical comparison
- **Dependency injection** throughout the codebase
- **Late aggregation pattern** — raw per-GPU results preserved before aggregation
- **Pydantic validation** for all configuration and results
- **Batching strategies** — four MLPerf-aligned modes: static, dynamic, sorted, sorted_dynamic with optional token budgets
- **Traffic simulation** — constant or Poisson arrival patterns with configurable QPS for production-like load testing
- **Decoder presets** — deterministic, standard, creative, factual modes plus fine-grained sampling control
- **Multi-cycle experiments** — run 1-10 repetitions for statistical robustness with t-distribution confidence intervals
- **Scheduled execution** — daemon mode with interval-based or time-of-day scheduling
- **Proper parallelism** — tensor parallel and pipeline parallel sharding replacing naive device mapping
- **Docker quickstart** — one-click setup with `setup.sh`, named volumes, and multi-backend profiles

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

- **825+ passing tests** including 732 unit tests, 93 integration tests, and 8 end-to-end CLI tests
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

- **Package renamed** from `llm-bench` → `llm-energy-measure` → `llenergymeasure` (final, Jan 2026)
- **CLI alias** introduced as `lem` for convenience
- **Energy backend plugin registry** for extensible measurement backends
- **FlopsEstimator** with three-strategy fallback (calflops → analytical → parameter-based)
- **Results aggregation** with verification checks
- **Pydantic domain models** for type-safe configuration and results

_Note: The package was further renamed to `llenergymeasure` in January 2026 with the introduction of multi-backend support._

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

- **Streaming metrics** — Real-time power monitoring during generation with temporal resolution
- **Multi-node support** — Distributed inference across machines (beyond single-node multi-GPU)
- **Agentic workloads** — Multi-step reasoning and tool-use patterns with chain-of-thought benchmarking
- **Automated reporting** — Generate comparison reports and Pareto frontiers across backend/config combinations
- **Quality metrics integration** — Perplexity, ROUGE, BLEU for quality-efficiency trade-off analysis
- **MLOps integration** — Native MLflow and Weights & Biases experiment tracking
- **Hybrid architecture support** — SSM models (Mamba, RWKV, Jamba) with mixed attention/SSM layers

---

## Multi-Backend Architecture

LLenergyMeasure supports **three inference backends**, each optimised for different deployment scenarios. All backends share the same configuration interface and measurement infrastructure, enabling direct performance comparison.

### Backend Overview

| Backend | Use Case | Strengths | Limitations |
|---------|----------|-----------|-------------|
| **PyTorch** | Research, prototyping, custom models | Native HuggingFace integration, tensor/pipeline parallelism, full model control | Lower throughput than production servers |
| **vLLM** | Production deployments, high-throughput serving | Continuous batching, PagedAttention, optimised KV cache, streaming support | Limited model family support vs HuggingFace |
| **TensorRT** | NVIDIA GPUs, latency-critical applications | Maximum single-query performance, kernel fusion, FP8 support | NVIDIA-only, longer compilation time |

### PyTorch Backend

The **native PyTorch backend** uses HuggingFace Transformers with Accelerate for distributed inference. Ideal for research and exploration.

**Key features:**
- Full HuggingFace model ecosystem support
- Native tensor parallelism (TP) via `tp_plan="auto"` for supported architectures (Llama, Mistral, Qwen, etc.)
- Pipeline parallelism (PP) for vertical model splitting across GPUs
- BitsAndBytes quantisation (INT4/INT8)
- Flexible model modifications and custom architectures

**Configuration example:**
```yaml
backend: pytorch

pytorch:
  attention_implementation: flash_attention_2  # or: sdpa, eager
  torch_compile: false                         # PyTorch 2.0 compilation
  use_cache: true                              # KV cache
  assisted_generation: false                   # Speculative decoding
```

**When to use:** Model exploration, architecture research, custom model modifications, or when working with models not yet supported by vLLM/TensorRT.

---

### vLLM Backend

The **vLLM backend** is a production-grade inference server optimised for high-throughput LLM serving with continuous batching and PagedAttention.

**Key features:**
- **PagedAttention** — memory-efficient KV cache management reducing memory usage by up to 4×
- **Continuous batching** — dynamic request scheduling without waiting for full batch completion
- **Tensor parallelism** — automatic model sharding across GPUs
- **Streaming support** — real-time token generation
- **Optimised kernels** — custom CUDA kernels for attention and sampling

**Configuration example:**
```yaml
backend: vllm

vllm:
  gpu_memory_utilization: 0.9       # GPU memory allocation (0.0–1.0)
  max_model_len: 4096               # Maximum sequence length
  enable_prefix_caching: true       # Cache common prompt prefixes
  enforce_eager: false              # Skip CUDA graph capture (debug)
  kv_cache_dtype: auto              # KV cache quantisation: auto, fp8, fp8_e5m2
  speculative_model: null           # Speculative decoding model
```

**When to use:** Production deployments, high-throughput serving (>10 QPS), batch inference workloads, or when maximising GPU utilisation is critical.

---

### TensorRT Backend

The **TensorRT backend** uses NVIDIA TensorRT-LLM for maximum single-query performance with aggressive kernel fusion and low-level optimisations.

**Key features:**
- **Kernel fusion** — operator-level graph optimisations
- **FP8 quantisation** — NVIDIA Hopper (H100) optimised precision
- **Custom CUDA kernels** — hand-tuned for NVIDIA architectures
- **INT4/INT8 quantisation** — weight-only and activation quantisation
- **Multi-GPU inference** — tensor parallelism for large models

**Configuration example:**
```yaml
backend: tensorrt

tensorrt:
  max_batch_size: 8
  max_input_len: 1024
  max_output_len: 512
  enable_trt_overlap: true          # Overlap compute and data transfer
  kv_cache_free_gpu_mem_fraction: 0.9
```

**When to use:** Latency-critical applications, NVIDIA GPU deployments (A100/H100), maximum single-query performance, or when targeting specific NVIDIA architecture optimisations.

---

### Backend Comparison Methodology

The multi-backend architecture enables **controlled comparisons** of inference efficiency:

1. **Fixed workload** — Same model, prompts, and generation parameters across backends
2. **Backend-specific optimisation** — Each backend uses its optimal configuration (e.g., vLLM's continuous batching, TensorRT's kernel fusion)
3. **Unified measurement** — Energy, throughput, and FLOPs tracked consistently via CodeCarbon and native timing
4. **Campaign orchestration** — Run multiple backend configs in a single experiment with statistical comparison

This design isolates backend-level implementation effects from model-level computational requirements, enabling rigorous efficiency analysis.

---

## Configuration

### Key Parameters

| Category | Parameter | Options |
|----------|-----------|---------|
| **Backend** | `backend` | pytorch, vllm, tensorrt |
| **Precision** | `fp_precision` | float32, float16, bfloat16 |
| **Quantisation** | `load_in_4bit` / `load_in_8bit` | bool (PyTorch); backend-specific for vLLM/TensorRT |
| **Batching** | `batching.strategy` | static, dynamic, sorted_static, sorted_dynamic |
| **Parallelism** | `sharding.strategy` | none, tensor_parallel, pipeline_parallel |
| **Traffic** | `traffic_simulation.mode` | constant, poisson |
| **Decoder** | `decoder.preset` | deterministic, standard, creative, factual |

Configs use YAML with backend-specific parameters nested under backend name (e.g., `vllm.gpu_memory_utilization`). The `_extends` directive enables inheritance—override only what changes across experiments.

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
# === CORE ===
config_name: llama-3.2-3b-vllm-benchmark
model_name: meta-llama/Llama-3.2-3B
backend: vllm                          # pytorch | vllm | tensorrt

# === PRECISION ===
fp_precision: float16                  # float32 | float16 | bfloat16

# === QUANTIZATION (PyTorch) ===
quantization:
  load_in_4bit: false
  load_in_8bit: false

# === GPU SETUP ===
gpus: [0, 1, 2, 3]
num_processes: 4

# === BATCHING ===
batching:
  strategy: sorted_dynamic             # static | dynamic | sorted_static | sorted_dynamic
  batch_size: 32
  max_tokens_per_batch: 4096           # Token budget for dynamic strategies

# === TRAFFIC SIMULATION ===
traffic_simulation:
  enabled: true
  mode: poisson                        # constant | poisson
  target_qps: 10.0

# === DECODER ===
decoder:
  preset: deterministic                # deterministic | standard | creative | factual
  max_new_tokens: 256

# === SHARDING (Multi-GPU) ===
sharding:
  strategy: tensor_parallel            # none | tensor_parallel | pipeline_parallel
  num_shards: 4

# === BACKEND-SPECIFIC CONFIG ===
vllm:
  gpu_memory_utilization: 0.9
  enable_prefix_caching: true
  max_model_len: 4096
```

All configuration is **Pydantic-validated** at load time—invalid configs fail fast with clear error messages. Backend-specific parameters are nested under the backend name.

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
src/llenergymeasure/
├── cli/                # Typer CLI with subcommand modules
│   ├── experiment.py   # Experiment execution commands
│   ├── campaign.py     # Multi-config campaign orchestration
│   ├── config.py       # Config validation and display
│   └── results.py      # Results management and export
├── config/
│   ├── loader.py       # YAML parsing with _extends inheritance
│   ├── validation.py   # Pydantic schemas for all backends
│   ├── presets.py      # Decoder presets (deterministic, creative, etc.)
│   └── introspection.py # Parameter provenance tracking
├── core/
│   ├── runner.py       # Distributed inference orchestration
│   ├── energy.py       # CodeCarbon integration, energy backends
│   ├── flops.py        # Three-strategy FLOPs estimation
│   └── metrics.py      # Throughput and latency collectors
├── backends/
│   ├── pytorch/        # Native PyTorch backend with TP/PP
│   ├── vllm/           # vLLM backend with continuous batching
│   └── tensorrt/       # TensorRT backend with kernel fusion
├── domain/
│   ├── config.py       # ExperimentConfig, backend-specific configs
│   ├── results.py      # InferenceResults, EnergyMetrics, etc.
│   └── enums.py        # Precision, ShardingStrategy, BatchingMode, Backend
├── orchestration/
│   ├── orchestrator.py # ExperimentOrchestrator with DI
│   ├── campaign.py     # Campaign orchestration for multi-config runs
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
| **Backend** | pytorch, vllm, tensorrt | Production-grade inference engines with different optimisation profiles |
| **Batching** | static, dynamic, sorted_static, sorted_dynamic | MLPerf-aligned request aggregation with optional token budgets |
| **Traffic** | constant, poisson | Simulate production load patterns at configurable QPS |
| **Sharding** | none, tensor_parallel, pipeline_parallel | Distribute model layers across GPUs |
| **FLOPs** | calflops → analytical → parameter-based | Three-strategy fallback for robust estimation |
| **Decoder** | deterministic, standard, creative, factual | Preset sampling configurations |

This architecture enables measuring how **backend choice, parallelism, batching, and precision interact**—factors the [research](/research/llm-energy-efficiency/) found can induce 4-6× variation in energy consumption within realistic deployment constraints, with total variation exceeding 50× across the full parameter space.

---

## Citation

If you use this tool in research, please cite:

> Baker, H. (2025). *The Implementation Gap: Inducing Variation in LLM Inference-time Energy Efficiency for Fixed Computational Workloads*. Masters of Data Science for Public Policy thesis, Hertie School.

---

[← Back to Software](/software/)

<p style="text-align: center; color: #6a737d; font-size: 0.85em; margin-top: 2em;">Last updated: January 2026</p>
