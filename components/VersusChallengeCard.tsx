"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { trackVersusShareClicked, trackVersusStarted } from "@/lib/analytics";
import { createVersusChallengeId, getVersusChallengeUrl } from "@/lib/versus";

type VersusChallengeCardProps = {
  baseUrl?: string;
};

export default function VersusChallengeCard({ baseUrl = "https://guessxi.app" }: VersusChallengeCardProps) {
  const [challengeId, setChallengeId] = useState("");
  const [resolvedBaseUrl, setResolvedBaseUrl] = useState(baseUrl);
  const [shareState, setShareState] = useState<"idle" | "copied" | "failed">("idle");

  useEffect(() => {
    const nextChallengeId = createVersusChallengeId();
    setChallengeId(nextChallengeId);
    trackVersusStarted({
      challengeId: nextChallengeId
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setResolvedBaseUrl(window.location.origin);
    }
  }, []);

  const challengeUrl = useMemo(
    () => (challengeId ? getVersusChallengeUrl(challengeId, resolvedBaseUrl) : ""),
    [challengeId, resolvedBaseUrl]
  );

  async function shareChallenge() {
    if (!challengeUrl) {
      return;
    }

    try {
      let usedNativeShare = false;
      if (navigator.share) {
        await navigator.share({
          text: `Can you beat me in Guess XI Versus Mode?\n${challengeUrl}`,
          url: challengeUrl
        });
        usedNativeShare = true;
      } else {
        await navigator.clipboard.writeText(challengeUrl);
      }

      trackVersusShareClicked({
        challengeId
      });
      setShareState(usedNativeShare ? "idle" : "copied");
    } catch {
      setShareState("failed");
    }
  }

  return (
    <section className="game-card versus-setup-card" aria-label="Versus Mode challenge">
      <div className="versus-share-panel">
        <p className="eyebrow">Challenge your friends</p>
        <h2>Versus Mode</h2>
        <p className="subtitle">Share one challenge link or QR code. Everyone who opens it gets the same player.</p>
        <div className="versus-link-box">
          <span>Challenge link</span>
          <strong>{challengeUrl || "Generating challenge..."}</strong>
        </div>
        <div className="actions-row">
          <button className="primary-button" disabled={!challengeUrl} onClick={shareChallenge} type="button">
            {shareState === "copied" ? "Challenge link copied!" : shareState === "failed" ? "Share unavailable" : "Share Challenge"}
          </button>
          <a className="secondary-button link-button" href={challengeUrl || "#"}>
            Play Challenge
          </a>
        </div>
      </div>

      <div className="versus-qr-panel">
        <div className="versus-qr-frame" aria-label="Challenge QR code">
          {challengeUrl ? <QRCodeSVG bgColor="#ffffff" fgColor="#10231d" size={220} value={challengeUrl} /> : null}
        </div>
      </div>
    </section>
  );
}
