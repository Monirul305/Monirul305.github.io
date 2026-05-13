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
          description: "Edit the `_data/repositories.yml` and change the `github_users` and `github_repos` lists to include your own GitHub profile and repositories.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-teaching",
          title: "teaching",
          description: "Course materials, schedules, and resources for classes taught.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/teaching/";
          },
        },{id: "nav-people",
          title: "people",
          description: "members of the lab or group",
          section: "Navigation",
          handler: () => {
            window.location.href = "/people/";
          },
        },{id: "dropdown-bookshelf",
              title: "bookshelf",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/books/";
              },
            },{id: "dropdown-blog",
              title: "blog",
              description: "",
              section: "Dropdown",
              handler: () => {
                window.location.href = "/blog/";
              },
            },{id: "post-a-post-with-plotly-js",
        
          title: "a post with plotly.js",
        
        description: "this is what included plotly.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/plotly/";
          
        },
      },{id: "post-a-post-with-image-galleries",
        
          title: "a post with image galleries",
        
        description: "this is what included image galleries could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/photo-gallery/";
          
        },
      },{id: "post-a-post-with-tabs",
        
          title: "a post with tabs",
        
        description: "this is what included tabs in a post could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/tabs/";
          
        },
      },{id: "post-a-post-with-typograms",
        
          title: "a post with typograms",
        
        description: "this is what included typograms code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/typograms/";
          
        },
      },{id: "post-a-post-that-can-be-cited",
        
          title: "a post that can be cited",
        
        description: "this is what a post that can be cited looks like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/post-citation/";
          
        },
      },{id: "post-a-post-with-pseudo-code",
        
          title: "a post with pseudo code",
        
        description: "this is what included pseudo code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/pseudocode/";
          
        },
      },{id: "post-a-post-with-code-diff",
        
          title: "a post with code diff",
        
        description: "this is how you can display code diffs",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/code-diff/";
          
        },
      },{id: "post-a-post-with-advanced-image-components",
        
          title: "a post with advanced image components",
        
        description: "this is what advanced image components could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/advanced-images/";
          
        },
      },{id: "post-a-post-with-vega-lite",
        
          title: "a post with vega lite",
        
        description: "this is what included vega lite code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/vega-lite/";
          
        },
      },{id: "post-a-post-with-geojson",
        
          title: "a post with geojson",
        
        description: "this is what included geojson code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/geojson-map/";
          
        },
      },{id: "post-a-post-with-echarts",
        
          title: "a post with echarts",
        
        description: "this is what included echarts code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/echarts/";
          
        },
      },{id: "post-a-post-with-chart-js",
        
          title: "a post with chart.js",
        
        description: "this is what included chart.js code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/chartjs/";
          
        },
      },{id: "post-a-post-with-tikzjax",
        
          title: "a post with TikZJax",
        
        description: "this is what included TikZ code could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/tikzjax/";
          
        },
      },{id: "post-a-post-with-bibliography",
        
          title: "a post with bibliography",
        
        description: "an example of a blog post with bibliography",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/post-bibliography/";
          
        },
      },{id: "post-a-post-with-jupyter-notebook",
        
          title: "a post with jupyter notebook",
        
        description: "an example of a blog post with jupyter notebook",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/jupyter-notebook/";
          
        },
      },{id: "post-a-post-with-custom-blockquotes",
        
          title: "a post with custom blockquotes",
        
        description: "an example of a blog post with custom blockquotes",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/custom-blockquotes/";
          
        },
      },{id: "post-a-post-with-table-of-contents-on-a-sidebar",
        
          title: "a post with table of contents on a sidebar",
        
        description: "an example of a blog post with table of contents on a sidebar",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/sidebar-table-of-contents/";
          
        },
      },{id: "post-a-post-with-audios",
        
          title: "a post with audios",
        
        description: "this is what included audios could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/audios/";
          
        },
      },{id: "post-a-post-with-videos",
        
          title: "a post with videos",
        
        description: "this is what included videos could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/videos/";
          
        },
      },{id: "post-displaying-beautiful-tables-with-bootstrap-tables",
        
          title: "displaying beautiful tables with Bootstrap Tables",
        
        description: "an example of how to use Bootstrap Tables",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/tables/";
          
        },
      },{id: "post-a-post-with-table-of-contents",
        
          title: "a post with table of contents",
        
        description: "an example of a blog post with table of contents",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2023/table-of-contents/";
          
        },
      },{id: "post-a-post-with-giscus-comments",
        
          title: "a post with giscus comments",
        
        description: "an example of a blog post with giscus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2022/giscus-comments/";
          
        },
      },{id: "post-a-post-with-redirect",
        
          title: "a post with redirect",
        
        description: "you can also redirect to assets like pdf",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/assets/pdf/example_pdf.pdf";
          
        },
      },{id: "post-a-post-with-diagrams",
        
          title: "a post with diagrams",
        
        description: "an example of a blog post with diagrams",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/diagrams/";
          
        },
      },{id: "post-a-distill-style-blog-post",
        
          title: "a distill-style blog post",
        
        description: "an example of a distill-style blog post and main elements",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2021/distill/";
          
        },
      },{id: "post-a-post-with-twitter",
        
          title: "a post with twitter",
        
        description: "an example of a blog post with twitter",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2020/twitter/";
          
        },
      },{id: "post-a-post-with-disqus-comments",
        
          title: "a post with disqus comments",
        
        description: "an example of a blog post with disqus comments",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/disqus-comments/";
          
        },
      },{id: "post-a-post-with-math",
        
          title: "a post with math",
        
        description: "an example of a blog post with some math",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/math/";
          
        },
      },{id: "post-a-post-with-code",
        
          title: "a post with code",
        
        description: "an example of a blog post with some code",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/code/";
          
        },
      },{id: "post-a-post-with-images",
        
          title: "a post with images",
        
        description: "this is what included images could look like",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/images/";
          
        },
      },{id: "post-a-post-with-formatting-and-links",
        
          title: "a post with formatting and links",
        
        description: "march &amp; april, looking forward to summer",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2015/formatting-and-links/";
          
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
          section: "News",},{id: "projects-3-robot-agv-fleet-the-urmi-group",
          title: '3-Robot AGV Fleet — The Urmi Group',
          description: "Production-deployed autonomous guided vehicle fleet navigating a live garment factory alongside hundreds of workers. ROS 2, AprilTag EKF, distributed path planning, FleetCore coordinator.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/01_agv_fleet/";
            },},{id: "projects-hybrid-mobile-manipulator-ros-2-closed-form-ik",
          title: 'Hybrid Mobile Manipulator — ROS 2, Closed-Form IK',
          description: "Full real-time control stack for a 6-DOF arm + tracked base. Custom closed-form analytical IK replacing MoveIt&#39;s KDL solver. Singularity-aware smooth scaling, FK-anchored accumulator, 40-test unit suite.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/02_manipulator/";
            },},{id: "projects-soinik-rov-family-bangladesh-eod-robots",
          title: 'Soinik ROV Family — Bangladesh EOD Robots',
          description: "Smart Soinik 1.0 (SS1.0) and Jontro Soinik 1.0 (JS1.0) — Bangladesh&#39;s 2nd and 3rd generation EOD ROVs. Army-tested, UN-deployed. Motion control, BLDC sync, RS485 communication, custom PCBs.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/03_soinik_rov/";
            },},{id: "projects-ga-optimized-cascaded-pid-for-bldc-synchronization",
          title: 'GA-Optimized Cascaded PID for BLDC Synchronization',
          description: "Genetic Algorithm-tuned cascaded PID on STM32 for precise real-time synchronization of BLDC motors in differential-drive platforms. First-author paper under review.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/04_ga_pid/";
            },},{id: "projects-sd15-n-autonomous-target-tracking-drone",
          title: 'SD15-N Autonomous Target-Tracking Drone',
          description: "ML-based real-time target tracking on a surveillance hexacopter. YOLOv11n on Raspberry Pi 5, Pixhawk 2.4.8, MAVLink. 1000 ft, 15 km range, three payload variants.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/05_sd15n/";
            },},{id: "projects-heavy-lift-cargo-drone-50-kg-payload",
          title: 'Heavy-Lift Cargo Drone (50 kg payload)',
          description: "Multirotor cargo drone for logistics and emergency response. 50 kg payload, 30 min flight, 15 km comms range, 1.5:1 T/W ratio.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/06_cargo_drone/";
            },},{id: "projects-vtol-quad-plane-maiden-flight-successful",
          title: 'VTOL Quad-Plane — Maiden Flight Successful',
          description: "First-generation VTOL quad-plane prototype for heavy-lift and long-duration surveillance. Maiden flight validated core design.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/07_vtol/";
            },},{id: "projects-cybermaker-titan550-pro-industrial-3d-printer",
          title: 'CyberMaker Titan550 Pro — Industrial 3D Printer',
          description: "Large-format industrial 3D printer built from scratch. CoreXY kinematics, 510×510×550 mm build volume, ±0.02 mm repeatability, Marlin 2.0.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/08_titan550/";
            },},{id: "projects-advanced-rov-6-dof-arm-amp-cofdm-multi-camera",
          title: 'Advanced ROV — 6-DOF Arm &amp;amp; COFDM Multi-Camera',
          description: "Next-generation ROV with 6-DOF arm (20 kg @ 5 km/h), six IP cameras, 1.4 GHz COFDM 1 km video link, HCU/OCU dual control.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/09_advanced_rov_cofdm/";
            },},{id: "projects-α-graphyne-nanoribbon-fet-modeling",
          title: 'α-Graphyne Nanoribbon FET Modeling',
          description: "Modeled ballistic quantum transport in α-graphyne nanoribbons. Quantified I–V behavior and subthreshold slope. Published in Micromachines (MDPI), 2023.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/10_graphyne/";
            },},{id: "projects-traffic-speed-estimation-via-yolov2",
          title: 'Traffic Speed Estimation via YOLOv2',
          description: "Generated a large vehicle detection dataset and trained YOLOv2 in MATLAB to detect vehicles and estimate speeds from traffic footage.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/11_yolov2_traffic/";
            },},{id: "projects-6-dof-robotic-arm-design-fabrication-amp-control",
          title: '6-DOF Robotic Arm — Design, Fabrication &amp;amp; Control',
          description: "Designed in SolidWorks, fabricated via 3D printing, controlled with PID and inverse kinematics for precise end-effector positioning.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/12_6dof_arm/";
            },},{id: "projects-risc-v-processor-with-wishbone-interface-tsmc-180-nm",
          title: 'RISC-V Processor with Wishbone Interface (TSMC 180 nm)',
          description: "Designed a RISC-V processor core in Verilog using Cadence tools. Verified on FPGA and evaluated in a TSMC 180 nm implementation flow.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/13_riscv/";
            },},{id: "projects-autonomous-gps-drone-delivery-system",
          title: 'Autonomous GPS Drone Delivery System',
          description: "Designed airframe in SolidWorks, implemented PID attitude control, GPS waypoint navigation, and a payload deployment mechanism.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/14_gps_drone/";
            },},{id: "projects-self-sustaining-environmental-monitor-solar-gsm",
          title: 'Self-Sustaining Environmental Monitor (Solar + GSM)',
          description: "Self-powered remote monitoring node: Arduino + solar + GSM, transmitting temperature, humidity, CO₂ over cellular. Custom PCB.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/15_env_monitor/";
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
