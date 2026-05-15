---
layout: page
title: Vehicle Detection & Speed Estimation from Traffic Footage (YOLOv2 + MATLAB)
description: >
  Trained a YOLOv2 detector on a self-curated vehicle dataset and built a
  frame-by-frame tracking layer to estimate real-world vehicle speeds from
  monocular traffic video. BUET EEE coursework.
img: assets/img/projects/yolov2.jpg
importance: 3
category: undergraduate
---

{% include figure.liquid path=page.img class="project-hero-img rounded z-depth-1" %}

End-to-end computer-vision pipeline that takes raw traffic-camera footage and outputs per-vehicle real-world speed overlays — built as a coursework project at BUET EEE.

The pipeline has three parts. First, a **custom vehicle-detection dataset** assembled from local traffic footage, with bounding-box annotations across vehicle classes. Second, a **YOLOv2 detector trained in MATLAB** on this dataset — anchor-box configuration tuned to the size distribution of the captured frames, with precision/recall validation on a held-out split. Third, a **frame-by-frame tracking and speed-estimation layer**: detections are associated across consecutive frames, pixel-space displacement is converted to ground-plane distance using a calibrated reference, and instantaneous speed is computed from the known frame rate.

The final system overlays per-vehicle bounding boxes with live speed estimates directly on the video stream — usable as a low-cost alternative to radar-based speed enforcement in environments where a single fixed camera covers the road.

### Key engineering content

- Curated and annotated a vehicle-detection dataset from local traffic footage
- Trained YOLOv2 in MATLAB's Deep Learning Toolbox; anchor sizing and loss tracking
- Pixel-to-ground-plane calibration for real-world distance recovery
- Frame-to-frame detection association for tracking + speed computation
- Real-time overlay rendering on the output video

### Tech Stack

`MATLAB` · `Deep Learning Toolbox` · `YOLOv2` · `Computer vision` · `Dataset annotation` · `Object tracking`

[**Code on GitHub →**](https://github.com/Monirul305/Yolo-based-traffic-speed-estimation-system)
