import { getAnswerKitAssetPaths } from "@/lib/nationKitAssets";
import type { Player } from "@/lib/types";

type AnswerKitGraphicProps = {
  player: Player;
  showPrint?: boolean;
  showCaption?: boolean;
};

export default function AnswerKitGraphic({ player, showPrint = true, showCaption = true }: AnswerKitGraphicProps) {
  const { shirtSrc, shortsSrc } = getAnswerKitAssetPaths(player);

  return (
    <figure className="answer-kit-figure" aria-label={`${player.nation} generic kit reveal`}>
      <div className="answer-kit-stack">
        <div className="answer-shirt-wrap">
          <img className="answer-shirt-img" src={shirtSrc} alt="" />
          {showPrint ? (
            <div className="answer-shirt-print" aria-hidden="true">
              <span>{player.displayName.toUpperCase()}</span>
              <strong>{player.shirtNumber || "?"}</strong>
            </div>
          ) : null}
        </div>
        <img className="answer-shorts-img" src={shortsSrc} alt="" />
      </div>
      {showCaption ? <figcaption className="shirt-view-label">Kit reveal</figcaption> : null}
    </figure>
  );
}
