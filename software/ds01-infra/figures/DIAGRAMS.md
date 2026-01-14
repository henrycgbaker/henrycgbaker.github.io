# DS01 Infrastructure Diagrams

This document describes the diagrams needed for the article. Create these as PNG files in this folder.

---

## 1. architecture-overview.png

**Purpose**: Show how DS01 layers on top of AIME and Docker

**Style**: Clean boxes/layers diagram, light background

**Content**:
```
┌─────────────────────────────────────────────────────────────┐
│                      DS01 INFRASTRUCTURE                    │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Resource Management    User Workflows    Automation │   │
│  │  • Per-user quotas      • Wizards         • Cleanup  │   │
│  │  • GPU allocation       • Onboarding      • Logging  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    AIME ML CONTAINERS                       │
│  150+ pre-built images • Container lifecycle commands       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              DOCKER + NVIDIA CONTAINER TOOLKIT              │
│  Container runtime • GPU passthrough                        │
└─────────────────────────────────────────────────────────────┘
```

**Colours**:
- DS01 layer: Primary colour (blue/teal)
- AIME layer: Secondary colour (grey/slate)
- Docker layer: Neutral (darker grey)

**Dimensions**: ~800×400px

---

## 2. gpu-allocation.png

**Purpose**: Illustrate the GPU allocation decision flow

**Style**: Flowchart with decision diamonds

**Content**:
```
        ┌─────────────────┐
        │  User requests  │
        │   GPU access    │
        └────────┬────────┘
                 │
                 ▼
        ┌────────────────────┐
        │ Check user quota   │
        │ (resource-limits   │
        │  .yaml)            │
        └────────┬───────────┘
                 │
                 ▼
        ◇ Within quota? ◇
       /                 \
      No                 Yes
      │                   │
      ▼                   ▼
┌──────────┐    ┌──────────────────┐
│  Reject  │    │ Check available  │
│ request  │    │ GPUs (gpu-state  │
└──────────┘    │ .json)           │
                └────────┬─────────┘
                         │
                         ▼
                ◇ GPUs available? ◇
               /                   \
              No                   Yes
              │                     │
              ▼                     ▼
       ┌──────────┐      ┌───────────────────┐
       │  Queue   │      │  Allocate GPU(s)  │
       │ request  │      │  Update state     │
       └──────────┘      │  Launch container │
                         └───────────────────┘
```

**Colours**:
- Decision points: Yellow/amber
- Success path: Green
- Reject/queue: Red/orange
- Process boxes: Blue

**Dimensions**: ~600×700px

---

## 3. layer-model.png (optional)

**Purpose**: Visual representation of the 5-layer architecture

**Style**: Stacked horizontal bars

**Content**:
```
Layer 4  │████████████████████████████│  Workflow Wizards
         │  user-setup, project-init  │  (complete experiences)

Layer 3  │████████████████████████████│  Orchestrators
         │  deploy-container, etc.    │  (multi-step workflows)

Layer 2  │████████████████████████████│  Atomic Commands
         │  container-*, image-*      │  (single operations)

Layer 1  │████████████████████████████│  AIME ML Containers
         │  mlc-*, docker lifecycle   │  (hidden from users)

Layer 0  │████████████████████████████│  Docker Runtime
         │  docker, nvidia-ctk        │  (foundational)
```

**Colours**: Gradient from top (user-facing, vibrant) to bottom (infrastructure, muted)

**Dimensions**: ~700×400px

---

## Tools Suggestions

- **Excalidraw** (excalidraw.com): Hand-drawn style, great for architecture diagrams
- **Figma**: Clean, professional look
- **diagrams.net** (draw.io): Free, feature-rich
- **Mermaid + render**: If you want code-defined diagrams

Export as PNG at 2x resolution for crisp display on retina screens.
