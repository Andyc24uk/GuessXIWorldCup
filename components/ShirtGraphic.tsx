import { getKitConfigForPlayer, type NationKitConfig } from "@/lib/kits";
import type { Player } from "@/lib/types";

type ShirtGraphicProps = {
  player: Player;
  showNumber: boolean;
  showName: boolean;
  view: "front" | "back";
};

export default function ShirtGraphic({ player, showNumber, showName, view }: ShirtGraphicProps) {
  const kit = getKitConfigForPlayer(player);
  const uniqueId = `kit-${player.id}-${view}`;

  return (
    <figure className="shirt-figure" aria-label={`Generic ${kit.nation} home-colour shirt, ${view} view`}>
      <svg className="shirt-svg" viewBox="0 0 360 430" role="img" aria-hidden="true">
        <defs>
          <clipPath id={`${uniqueId}-shirt-clip`}>
            <path d="M119 54 L151 30 H209 L241 54 L323 103 L289 171 L252 154 L252 386 H108 L108 154 L71 171 L37 103 Z" />
          </clipPath>
          <linearGradient id={`${uniqueId}-fabric`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="42%" stopColor="#ffffff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.16" />
          </linearGradient>
          <radialGradient id={`${uniqueId}-spotlight`} cx="42%" cy="18%" r="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
            <stop offset="65%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="shirt-shadow">
          <path d="M119 54 L151 30 H209 L241 54 L323 103 L289 171 L252 154 L252 386 H108 L108 154 L71 171 L37 103 Z" />
        </g>

        <g clipPath={`url(#${uniqueId}-shirt-clip)`}>
          <rect width="360" height="430" fill={kit.baseColor} />
          <KitPattern kit={kit} idPrefix={uniqueId} />
          <rect width="360" height="430" fill={`url(#${uniqueId}-fabric)`} />
          <rect width="360" height="430" fill={`url(#${uniqueId}-spotlight)`} />
          <FabricLines />
        </g>

        <path
          className="shirt-outline"
          d="M119 54 L151 30 H209 L241 54 L323 103 L289 171 L252 154 L252 386 H108 L108 154 L71 171 L37 103 Z"
        />
        <ShoulderSeams color={kit.accentColor} />
        <Trim kit={kit} />
        <Collar kit={kit} />

        {view === "back" ? (
          <g className="shirt-back-print" fill={getPrintColor(kit)}>
            {showName ? (
              <text className="shirt-player-name" x="180" y="139">
                {player.displayName.toUpperCase()}
              </text>
            ) : null}
            {showNumber ? (
              <text className="shirt-player-number" x="180" y={showName ? 249 : 232}>
                {player.shirtNumber}
              </text>
            ) : (
              <text className="shirt-player-number hidden-print" x="180" y="232">
                ?
              </text>
            )}
          </g>
        ) : null}
      </svg>
      <figcaption className="shirt-view-label">{view === "front" ? "Front view" : "Back view"}</figcaption>
    </figure>
  );
}

function KitPattern({ kit, idPrefix }: { kit: NationKitConfig; idPrefix: string }) {
  switch (kit.patternType) {
    case "vertical-stripes":
      return (
        <g opacity="0.92">
          <rect x="85" y="0" width="42" height="430" fill={kit.secondaryColor} />
          <rect x="168" y="0" width="42" height="430" fill={kit.secondaryColor} />
          <rect x="251" y="0" width="42" height="430" fill={kit.secondaryColor} />
        </g>
      );
    case "center-stripe":
      return (
        <g opacity="0.9">
          <rect x="155" y="0" width="50" height="430" fill={kit.secondaryColor} />
          <rect x="169" y="0" width="22" height="430" fill={kit.accentColor} opacity="0.72" />
        </g>
      );
    case "side-panels":
      return (
        <g opacity="0.9">
          <path d="M76 54 H128 C112 118 111 250 121 386 H84 L84 154 L55 168 L28 103 Z" fill={kit.secondaryColor} />
          <path d="M284 54 H232 C248 118 249 250 239 386 H276 L276 154 L305 168 L332 103 Z" fill={kit.secondaryColor} />
        </g>
      );
    case "sleeve-trim":
      return (
        <g opacity="0.95">
          <path d="M37 103 L119 54 L108 154 L71 171 Z" fill={kit.secondaryColor} />
          <path d="M323 103 L241 54 L252 154 L289 171 Z" fill={kit.secondaryColor} />
        </g>
      );
    case "chest-band":
      return (
        <g opacity="0.92">
          <rect x="76" y="138" width="208" height="54" rx="8" fill={kit.secondaryColor} />
          <rect x="76" y="180" width="208" height="14" fill={kit.accentColor} opacity="0.8" />
        </g>
      );
    case "subtle-gradient":
      return (
        <g>
          <defs>
            <linearGradient id={`${idPrefix}-subtle-gradient`} x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor={kit.baseColor} />
              <stop offset="58%" stopColor={kit.baseColor} />
              <stop offset="100%" stopColor={kit.secondaryColor} stopOpacity="0.52" />
            </linearGradient>
          </defs>
          <rect width="360" height="430" fill={`url(#${idPrefix}-subtle-gradient)`} />
        </g>
      );
    case "plain":
    default:
      return null;
  }
}

function Collar({ kit }: { kit: NationKitConfig }) {
  if (kit.collarType === "v-neck") {
    return (
      <g>
        <path d="M145 32 H215 L180 91 Z" fill="rgba(0,0,0,0.32)" />
        <path d="M151 32 L180 82 L209 32" fill="none" stroke={kit.accentColor} strokeLinecap="round" strokeWidth="9" />
      </g>
    );
  }

  if (kit.collarType === "foldover") {
    return (
      <g>
        <path d="M145 32 H215 V66 C205 84 155 84 145 66 Z" fill="rgba(0,0,0,0.24)" />
        <path d="M145 32 H215 M149 38 L172 75 M211 38 L188 75" fill="none" stroke={kit.accentColor} strokeLinecap="round" strokeWidth="7" />
      </g>
    );
  }

  return (
    <g>
      <path d="M145 32 H215 V61 C207 82 153 82 145 61 Z" fill="rgba(0,0,0,0.28)" />
      <path d="M146 33 H214" stroke={kit.accentColor} strokeLinecap="round" strokeWidth="10" />
      <path d="M154 62 C168 75 192 75 206 62" fill="none" stroke={kit.accentColor} strokeLinecap="round" strokeWidth="6" />
    </g>
  );
}

function Trim({ kit }: { kit: NationKitConfig }) {
  const strokeWidth = kit.trimStyle === "minimal" ? 5 : 8;

  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {(kit.trimStyle === "sleeve-cuffs" || kit.trimStyle === "collar-and-cuffs") ? (
        <>
          <path d="M55 148 L78 166" stroke={kit.accentColor} strokeWidth={strokeWidth} />
          <path d="M305 148 L282 166" stroke={kit.accentColor} strokeWidth={strokeWidth} />
        </>
      ) : null}
      {kit.trimStyle === "shoulder-lines" ? (
        <>
          <path d="M109 66 L71 103" stroke={kit.secondaryColor} strokeWidth="8" opacity="0.92" />
          <path d="M251 66 L289 103" stroke={kit.secondaryColor} strokeWidth="8" opacity="0.92" />
          <path d="M119 74 L82 110" stroke={kit.accentColor} strokeWidth="4" opacity="0.86" />
          <path d="M241 74 L278 110" stroke={kit.accentColor} strokeWidth="4" opacity="0.86" />
        </>
      ) : null}
      {kit.trimStyle === "minimal" ? (
        <path d="M111 384 H249" stroke={kit.accentColor} strokeWidth="4" opacity="0.56" />
      ) : null}
    </g>
  );
}

function ShoulderSeams({ color }: { color: string }) {
  return (
    <g fill="none" stroke={color} strokeLinecap="round" strokeWidth="3" opacity="0.5">
      <path d="M118 58 C134 83 145 108 150 139" />
      <path d="M242 58 C226 83 215 108 210 139" />
    </g>
  );
}

function FabricLines() {
  return (
    <g stroke="#ffffff" strokeWidth="1" opacity="0.13">
      {Array.from({ length: 9 }, (_, index) => (
        <path d={`M${88 + index * 22} 84 C${78 + index * 24} 166 ${88 + index * 17} 270 ${86 + index * 23} 386`} key={index} fill="none" />
      ))}
    </g>
  );
}

function getPrintColor(kit: NationKitConfig): string {
  const darkBaseNations = ["France", "Portugal", "Netherlands", "Mexico", "Japan", "South Korea", "Canada", "Belgium"];
  return darkBaseNations.includes(kit.nation) ? "#ffffff" : kit.secondaryColor;
}
