export default function SvgChromeFilters() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute pointer-events-none">
      <defs>
        <filter id="chrome-lg" x="-15%" y="-35%" width="130%" height="170%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="bump" />
          <feSpecularLighting in="bump" surfaceScale="8" specularConstant="0.05" specularExponent="26" lightingColor="#ffffff" result="key">
            <feDistantLight azimuth="300" elevation="48" />
          </feSpecularLighting>
          <feComposite in="key" in2="SourceAlpha" operator="in" result="keyClip" />
          <feSpecularLighting in="bump" surfaceScale="8" specularConstant="0.2" specularExponent="18" lightingColor="#cfe2ff" result="fill">
            <feDistantLight azimuth="70" elevation="26" />
          </feSpecularLighting>
          <feComposite in="fill" in2="SourceAlpha" operator="in" result="fillClip" />
          <feSpecularLighting in="bump" surfaceScale="8" specularConstant="1" specularExponent="26" lightingColor="#ffffff" result="geom">
            <feDistantLight azimuth="300" elevation="48" />
          </feSpecularLighting>
          <feComposite in="geom" in2="SourceAlpha" operator="in" result="geomClip" />
          <feFlood floodColor="#030712" result="inkColor" />
          <feComposite in="inkColor" in2="geomClip" operator="in" result="inkShape" />
          <feComponentTransfer in="inkShape" result="inkGlint">
            <feFuncA type="linear" slope="0.1" intercept="0" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="fillClip" />
            <feMergeNode in="keyClip" />
            <feMergeNode in="inkGlint" />
          </feMerge>
        </filter>

        <filter id="chrome-md" x="-15%" y="-35%" width="130%" height="170%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="bump" />
          <feSpecularLighting in="bump" surfaceScale="5" specularConstant="0.05" specularExponent="24" lightingColor="#ffffff" result="key">
            <feDistantLight azimuth="300" elevation="48" />
          </feSpecularLighting>
          <feComposite in="key" in2="SourceAlpha" operator="in" result="keyClip" />
          <feSpecularLighting in="bump" surfaceScale="5" specularConstant="0.2" specularExponent="16" lightingColor="#cfe2ff" result="fill">
            <feDistantLight azimuth="70" elevation="26" />
          </feSpecularLighting>
          <feComposite in="fill" in2="SourceAlpha" operator="in" result="fillClip" />
          <feSpecularLighting in="bump" surfaceScale="5" specularConstant="1" specularExponent="24" lightingColor="#ffffff" result="geom">
            <feDistantLight azimuth="300" elevation="48" />
          </feSpecularLighting>
          <feComposite in="geom" in2="SourceAlpha" operator="in" result="geomClip" />
          <feFlood floodColor="#030712" result="inkColor" />
          <feComposite in="inkColor" in2="geomClip" operator="in" result="inkShape" />
          <feComponentTransfer in="inkShape" result="inkGlint">
            <feFuncA type="linear" slope="0.1" intercept="0" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="fillClip" />
            <feMergeNode in="keyClip" />
            <feMergeNode in="inkGlint" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
