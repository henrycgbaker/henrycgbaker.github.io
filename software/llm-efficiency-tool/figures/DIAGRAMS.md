# LLM Efficiency Tool Diagrams

This document describes the diagrams needed for the article. Create these as PNG files in this folder.

---

## 1. architecture.png

**Purpose**: Show the three-stage measurement pipeline with distributed execution

**Style**: Flowchart with parallel branches, clean modern look

**Content**:
```
┌──────────────────────────────────────────────────────────────────┐
│                    MEASUREMENT PIPELINE                          │
└──────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│     CONFIGURATION       │     │      EXECUTION          │
│  ───────────────────    │     │  ───────────────────    │
│  • Model selection      │────▶│  • HuggingFace Accelerate
│  • Hardware config      │     │  • Tensor parallelism   │
│  • Generation params    │     │  • Barrier sync         │
│  • YAML inheritance     │     └────────────┬────────────┘
└─────────────────────────┘                  │
                              ┌──────────────┼──────────────┐
                              ▼              ▼              ▼
                         ┌────────┐    ┌────────┐    ┌────────┐
                         │ GPU 0  │    │ GPU 1  │    │ GPU N  │
                         │ ────── │    │ ────── │    │ ────── │
                         │ Energy │    │ Energy │    │ Energy │
                         │ Tokens │    │ Tokens │    │ Tokens │
                         │ Memory │    │ Memory │    │ Memory │
                         └────┬───┘    └────┬───┘    └────┬───┘
                              │              │              │
                              └──────────────┼──────────────┘
                                             │
                                             ▼
                              ┌─────────────────────────┐
                              │      AGGREGATION        │
                              │  ───────────────────    │
                              │  • Late aggregation     │
                              │  • Raw results preserved│
                              │  • Flexible analysis    │
                              └─────────────────────────┘
```

**Colours**:
- Config stage: Blue/teal
- Execution stage: Green
- Per-GPU boxes: Light grey with coloured borders
- Aggregation: Purple/violet

**Dimensions**: ~800×600px

---

## 2. measurement-flow.png (optional)

**Purpose**: Show what happens during a single measurement run

**Style**: Vertical timeline / sequence diagram

**Content**:
```
┌─────────────────────────────────────────────┐
│ 1. INITIALISATION                           │
│    • Load model onto GPU(s)                 │
│    • Configure distributed backend          │
│    • Start CodeCarbon tracker               │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│ 2. WARM-UP (discarded)                      │
│    • 3 dummy forward passes                 │
│    • Trigger lazy initialisations           │
│    • Stabilise GPU clocks                   │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│ 3. MEASUREMENT                              │
│    ┌─────────────────────────────────────┐  │
│    │ for batch in dataloader:            │  │
│    │   outputs = model.generate(batch)   │  │
│    │   record_tokens(outputs)            │  │
│    └─────────────────────────────────────┘  │
│    • Energy tracked continuously            │
│    • Tokens counted per process             │
└─────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────┐
│ 4. COLLECTION                               │
│    • Stop CodeCarbon                        │
│    • Gather per-GPU metrics                 │
│    • Save raw results to JSON               │
└─────────────────────────────────────────────┘
```

**Colours**: Gradient from top (light) to bottom (darker)

**Dimensions**: ~500×700px

---

## 3. energy-sources.png (optional)

**Purpose**: Pie chart or stacked bar showing energy breakdown

**Style**: Simple data visualisation

**Content**:
```
Typical Energy Breakdown (LLaMA-3B, 4×A100)

┌────────────────────────────────────────────┐
│  ██████████████████████████████████░░░░░░  │  GPU:  89%
│  ████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  CPU:   7%
│  ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  RAM:   4%
└────────────────────────────────────────────┘
```

Or as a pie:
- GPU (89%): Large slice, primary colour
- CPU (7%): Small slice, secondary colour
- RAM (4%): Tiny slice, tertiary colour

**Dimensions**: ~400×400px

---

## Tools Suggestions

- **Excalidraw** (excalidraw.com): Hand-drawn style, good for pipeline diagrams
- **Figma**: Clean, professional look
- **diagrams.net** (draw.io): Free, feature-rich
- **Mermaid**: If you want code-defined diagrams

Export as PNG at 2x resolution for crisp display on retina screens.
