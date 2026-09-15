"use client";

export default function TopographyBackground() {
  return (
    <svg
      className="w-full h-full object-cover pointer-events-none select-none opacity-80"
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="topo-fade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1b4c78" stopOpacity="0.22" />
          <stop offset="50%" stopColor="#3f6aa6" stopOpacity="0.14" />
          <stop offset="100%" stopColor="#7cb8e8" stopOpacity="0.18" />
        </linearGradient>

        <linearGradient id="topo-index" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1b4c78" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#2e5189" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      {/* Cluster 1: Top-Left Elevation Ridges */}
      <g stroke="url(#topo-fade)" strokeWidth="1" strokeLinecap="round">
        <path d="M-80 120 C 140 80, 260 220, 380 160 C 500 100, 480 -60, 620 -80" />
        <path d="M-60 180 C 160 140, 290 280, 420 220 C 540 160, 530 -20, 680 -40" />
        <path d="M-40 240 C 180 200, 320 340, 460 280 C 580 220, 580 20, 740 0" stroke="url(#topo-index)" strokeWidth="1.5" />
        <path d="M-20 300 C 200 260, 350 400, 500 340 C 620 280, 630 60, 800 40" />
        <path d="M 0 360 C 220 320, 380 460, 540 400 C 660 340, 680 100, 860 80" />
        <path d="M 20 420 C 240 380, 410 520, 580 460 C 700 400, 730 140, 920 120" stroke="url(#topo-index)" strokeWidth="1.5" />
        <path d="M 40 480 C 260 440, 440 580, 620 520 C 740 460, 780 180, 980 160" />
      </g>

      {/* Cluster 2: Center-Right Concentric Plateau Formations */}
      <g stroke="url(#topo-fade)" strokeWidth="1" strokeLinecap="round">
        {/* Outermost ring */}
        <path d="M 720 320 C 880 240, 1140 260, 1260 380 C 1380 500, 1340 680, 1200 760 C 1060 840, 840 800, 740 680 C 640 560, 620 380, 720 320 Z" stroke="url(#topo-index)" strokeWidth="1.5" />
        {/* Ring 2 */}
        <path d="M 770 360 C 900 300, 1100 310, 1200 400 C 1300 500, 1270 640, 1160 700 C 1040 760, 870 740, 790 640 C 710 540, 690 400, 770 360 Z" />
        {/* Ring 3 */}
        <path d="M 820 400 C 930 350, 1070 360, 1140 430 C 1220 500, 1200 600, 1110 650 C 1020 700, 890 680, 830 600 C 770 520, 750 430, 820 400 Z" />
        {/* Ring 4 (Peak) */}
        <path d="M 870 440 C 950 400, 1030 400, 1080 450 C 1140 500, 1120 570, 1060 600 C 990 640, 910 620, 870 560 C 830 500, 820 460, 870 440 Z" stroke="url(#topo-index)" strokeWidth="1.5" />
        {/* Summit center */}
        <path d="M 920 475 C 970 450, 1010 460, 1035 485 C 1060 515, 1050 545, 1015 565 C 975 585, 935 570, 915 540 C 895 510, 895 490, 920 475 Z" />
      </g>

      {/* Cluster 3: Bottom Sweeping Cartographic Fault Lines */}
      <g stroke="url(#topo-fade)" strokeWidth="1" strokeLinecap="round">
        <path d="M 220 980 C 440 780, 660 840, 880 720 C 1080 600, 1260 620, 1500 520" />
        <path d="M 160 1020 C 390 830, 620 890, 840 770 C 1040 650, 1220 670, 1520 580" stroke="url(#topo-index)" strokeWidth="1.5" />
        <path d="M 100 1060 C 340 880, 580 940, 800 820 C 1000 700, 1180 720, 1540 640" />
        <path d="M 40 1100 C 290 930, 540 990, 760 870 C 960 750, 1140 770, 1560 700" />
      </g>

      {/* Cluster 4: Deep Sinuous River valley contours */}
      <g stroke="url(#topo-fade)" strokeWidth="0.8" strokeDasharray="6 4">
        <path d="M 460 -40 C 420 180, 540 320, 480 520 C 420 720, 240 820, 280 1040" />
        <path d="M 520 -40 C 480 180, 600 320, 540 520 C 480 720, 300 820, 340 1040" />
      </g>

      {/* Cluster 5: Ambient fine elevation loops in corners */}
      <g stroke="url(#topo-fade)" strokeWidth="0.9">
        <path d="M 1100 -60 C 1220 60, 1340 80, 1480 20" />
        <path d="M 1060 -20 C 1190 100, 1320 120, 1500 60" stroke="url(#topo-index)" strokeWidth="1.5" />
        <path d="M 1020 20 C 1160 140, 1300 160, 1520 100" />
        <path d="M 980 60 C 1130 180, 1280 200, 1540 140" />
        <path d="M 940 100 C 1100 220, 1260 240, 1560 180" />
      </g>
    </svg>
  );
}
