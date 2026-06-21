"use client";

import { useEffect, useMemo, useState } from "react";
import { getAnswerKitAssetPaths, getCountrySpecificShirtCandidates } from "@/lib/nationKitAssets";
import type { Player } from "@/lib/types";

type AnswerKitGraphicProps = {
  player: Player;
  showPrint?: boolean;
  showCaption?: boolean;
};

export default function AnswerKitGraphic({ player, showPrint = true, showCaption = true }: AnswerKitGraphicProps) {
  const { shirtSrc, shortsSrc } = getAnswerKitAssetPaths(player);
  const shirtCandidates = useMemo(
    () => [...getCountrySpecificShirtCandidates(player), shirtSrc],
    [player, shirtSrc]
  );
  const [shirtCandidateIndex, setShirtCandidateIndex] = useState(0);

  useEffect(() => {
    setShirtCandidateIndex(0);
  }, [player.id, shirtSrc]);

  const activeShirtSrc = shirtCandidates[Math.min(shirtCandidateIndex, shirtCandidates.length - 1)];

  function handleShirtError() {
    setShirtCandidateIndex((current) => {
      if (current >= shirtCandidates.length - 1) {
        return current;
      }

      return current + 1;
    });
  }

  return (
    <figure className="answer-kit-figure" aria-label={`${player.nation} generic kit reveal`}>
      <div className="answer-kit-stack">
        <div className="answer-shirt-wrap">
          <img className="answer-shirt-img" src={activeShirtSrc} alt="" onError={handleShirtError} />
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
