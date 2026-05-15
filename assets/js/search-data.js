// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-publications",
          title: "publications",
          description: "Peer-reviewed publications and manuscripts under review. My name is shown in bold in author lists.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "Professional systems, research work, and undergraduate projects. All professional projects were built and deployed at Cybernetics Hi-Tech Solutions.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "cv",
          description: "Download the PDF version.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Selected GitHub repositories — code artifacts behind several of the projects, plus academic / coursework work across digital design, control, power electronics, and IC design.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "post-three-robots-one-factory-floor-production-deployed-agv-fleet-at-cybernetics",
        
          title: "Three Robots, One Factory Floor: Production-Deployed AGV Fleet at Cybernetics",
        
        description: "A LinkedIn-post mirror — the story behind a 3-robot AGV fleet now live on a busy garment factory floor in Bangladesh. ROS 2, AprilTag-fused EKF localization, distributed path planning, three-layer safety.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/agv-fleet-production-deployment/";
          
        },
      },{id: "post-in-house-pcb-fabrication-at-cybernetics-an-intern-39-s-refined-uv-solder-mask-process",
        
          title: "In-House PCB Fabrication at Cybernetics: An Intern&#39;s Refined UV Solder-Mask Process",
        
        description: "A teammate&#39;s LinkedIn post — Md. Tanvir Hassan, our R&amp;D Intern, shares the refined UV solder-mask process he developed for our in-house PCB fabrication line at Cybernetics. Cleaner masking, finer trace widths, faster design-to-PCB iteration. (His contribution, not mine — I&#39;m one of the senior R&amp;D engineers on the team.)",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2026/pcb-fabrication-uv-solder-mask/";
          
        },
      },{id: "post-milestone-cybermaker-titan-550-pro-3d-printer-delivered-to-bangladesh-navy",
        
          title: "Milestone: CyberMaker Titan 550 Pro 3D Printer Delivered to Bangladesh Navy",
        
        description: "A Cybernetics company announcement — delivery of the CyberMaker Titan 550 Pro industrial 3D printer (a platform I led the design on, through two iterations) to Dockyard and Engineering Works Ltd., Bangladesh Navy.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/titan-550-navy-delivery/";
          
        },
      },{id: "post-inside-the-agv-nav-stack-lidar-tile-mapping-with-multi-scan-stability-filtering",
        
          title: "Inside the AGV Nav Stack: LiDAR Tile-Mapping with Multi-Scan Stability Filtering",
        
        description: "Sharing a teammate&#39;s LinkedIn update — Mainul Islam&#39;s LiDAR occupancy-grid module that feeds our 3-robot AGV navigation stack. Tile-indexed point clouds, stable/unstable obstacle detection across 5 scans, and a color-coded debug overlay. (His work, not mine — I was on the same team.)",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/agv-lidar-tile-mapping/";
          
        },
      },{id: "post-tele-operated-rov-demo-6-dof-heavy-lift-arm-six-camera-cofdm-link-hcu-ocu-dual-control",
        
          title: "Tele-Operated ROV Demo: 6-DOF Heavy-Lift Arm, Six-Camera COFDM Link, HCU/OCU Dual Control",
        
        description: "A LinkedIn-post mirror — short demo of our newest tele-operated ROV. 6-DOF manipulator (20 kg @ 5 km/h), six IP cameras over a 1.4 GHz COFDM 1 km link, dual HCU/OCU control with a wired optical fallback.",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/advanced-rov-demo/";
          
        },
      },{id: "post-under-the-hood-of-the-rov-addressable-rs485-master-slave-for-bldc-servo-drive",
        
          title: "Under the Hood of the ROV: Addressable RS485 Master-Slave for BLDC-Servo Drive",
        
        description: "A teammate&#39;s LinkedIn deep-dive — Shakil Tanvir&#39;s addressable RS485 master-slave communication system driving the 6-DOF ROV with integrated BLDC servos. Motor specs, control-loop tuning, and a stair-climbing torque fix via RS232 reconfiguration. (His work, not mine — I was on the same team.)",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/rov-drive-system-rs485/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-joined-cybernetics-hi-tech-solutions-as-r-amp-amp-d-engineer-amp-amp-team-lead",
          title: 'Joined Cybernetics Hi-Tech Solutions as R&amp;amp;amp;D Engineer &amp;amp;amp; Team Lead.',
          description: "",
          section: "News",},{id: "news-paper-published-in-micromachines-mdpi-performance-analysis-of-an-α-graphyne-nano-field-effect-transistor-doi",
          title: 'Paper published in Micromachines (MDPI): Performance Analysis of an α-Graphyne Nano-Field Effect Transistor....',
          description: "",
          section: "News",},{id: "news-smart-soinik-1-0-gifted-to-the-peruvian-armed-forces-by-the-bangladesh-army-now-deployed-under-the-un-peacekeeping-mission-in-the-republic-of-mali-first-made-in-bangladesh-military-robot-in-active-un-service",
          title: 'Smart Soinik 1.0 gifted to the Peruvian Armed Forces by the Bangladesh Army...',
          description: "",
          section: "News",},{id: "news-paper-published-at-ieee-iccit-2024-optimizing-master-slave-broadcast-communication-in-multi-node-networks-using-rs485-standard-doi",
          title: 'Paper published at IEEE ICCIT 2024: Optimizing Master-Slave Broadcast Communication in Multi-Node Networks...',
          description: "",
          section: "News",},{id: "news-co-authored-manuscript-submitted-a-dual-network-feedback-communication-system-for-multi-node-unmanned-robotic-control-currently-under-review",
          title: 'Co-authored manuscript submitted: A Dual-Network Feedback Communication System for Multi-Node Unmanned Robotic Control...',
          description: "",
          section: "News",},{id: "news-jontro-soinik-1-0-js1-0-handover-ceremony-at-bangladesh-army-hq-auditorium-bangladesh-s-3rd-generation-eod-rov-set-for-deployment-in-the-un-peacekeeping-mission-in-the-republic-of-congo-in-2025",
          title: 'Jontro Soinik 1.0 (JS1.0) handover ceremony at Bangladesh Army HQ Auditorium — Bangladesh’s...',
          description: "",
          section: "News",},{id: "news-first-author-manuscript-submitted-differential-drive-synchronization-using-genetic-algorithm-optimized-cascaded-pid-controllers-on-stm32-based-mcu-currently-under-review",
          title: 'First-author manuscript submitted: Differential-Drive Synchronization Using Genetic Algorithm Optimized Cascaded PID Controllers on...',
          description: "",
          section: "News",},{id: "news-agv-fleet-system-featured-on-youtube-zero-collisions-how-3-autonomous-robots-share-a-busy-garment-factory-floor-full-walkthrough-of-the-ros-2-navigation-stack-fleetcore-coordinator-apriltag-ekf-and-3-layer-safety-architecture-deployed-at-the-urmi-group-watch-3-45",
          title: 'AGV fleet system featured on YouTube: Zero Collisions: How 3 Autonomous Robots Share...',
          description: "",
          section: "News",},{id: "projects-production-deployed-3-robot-agv-fleet-ros-2-apriltag-ekf-distributed-path-planning",
          title: 'Production-Deployed 3-Robot AGV Fleet (ROS 2, AprilTag EKF, Distributed Path Planning)',
          description: "Production-deployed autonomous guided vehicle fleet navigating a live garment factory alongside hundreds of workers. ROS 2, AprilTag EKF, distributed path planning, FleetCore coordinator.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/01_agv_fleet/";
            },},{id: "projects-7-dof-mobile-manipulator-with-custom-closed-form-ik-ros-2-moveit-2",
          title: '7-DOF Mobile Manipulator with Custom Closed-Form IK (ROS 2 / MoveIt 2)',
          description: "Full real-time control stack for a 7-DOF arm + tracked base. Custom closed-form analytical IK replacing MoveIt&#39;s KDL solver. Singularity-aware smooth scaling, FK-anchored accumulator, 40-test unit suite.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/02_manipulator/";
            },},{id: "projects-indigenous-eod-rov-family-un-peacekeeping-deployment-mali-congo",
          title: 'Indigenous EOD ROV Family — UN Peacekeeping Deployment (Mali, Congo)',
          description: "Smart Soinik 1.0 (SS1.0) and Jontro Soinik 1.0 (JS1.0) — Bangladesh&#39;s 2nd and 3rd generation EOD ROVs. Army-tested, UN-deployed. Motion control, BLDC sync, RS485 communication, custom PCBs.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/03_soinik_rov/";
            },},{id: "projects-ga-optimized-cascaded-pid-for-bldc-motor-synchronization-stm32-first-author-paper",
          title: 'GA-Optimized Cascaded PID for BLDC Motor Synchronization (STM32, First-Author Paper)',
          description: "Genetic Algorithm-tuned cascaded PID on STM32 for precise real-time synchronization of BLDC motors in differential-drive platforms. First-author paper under review.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/04_ga_pid/";
            },},{id: "projects-vision-guided-target-tracking-surveillance-drone-yolov11n-on-raspberry-pi-5-pixhawk",
          title: 'Vision-Guided Target-Tracking Surveillance Drone (YOLOv11n on Raspberry Pi 5 + Pixhawk)',
          description: "ML-based real-time target tracking on a surveillance hexacopter. YOLOv11n on Raspberry Pi 5, Pixhawk 2.4.8, MAVLink. 1000 ft, 15 km range, three payload variants.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/05_sd15n/";
            },},{id: "projects-heavy-lift-cargo-drone-50-kg-payload-30-min-endurance-15-km-comms",
          title: 'Heavy-Lift Cargo Drone (50 kg payload, 30 min endurance, 15 km comms)',
          description: "Multirotor cargo drone for logistics and emergency response. 50 kg payload, 30 min flight, 15 km comms range, 1.5:1 T/W ratio.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/06_cargo_drone/";
            },},{id: "projects-hybrid-vtol-quad-plane-multirotor-hover-fixed-wing-cruise",
          title: 'Hybrid VTOL Quad-Plane — Multirotor Hover + Fixed-Wing Cruise',
          description: "First-generation VTOL quad-plane prototype for heavy-lift and long-duration surveillance. Maiden flight validated core design.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/07_vtol/";
            },},{id: "projects-industrial-corexy-3d-printer-510-510-550-mm-0-02-mm-repeatability",
          title: 'Industrial CoreXY 3D Printer — 510 × 510 × 550 mm, ±0.02 mm...',
          description: "Large-format industrial 3D printer built from scratch. CoreXY kinematics, 510×510×550 mm build volume, ±0.02 mm repeatability, Marlin 2.0.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/08_titan550/";
            },},{id: "projects-tele-operated-rov-6-dof-manipulator-cofdm-multi-camera-teleoperation",
          title: 'Tele-Operated ROV — 6-DOF Manipulator + COFDM Multi-Camera Teleoperation',
          description: "Next-generation ROV with 6-DOF arm (20 kg @ 5 km/h), six IP cameras, 1.4 GHz COFDM 1 km video link, HCU/OCU dual control.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/09_advanced_rov_cofdm/";
            },},{id: "projects-α-graphyne-nanoribbon-fet-ballistic-transport-modeling-micromachines-2023",
          title: 'α-Graphyne Nanoribbon FET — Ballistic Transport Modeling (Micromachines 2023)',
          description: "Modeled ballistic quantum transport in α-graphyne nanoribbons. Quantified I–V behavior and subthreshold slope. Published in Micromachines (MDPI), 2023.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/10_graphyne/";
            },},{id: "projects-vehicle-detection-amp-speed-estimation-from-traffic-footage-yolov2-matlab",
          title: 'Vehicle Detection &amp;amp; Speed Estimation from Traffic Footage (YOLOv2 + MATLAB)',
          description: "Trained a YOLOv2 detector on a self-curated vehicle dataset and built a frame-by-frame tracking layer to estimate real-world vehicle speeds from monocular traffic video. BUET EEE coursework.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/11_yolov2_traffic/";
            },},{id: "projects-6-dof-robotic-arm-stepper-driven-with-3d-printed-planetary-gearboxes",
          title: '6-DOF Robotic Arm — Stepper-Driven with 3D-Printed Planetary Gearboxes',
          description: "Six-degree-of-freedom serial robotic arm — SolidWorks frame, body fabricated on a hobby 3D printer I built in parallel, stepper-motor actuation through custom 3D-printed planetary gearboxes, Arduino-based control, and analytical inverse kinematics with closed-form algebraic solutions.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/12_6dof_arm/";
            },},{id: "projects-rv32i-multicycle-processor-with-wishbone-memory-controller-verilog-fpga-tsmc-180-nm",
          title: 'RV32I Multicycle Processor with Wishbone Memory Controller (Verilog · FPGA · TSMC 180...',
          description: "From-scratch RV32I multicycle processor in Verilog with a custom Wishbone-interfaced memory controller, full testbench-based verification, FPGA validation, and a TSMC 180 nm physical-design flow in Cadence. Supervised by Dr. A. B. M. Harun-Ur-Rashid (BUET EEE).",
          section: "Projects",handler: () => {
              window.location.href = "/projects/13_riscv/";
            },},{id: "projects-autonomous-gps-waypoint-delivery-drone-solidworks-arduino-imu-gps-pid",
          title: 'Autonomous GPS-Waypoint Delivery Drone (SolidWorks · Arduino · IMU + GPS · PID)...',
          description: "Quadcopter built end-to-end for autonomous waypoint-based parcel delivery — SolidWorks airframe, Arduino flight controller with IMU attitude stabilisation, GPS waypoint navigation, and a servo-actuated payload release. BUET EEE undergraduate build.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/14_gps_drone/";
            },},{id: "projects-solar-powered-remote-environmental-monitor-arduino-gsm-thingspeak-relay-switched-battery-bank",
          title: 'Solar-Powered Remote Environmental Monitor (Arduino · GSM · ThingSpeak · Relay-Switched Battery Bank)...',
          description: "Self-sustaining outdoor environmental node — Arduino UNO + GSM cellular uplink to ThingSpeak, powered by a solar-charged battery bank with a relay-switched series-on-discharge / parallel-on-charge topology to feed the GSM modem&#39;s high transient current. EEE 416 group project at BUET.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/15_env_monitor/";
            },},{id: "projects-hobby-3d-printer-designed-from-scratch-in-solidworks-laser-cut-acrylic-custom-marlin",
          title: 'Hobby 3D Printer — Designed from Scratch in SolidWorks, Laser-Cut Acrylic, Custom Marlin...',
          description: "A 3D printer designed from scratch as a personal hobby build during COVID-19 — SolidWorks for every component, laser-cut acrylic frame, Arduino Mega controller, 5x NEMA 17 stepper motors, and a customised Marlin firmware. Distinct from the later Titan 550 industrial product.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/16_hobby_3d_printer/";
            },},{id: "projects-regulated-dc-dc-boost-converter-schematic-amp-layout-in-tsmc-180-nm-cadence",
          title: 'Regulated DC-DC Boost Converter — Schematic &amp;amp; Layout in TSMC 180 nm (Cadence)...',
          description: "Designed and laid out a regulated DC-DC boost converter on TSMC 180 nm in Cadence — schematic capture, transistor-level simulation, and physical layout with parasitic extraction. VLSI coursework at BUET EEE.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/17_boost_converter/";
            },},{id: "projects-closed-loop-induction-motor-speed-control-v-f-svpwm-in-matlab-simulink",
          title: 'Closed-Loop Induction-Motor Speed Control — V/f + SVPWM in MATLAB Simulink',
          description: "3-phase induction motor closed-loop speed control via V/f (volts-per-hertz) scalar control with SVPWM (Space Vector PWM) inverter modulation. Full Simulink model with speed reference, flux/voltage scheduling, and PI compensation. BUET EEE coursework.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/18_induction_motor/";
            },},{id: "projects-optical-particle-concentration-detector-laser-light-scattering-with-webcam-readout",
          title: 'Optical Particle-Concentration Detector — Laser Light-Scattering with Webcam Readout',
          description: "Low-cost airborne-particle concentration sensor using laser illumination and a webcam-based intensity readout — measures the light scattered off particle–photon interaction. Built as a cost-conscious alternative to commercial particle counters. BUET EEE coursework.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/19_particle_detection/";
            },},{id: "projects-laboratory-variable-dc-power-supply-linear-regulator-bench-build",
          title: 'Laboratory Variable DC Power Supply — Linear-Regulator Bench Build',
          description: "Bench-grade variable DC power supply — linear-regulator architecture with adjustable output voltage, current limiting, and short-circuit protection. Built end-to-end including transformer secondary, rectification, filtering, regulation, and enclosure. BUET EEE coursework.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/20_dc_power_supply/";
            },},{id: "projects-optical-mark-recognition-omr-machine-built-entirely-from-discrete-digital-logic",
          title: 'Optical Mark Recognition (OMR) Machine — Built Entirely from Discrete Digital Logic',
          description: "Built an OMR (Optical Mark Recognition) machine for multiple-choice answer sheets using only discrete digital logic ICs — no microcontroller. Optical sensing, counters, and decoders implement the full mark-detection and tally pipeline. BUET EEE coursework.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/21_omr_machine/";
            },},{id: "projects-seven-storey-building-electrical-services-design",
          title: 'Seven-Storey Building Electrical Services Design',
          description: "Complete electrical-services design for a seven-storey residential building — load estimation, panel scheduling, conductor sizing, lighting and power layouts, and earthing scheme. BUET EEE coursework on building services engineering.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/22_building_electrical/";
            },},{id: "teachings-data-science-fundamentals",
          title: 'Data Science Fundamentals',
          description: "This course covers the foundational aspects of data science, including data collection, cleaning, analysis, and visualization. Students will learn practical skills for working with real-world datasets.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/data-science-fundamentals/";
            },},{id: "teachings-introduction-to-machine-learning",
          title: 'Introduction to Machine Learning',
          description: "This course provides an introduction to machine learning concepts, algorithms, and applications. Students will learn about supervised and unsupervised learning, model evaluation, and practical implementations.",
          section: "Teachings",handler: () => {
              window.location.href = "/teachings/introduction-to-machine-learning/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6D%6F%6E%69%72%75%6C%69%73%6C%61%6D.%61%63%61%64@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/Monirul305", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/monirul-islam-460001148", "_blank");
        },
      },{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/CV_Monirul_Islam.pdf", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
