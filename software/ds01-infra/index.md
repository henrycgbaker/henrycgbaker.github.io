---
layout: homepage
title: DS01 Infrastructure
permalink: /software/ds01-infra/
---

# DS01 Infrastructure

**Multi-User GPU Container Management for Academic Machine Learning**

An open-source system for managing shared GPU resources in teaching and research environments. Built on Docker and AIME ML Containers, designed for small universities and labs.

[GitHub: ds01-infra](https://github.com/hertie-data-science-lab/ds01-infra) · [Documentation Hub](https://github.com/hertie-data-science-lab/ds01-hub)

---

## The Problem

Academic data science labs face a common infrastructure challenge: how do you share expensive GPU hardware across dozens of students and researchers, each with different skill levels, project requirements, and compute needs?

### The Typical Situation

A university acquires a GPU server—perhaps 4× NVIDIA A100s costing upwards of €100,000. This machine needs to support:

- **Master's students** running coursework notebooks, many encountering GPUs for the first time
- **PhD researchers** training models for weeks at a time
- **Faculty** running time-sensitive experiments before conference deadlines

Without proper management, predictable problems emerge:

| Problem | What Happens |
|---------|--------------|
| **Resource hogging** | One user's runaway process consumes all GPUs for days |
| **Environment conflicts** | "It works on my machine" becomes "it worked until someone installed TensorFlow 2.x" |
| **Beginner confusion** | Students spend more time fighting CUDA drivers than learning ML |
| **Zombie processes** | Forgotten jobs accumulate, wasting resources indefinitely |
| **No accountability** | When something breaks, no one knows who did what |

### Why Containers—But Not Just Containers

Docker solves many of these problems in principle: isolated environments, reproducible builds, clean separation between users. But raw Docker on a shared GPU server introduces its own complexity:

- Students need to learn Docker commands, volume mounts, GPU flags
- No built-in resource quotas or fair scheduling
- No lifecycle management—containers run until someone remembers to stop them
- The gap between "docker run" and a working ML environment is substantial

**The insight behind DS01**: What if we could give users the *benefits* of containerisation without requiring them to become Docker experts?

---

## The Solution

DS01 Infrastructure wraps Docker with a user-friendly layer that handles resource allocation, environment setup, and lifecycle management automatically. Students interact with simple commands; the system handles the container orchestration behind the scenes.

### Design Philosophy: Wrap, Don't Replace

Rather than building container management from scratch, DS01 extends [AIME ML Containers](https://github.com/aime-team/ml-containers)—a mature framework with 150+ pre-built ML images covering PyTorch, TensorFlow, JAX, and common data science stacks.

This "wrap, don't replace" approach provides:

- **Proven reliability**: AIME's container lifecycle commands are battle-tested
- **Maintained images**: Regular updates to ML frameworks without local maintenance burden
- **Minimal patching**: DS01 adds only what's needed (a single `--image` flag, ~2.5% code change)

![Architecture Overview](figures/architecture-overview.png)
*DS01 adds resource management, user workflows, and automation on top of AIME's container foundation.*

---

## Architecture

DS01 uses a **five-layer architecture** that separates concerns and provides clear extension points, following a "wrap, don't replace" philosophy.

### System Overview

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              DS01 INFRASTRUCTURE                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐  │
│  │     Resource Management          User Workflows          Automation        │  │
│  │     ──────────────────           ──────────────          ──────────        │  │
│  │     • Per-user quotas            • Wizards               • Idle cleanup    │  │
│  │     • GPU allocation             • Onboarding            • Event logging   │  │
│  │     • Priority scheduling        • Project init          • Audit trail     │  │
│  │     • MIG partitioning           • Help system           • Cron jobs       │  │
│  └────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           AIME ML CONTAINERS                                      │
│  150+ pre-built images • Container lifecycle commands • ~2.5% patched for DS01   │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                      DOCKER + NVIDIA CONTAINER TOOLKIT                            │
│  Container runtime • GPU passthrough • cgroup isolation                           │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

### The Layer Model

Each layer depends only on the layer below it, making the system modular and independently testable.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              COMMAND LAYER MODEL                                  │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────────────┐
│  LAYER 4: Workflow Wizards                                                        │
│  ────────────────────────────────────────────────────────────────────────────    │
│  Complete guided experiences for common tasks                                     │
│                                                                                   │
│  Commands: user-setup, project-init                                               │
│  Users:    Everyone (students, researchers)                                       │
│  Purpose:  Zero-to-working in minutes, no Docker knowledge required               │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│  LAYER 3: Orchestrators                                                           │
│  ────────────────────────────────────────────────────────────────────────────    │
│  Multi-step workflows composing atomic commands                                   │
│                                                                                   │
│  Commands: container-deploy, container-retire, project-launch                     │
│  Users:    Power users, researchers                                               │
│  Purpose:  Common sequences bundled with sensible defaults                        │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│  LAYER 2: Atomic Commands                                                         │
│  ────────────────────────────────────────────────────────────────────────────    │
│  Single-purpose utilities for fine-grained control                                │
│                                                                                   │
│  Commands: container-create, container-start, container-stop, container-list,     │
│            image-list, image-pull, check-limits, gpu-status                       │
│  Users:    Power users, admins                                                    │
│  Purpose:  Building blocks for custom workflows                                   │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│  LAYER 1: AIME ML Containers                                                      │
│  ────────────────────────────────────────────────────────────────────────────    │
│  Upstream container lifecycle commands (hidden from DS01 users)                   │
│                                                                                   │
│  Commands: mlc-create, mlc-start, mlc-stop, mlc-list, mlc-open, mlc-remove, ...   │
│  Users:    DS01 internals only                                                    │
│  Purpose:  Battle-tested container management, 150+ ML images                     │
└──────────────────────────────────────────────────────────────────────────────────┘
                                          │
                                          ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│  LAYER 0: Docker + NVIDIA Container Toolkit                                       │
│  ────────────────────────────────────────────────────────────────────────────    │
│  Foundational container runtime with GPU support                                  │
│                                                                                   │
│  Components: dockerd, containerd, nvidia-ctk, systemd cgroups                     │
│  Users:      System only                                                          │
│  Purpose:    Industry-standard container execution                                │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Why this matters:**

- **For students**: Interact with Layer 4 wizards—`user-setup` handles SSH keys, VS Code, and first container launch automatically
- **For researchers**: Use Layer 2-3 commands for fine-grained control while still benefiting from quota enforcement
- **For admins**: Debug issues at the appropriate layer; AIME commands work independently for isolation testing

---

### GPU Allocation Flow

The GPU allocator implements priority-based scheduling with MIG awareness.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            GPU ALLOCATION FLOW                                    │
└──────────────────────────────────────────────────────────────────────────────────┘

                         ┌─────────────────────────┐
                         │   User requests GPU(s)  │
                         │   via container-create  │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │  Load user config from  │
                         │  resource-limits.yaml   │
                         └────────────┬────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │ Within quota? │
                              └───────┬───────┘
                                      │
                        ┌─────────────┴─────────────┐
                        │                           │
                       No                          Yes
                        │                           │
                        ▼                           ▼
               ┌────────────────┐       ┌─────────────────────────┐
               │ Reject request │       │  Load GPU state from    │
               │ Show quota info│       │  /var/lib/ds01/         │
               └────────────────┘       │  gpu-state.json         │
                                        └────────────┬────────────┘
                                                     │
                                                     ▼
                                        ┌─────────────────────────┐
                                        │  Check MIG config       │
                                        │  (full GPU vs partition)│
                                        └────────────┬────────────┘
                                                     │
                                                     ▼
                                             ┌───────────────┐
                                             │ GPU available?│
                                             └───────┬───────┘
                                                     │
                                       ┌─────────────┴─────────────┐
                                       │                           │
                                      No                          Yes
                                       │                           │
                                       ▼                           ▼
                              ┌────────────────┐       ┌─────────────────────────┐
                              │ Queue request  │       │  Acquire file lock      │
                              │ Notify user    │       │  Allocate GPU(s)        │
                              └────────────────┘       │  Update gpu-state.json  │
                                                       │  Release lock           │
                                                       └────────────┬────────────┘
                                                                    │
                                                                    ▼
                                                       ┌─────────────────────────┐
                                                       │  Set environment:       │
                                                       │  NVIDIA_VISIBLE_DEVICES │
                                                       │  CUDA_VISIBLE_DEVICES   │
                                                       └────────────┬────────────┘
                                                                    │
                                                                    ▼
                                                       ┌─────────────────────────┐
                                                       │  Launch container       │
                                                       │  Apply cgroup limits    │
                                                       │  Log to events.jsonl    │
                                                       └─────────────────────────┘
```

---

### Resource Enforcement

Multiple enforcement mechanisms work together to ensure fair resource sharing.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          RESOURCE ENFORCEMENT STACK                               │
└──────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│     QUOTA ENFORCEMENT    │  │    RUNTIME ENFORCEMENT   │  │   LIFECYCLE ENFORCEMENT  │
│  ──────────────────────  │  │  ──────────────────────  │  │  ──────────────────────  │
│                          │  │                          │  │                          │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │ resource-limits    │  │  │  │ systemd cgroups    │  │  │  │ Idle detection     │  │
│  │ .yaml              │  │  │  │                    │  │  │  │                    │  │
│  │                    │  │  │  │ • CPU shares       │  │  │  │ • SSH activity     │  │
│  │ • gpu_limit        │  │  │  │ • Memory hard cap  │  │  │  │ • Terminal sessions│  │
│  │ • cpu_limit        │  │  │  │ • GPU isolation    │  │  │  │ • Process count    │  │
│  │ • memory_limit     │  │  │  │ • OOM handling     │  │  │  │                    │  │
│  │ • max_runtime_hrs  │  │  │  │                    │  │  │  │ Default: 48h       │  │
│  └────────────────────┘  │  │  └────────────────────┘  │  │  └────────────────────┘  │
│                          │  │                          │  │                          │
│  ┌────────────────────┐  │  │  ┌────────────────────┐  │  │  ┌────────────────────┐  │
│  │ Priority system    │  │  │  │ Docker wrapper     │  │  │  │ Runtime limits     │  │
│  │                    │  │  │  │                    │  │  │  │                    │  │
│  │ user > group >     │  │  │  │ • --cpus flag      │  │  │  │ • Max container    │  │
│  │ defaults           │  │  │  │ • --memory flag    │  │  │  │   lifetime         │  │
│  │                    │  │  │  │ • --gpus flag      │  │  │  │ • Auto-stop        │  │
│  └────────────────────┘  │  │  └────────────────────┘  │  │  └────────────────────┘  │
│                          │  │                          │  │                          │
│  Applied at:             │  │  Applied at:             │  │  Applied via:            │
│  Container creation      │  │  Container runtime       │  │  Cron + systemd timers   │
│                          │  │                          │  │                          │
└──────────────────────────┘  └──────────────────────────┘  └──────────────────────────┘
```

---

### Container Lifecycle

Containers follow a managed lifecycle with automatic cleanup.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           CONTAINER LIFECYCLE                                     │
└──────────────────────────────────────────────────────────────────────────────────┘

     ┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
     │ CREATED  │─────────▶│ RUNNING  │─────────▶│ STOPPED  │─────────▶│ REMOVED  │
     └──────────┘          └──────────┘          └──────────┘          └──────────┘
          │                     │                     │                     │
          │                     │                     │                     │
          ▼                     ▼                     ▼                     ▼
    ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
    │ • Quota check│     │ • GPU active │     │ • GPU freed  │     │ • Logs saved │
    │ • GPU alloc  │     │ • Cgroups    │     │ • Idle timer │     │ • State clean│
    │ • State file │     │   enforced   │     │   stopped    │     │ • Image kept │
    │ • Event log  │     │ • Monitoring │     │ • Event log  │     │   (or pruned)│
    └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘

                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────────┐   ┌──────────┐
        │ User     │   │ Idle timeout │   │ Runtime  │
        │ request  │   │ (48h default)│   │ limit    │
        │          │   │              │   │ exceeded │
        └──────────┘   └──────────────┘   └──────────┘

                    Triggers for RUNNING → STOPPED
```

---

### User Onboarding Flow

The `user-setup` wizard automates complete onboarding.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           USER ONBOARDING FLOW                                    │
└──────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│  user-setup --guided                                                            │
└────────────────────────────────────────────────────────┬────────────────────────┘
                                                         │
     ┌───────────────────────────────────────────────────┼────────────────────────┐
     │                                                   │                        │
     ▼                                                   ▼                        ▼
┌─────────────┐                                   ┌─────────────┐          ┌─────────────┐
│ 1. HOME DIR │                                   │ 2. SSH KEYS │          │ 3. VS CODE  │
│ ─────────── │                                   │ ─────────── │          │ ─────────── │
│             │                                   │             │          │             │
│ Create:     │                                   │ Generate:   │          │ Configure:  │
│ ~/projects/ │                                   │ ~/.ssh/     │          │ Remote-SSH  │
│ ~/data/     │                                   │ id_ed25519  │          │ extension   │
│ ~/.config/  │                                   │             │          │             │
└──────┬──────┘                                   └──────┬──────┘          └──────┬──────┘
       │                                                 │                        │
       └─────────────────────────┬───────────────────────┴────────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ 4. STARTER CONTAINER    │
                    │ ─────────────────────── │
                    │                         │
                    │ Launch:                 │
                    │ • PyTorch + Jupyter     │
                    │ • 1 GPU allocated       │
                    │ • Mounted ~/projects    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ 5. FIRST STEPS GUIDE    │
                    │ ─────────────────────── │
                    │                         │
                    │ Print:                  │
                    │ • Jupyter URL           │
                    │ • SSH command           │
                    │ • Quick reference       │
                    │ • Help resources        │
                    └─────────────────────────┘

    Total time: ~10 minutes (no Docker knowledge required)
```

---

### Help System Architecture

The four-tier help system supports users from quick lookups to deep learning.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                           HELP SYSTEM TIERS                                       │
└──────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐   ┌────────────────────┐
│      --help        │   │      --info        │   │    --concepts      │   │     --guided       │
│  ────────────────  │   │  ────────────────  │   │  ────────────────  │   │  ────────────────  │
│                    │   │                    │   │                    │   │                    │
│  Quick reference   │   │  Full docs         │   │  Educational       │   │  Interactive       │
│                    │   │                    │   │                    │   │                    │
│  • Syntax          │   │  • All options     │   │  • Why, not how    │   │  • Step-by-step    │
│  • Common flags    │   │  • Examples        │   │  • Docker basics   │   │  • Prompts         │
│  • Exit codes      │   │  • Edge cases      │   │  • GPU concepts    │   │  • Validation      │
│                    │   │                    │   │  • Best practices  │   │  • Confirmation    │
│                    │   │                    │   │                    │   │                    │
│  Audience:         │   │  Audience:         │   │  Audience:         │   │  Audience:         │
│  Returning users   │   │  Power users       │   │  Learners          │   │  First-time users  │
│                    │   │                    │   │                    │   │                    │
│  Length: ~20 lines │   │  Length: ~100 lines│   │  Length: ~50 lines │   │  Length: varies    │
└────────────────────┘   └────────────────────┘   └────────────────────┘   └────────────────────┘

                    Increasing detail and interactivity ──────────────────────▶
```

---

### Script Structure

The codebase follows a functional organisation matching the layer model.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                            SCRIPT STRUCTURE                                       │
└──────────────────────────────────────────────────────────────────────────────────┘

/opt/ds01-infra/
├── scripts/
│   ├── user/                    # Layer 2-4: User-facing commands
│   │   ├── container-create     # L2: Create container with quota enforcement
│   │   ├── container-start      # L2: Start existing container
│   │   ├── container-stop       # L2: Stop container, release GPU
│   │   ├── container-list       # L2: List user's containers
│   │   ├── container-deploy     # L3: Orchestrated create + start + configure
│   │   ├── container-retire     # L3: Orchestrated stop + cleanup
│   │   ├── user-setup           # L4: Complete onboarding wizard
│   │   └── project-init         # L4: Project scaffolding wizard
│   │
│   ├── docker/                  # Layer 1: AIME integration + GPU management
│   │   ├── gpu_allocator.py     # GPU state management, MIG support
│   │   ├── mlc-wrapper.sh       # AIME command wrapper with --image patch
│   │   └── quota-check.sh       # Pre-flight resource validation
│   │
│   ├── admin/                   # Administrative utilities
│   │   ├── add-user.sh          # Provision new user
│   │   ├── remove-user.sh       # Deprovision user + cleanup
│   │   └── audit-report.sh      # Generate usage reports
│   │
│   ├── monitoring/              # Observability
│   │   ├── ds01-dashboard       # Real-time TUI dashboard
│   │   └── prometheus-exporter  # Metrics for Grafana
│   │
│   ├── maintenance/             # Automated housekeeping
│   │   ├── idle-cleanup.sh      # Stop idle containers (cron)
│   │   ├── orphan-cleanup.sh    # Remove abandoned resources
│   │   └── log-rotate.sh        # Rotate event logs
│   │
│   └── system/                  # One-time setup scripts
│       ├── setup-resource-slices.sh  # Configure systemd cgroups
│       └── deploy-commands.sh        # Symlink commands to PATH
│
├── config/
│   ├── resource-limits.yaml    # Per-user/group quotas
│   ├── gpu-config.yaml         # MIG partitioning, device mapping
│   └── images.yaml             # Available ML images registry
│
└── lib/
    ├── common.sh               # Shared shell functions
    ├── logging.sh              # Structured event logging
    └── validation.sh           # Input validation helpers
```

---

### Configuration Resolution

Resource limits cascade from defaults through groups to user-specific overrides.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                        CONFIGURATION RESOLUTION                                   │
└──────────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │         resource-limits.yaml        │
                    └─────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
┌───────────────┐           ┌─────────────────┐           ┌─────────────────┐
│   defaults:   │           │    groups:      │           │    users:       │
│ ───────────── │           │ ─────────────── │           │ ─────────────── │
│ gpu: 1        │           │ msc_students:   │           │ jane.researcher:│
│ cpu: 8        │           │   gpu: 1        │           │   gpu: 4        │
│ memory: 32G   │           │   runtime: 24h  │           │   runtime: 336h │
│ runtime: 48h  │           │                 │           │                 │
└───────┬───────┘           │ phd_students:   │           └────────┬────────┘
        │                   │   gpu: 2        │                    │
        │                   │   runtime: 168h │                    │
        │                   └────────┬────────┘                    │
        │                            │                             │
        └────────────────────────────┼─────────────────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────────┐
                    │        Resolution Order:            │
                    │  ─────────────────────────────────  │
                    │                                     │
                    │  1. Check users[username]           │
                    │     └─▶ If found, use these values  │
                    │                                     │
                    │  2. Check groups[user's groups]     │
                    │     └─▶ Merge matching group values │
                    │                                     │
                    │  3. Fall back to defaults           │
                    │     └─▶ Fill any remaining fields   │
                    │                                     │
                    └─────────────────────────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────────┐
                    │     Example: alice (msc_student)    │
                    │  ─────────────────────────────────  │
                    │                                     │
                    │  Resolved config:                   │
                    │  • gpu_limit: 1      (from group)   │
                    │  • cpu_limit: 8      (from default) │
                    │  • memory: 32G       (from default) │
                    │  • runtime: 24h      (from group)   │
                    │                                     │
                    └─────────────────────────────────────┘
```

---

### Event Logging Architecture

All significant actions are logged to a structured event stream for auditing and debugging.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                          EVENT LOGGING FLOW                                       │
└──────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ container-create│  │ container-stop  │  │  gpu_allocator  │  │  idle-cleanup   │
│                 │  │                 │  │                 │  │                 │
│  User command   │  │  User command   │  │  Internal       │  │  Cron job       │
└────────┬────────┘  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
         │                    │                    │                    │
         └────────────────────┼────────────────────┼────────────────────┘
                              │                    │
                              ▼                    ▼
                    ┌─────────────────────────────────────┐
                    │          lib/logging.sh             │
                    │  ─────────────────────────────────  │
                    │                                     │
                    │  log_event() {                      │
                    │    timestamp, user, action,         │
                    │    resource, details, outcome       │
                    │  }                                  │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │   /var/log/ds01/events.jsonl        │
                    │  ─────────────────────────────────  │
                    │                                     │
                    │  {"ts":"2026-01-14T10:23:45Z",      │
                    │   "user":"alice",                   │
                    │   "action":"container.create",      │
                    │   "resource":"pytorch-dev._.alice", │
                    │   "gpu":"0",                        │
                    │   "outcome":"success"}              │
                    │                                     │
                    │  {"ts":"2026-01-14T10:24:01Z",      │
                    │   "user":"bob",                     │
                    │   "action":"gpu.allocate",          │
                    │   "resource":"gpu:1",               │
                    │   "outcome":"success"}              │
                    │                                     │
                    │  {"ts":"2026-01-14T11:00:00Z",      │
                    │   "user":"system",                  │
                    │   "action":"cleanup.idle",          │
                    │   "resource":"old-job._.charlie",   │
                    │   "outcome":"stopped"}              │
                    │                                     │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
           ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
           │ Admin audit  │  │   Grafana    │  │ Debugging    │
           │ reports      │  │  dashboards  │  │ & forensics  │
           └──────────────┘  └──────────────┘  └──────────────┘
```

**Log retention:** Events are rotated weekly with 4-week retention. Sensitive fields (tokens, passwords) are never logged.

---

## Key Features

### Resource Management

DS01 enforces per-user resource quotas through a centralised YAML configuration:

```yaml
# config/resource-limits.yaml
defaults:
  cpu_limit: 8
  memory_limit: 32G
  gpu_limit: 1
  max_runtime_hours: 48

groups:
  phd_students:
    priority: 80
    gpu_limit: 2
    max_runtime_hours: 168  # 1 week

  msc_students:
    priority: 50
    gpu_limit: 1
    max_runtime_hours: 24

users:
  jane.researcher:
    priority: 100
    gpu_limit: 4
    max_runtime_hours: 336  # 2 weeks
```

**Configuration priority**: User overrides → Group memberships → Defaults. This allows sensible baseline limits with exceptions for specific needs.

**Enforcement mechanisms**:
- Resource limits applied at container creation via Docker wrappers
- Runtime limits enforced through systemd cgroup constraints
- GPU state tracked in `/var/lib/ds01/gpu-state.json` to prevent over-allocation

### GPU Allocation

The system is MIG-aware (Multi-Instance GPU), supporting both full GPUs and GPU partitions:

![GPU Allocation Flow](figures/gpu-allocation.png)
*Priority-based GPU scheduling ensures fair access while respecting user quotas.*

When a user requests GPUs:
1. System checks user's quota against current allocation
2. Available GPUs are identified (respecting MIG partitioning if configured)
3. Allocation is recorded in persistent state
4. Container launches with appropriate `NVIDIA_VISIBLE_DEVICES`

### Lifecycle Automation

Idle containers are automatically stopped, preventing resource waste:

| Mechanism | Default | Purpose |
|-----------|---------|---------|
| **Idle detection** | 48 hours | Stops containers with no SSH/terminal activity |
| **Runtime limits** | Per-user quota | Enforces maximum container lifetime |
| **Scheduled cleanup** | Daily cron | Removes orphaned containers and images |

All actions are logged to `/var/log/ds01/` with user attribution, providing an audit trail.

### User Experience

DS01 prioritises a teaching-oriented UX through a four-tier help system:

| Flag | Purpose | Example |
|------|---------|---------|
| `--help` | Quick reference | Command syntax and common options |
| `--info` | Full documentation | Complete usage guide with examples |
| `--concepts` | Educational context | Explains *why*, not just *how* |
| `--guided` | Interactive mode | Step-by-step prompts for complex operations |

**Example**: A student running `container-create --concepts` learns about Docker containers, resource isolation, and GPU allocation—concepts they'll need throughout their ML career—while accomplishing the immediate task.

### Onboarding Wizards

The `user-setup` wizard handles complete user onboarding:

1. Creates user's home directory structure
2. Generates SSH keys for container access
3. Configures VS Code Remote Development
4. Launches a starter container with Jupyter
5. Provides first-steps guidance

A new student goes from "I have an account" to "I'm running a Jupyter notebook on a GPU" in under 10 minutes, with no Docker knowledge required.

---

## For Labs & Universities

### Why Adopt DS01?

| Benefit | Without DS01 | With DS01 |
|---------|--------------|-----------|
| **Student onboarding** | Hours of setup, CUDA debugging | 10-minute wizard |
| **Resource fairness** | "First come, first served" chaos | Quota-based allocation |
| **Environment management** | Conflicting installs, broken dependencies | Isolated containers per user |
| **Administrative overhead** | Manual monitoring, reactive cleanup | Automated lifecycle management |
| **Reproducibility** | "Works on the server" ≠ works anywhere | Containerised, portable environments |

### Target Environments

DS01 is designed for:

- **Small-to-medium university labs** (10-100 users, 1-8 GPUs)
- **Teaching environments** where students are learning ML, not infrastructure
- **Research groups** sharing compute across multiple projects
- **Bootcamps and workshops** needing quick, reproducible GPU access

### Prerequisites

| Component | Requirement |
|-----------|-------------|
| **Hardware** | Linux server with NVIDIA GPUs |
| **Software** | Docker, NVIDIA Container Toolkit, Python 3.8+ |
| **Base framework** | AIME ML Containers (installed at `/opt/aime-ml-containers`) |
| **Expertise** | Basic Linux sysadmin for initial setup |

### What You Get

- **Pre-built ML environments**: PyTorch, TensorFlow, JAX, scikit-learn, and more via AIME's image library
- **Fair resource sharing**: No more "who's hogging the GPU?" emails
- **Self-service for users**: Students can create/stop containers without admin intervention
- **Audit logging**: Know who ran what, when, and for how long
- **Low maintenance**: Automated cleanup keeps the system healthy

---

## Technical Deep-Dives

### Image Workflow

DS01 uses a four-phase image building strategy:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Framework     │────▶│    Jupyter      │────▶│  Data Science   │────▶│    Use Case     │
│   (PyTorch,     │     │   (notebook     │     │   (pandas,      │     │   (project-     │
│    TF, JAX)     │     │    server)      │     │    sklearn)     │     │    specific)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

Each phase builds on the previous, creating a layered image hierarchy. Users can start from any level depending on their needs—from bare PyTorch to fully-configured project environments.

### Container Naming & Isolation

Containers follow the pattern `{container-name}._.{user-id}`:

```
pytorch-dev._.alice
jupyter-lab._.bob
thesis-experiment._.alice
```

This convention:
- Ensures unique container names across users
- Enables user-scoped operations (`container-list` shows only your containers)
- Provides clear ownership for logging and quotas

### Monitoring & Dashboards

The `ds01-dashboard` command provides real-time visibility:

```
╔══════════════════════════════════════════════════════════════╗
║  DS01 RESOURCE DASHBOARD                    Updated: 14:32  ║
╠══════════════════════════════════════════════════════════════╣
║  GPU Usage:  ████████░░  3/4 allocated                       ║
║  ├─ GPU 0:   alice (pytorch-dev) - 67% util                  ║
║  ├─ GPU 1:   bob (thesis-train) - 94% util                   ║
║  ├─ GPU 2:   charlie (jupyter) - 12% util                    ║
║  └─ GPU 3:   [available]                                     ║
║                                                              ║
║  Active Containers: 7                                        ║
║  Idle Containers:   2 (cleanup in 23h)                       ║
║  Pending Requests:  0                                        ║
╚══════════════════════════════════════════════════════════════╝
```

Administrators can identify underutilised resources, monitor for runaway processes, and plan capacity.

---

## Comparison to Alternatives

| Solution | Pros | Cons | Best For |
|----------|------|------|----------|
| **Raw Docker** | Full control, widely documented | Steep learning curve, no quotas | Expert users |
| **Kubernetes** | Production-grade orchestration | Massive complexity, overkill for small labs | Large-scale deployments |
| **JupyterHub** | Familiar notebook interface | Limited to Jupyter, complex GPU config | Teaching-focused, notebook-only |
| **Slurm/PBS** | HPC-standard, battle-tested | Batch-oriented, dated UX | Traditional HPC workloads |
| **DS01** | User-friendly + containerised + fair | Requires AIME base | Small labs, teaching environments |

DS01 occupies a useful middle ground: more structure than raw Docker, less complexity than Kubernetes, and better GPU support than JupyterHub.

---

## Getting Started

### Quick Start

```bash
# Clone the repository
git clone https://github.com/hertie-data-science-lab/ds01-infra.git /opt/ds01-infra

# Configure resource limits
vim /opt/ds01-infra/config/resource-limits.yaml

# Set up systemd resource slices
sudo /opt/ds01-infra/scripts/system/setup-resource-slices.sh

# Deploy user-facing commands
sudo /opt/ds01-infra/scripts/system/deploy-commands.sh

# Add a user
sudo /opt/ds01-infra/scripts/admin/add-user.sh alice
```

### For New Users

After admin setup, users run:

```bash
# Complete guided onboarding
user-setup --guided

# Or manually create a container
container-create --name my-project --image pytorch-jupyter
```

### Documentation

Each subsystem has dedicated documentation:

| Path | Contents |
|------|----------|
| `scripts/docker/README.md` | GPU allocation algorithm |
| `scripts/user/README.md` | Command layering, UX philosophy |
| `config/README.md` | YAML configuration syntax |
| `scripts/monitoring/README.md` | Dashboard setup |
| `scripts/maintenance/README.md` | Cleanup automation |

---

## Feature Evolution

<div style="max-height: 400px; overflow-y: auto; border: 1px solid #e1e4e8; border-radius: 6px; padding: 16px; margin: 16px 0;" markdown="1">

### v1.1.0 — Semantic Versioning (January 2026)

Development workflow improvements:

- **Commitizen integration** for conventional commits
- **Semantic versioning** with automated changelog generation
- **CI/CD improvements** for release automation

---

### v1.0.0 — MVP Release (December 2025)

Initial stable release for production use at Hertie School's Data Science Lab:

- **Container lifecycle management** — `container-deploy` and `container-retire` commands
- **GPU allocation** — MIG-aware scheduling with per-user limits and priority queuing
- **Custom image building** — Docker images with CUDA support via multi-stage builds
- **Resource enforcement** — systemd cgroups and OPA authorisation policies
- **Five-layer command hierarchy** — Docker → MLC → Atomic → Orchestrators → Wizards
- **Centralised event logging** — Structured logs to `/var/log/ds01/events.jsonl`
- **Stateless GPU allocator** — File locking mechanism for concurrent access
- **Comprehensive documentation** — Getting started, how-to guides, command reference, troubleshooting

</div>

---

## Roadmap

DS01 is under active development. Planned features:

- **Web dashboard**: Browser-based resource monitoring and container management
- **Resource reservation**: Book GPUs for specific time windows
- **Usage analytics**: Track compute usage per user/project for reporting
- **Multi-node support**: Extend to small clusters with shared scheduling

Contributions welcome—see the [GitHub repository](https://github.com/hertie-data-science-lab/ds01-infra) for issues and contribution guidelines.

---

## Acknowledgements

DS01 builds on the excellent [AIME ML Containers](https://github.com/aime-team/ml-containers) project, which provides the foundation of pre-built images and container lifecycle management.

Developed for the [Hertie School Data Science Lab](https://www.hertie-school.org/en/datasciencelab) to support teaching and research in applied machine learning.

---

[← Back to Software](/software/)

<p style="text-align: center; color: #6a737d; font-size: 0.85em; margin-top: 2em;">Last updated: January 2026</p>
