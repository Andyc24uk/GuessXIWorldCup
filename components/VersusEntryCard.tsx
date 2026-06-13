"use client";

import Link from "next/link";

export default function VersusEntryCard() {
  return (
    <Link aria-label="Start Versus Mode challenge" className="versus-entry-card" href="/versus">
      <div className="versus-shirt-row" aria-hidden="true">
        <img alt="" className="versus-shirt-thumb" src="/kits/shirt-placeholder-question.png" />
        <span className="versus-badge">VS</span>
        <img alt="" className="versus-shirt-thumb" src="/kits/shirt-placeholder-question.png" />
      </div>
      <strong>VERSUS MODE</strong>
      <span>Challenge your friends!</span>
    </Link>
  );
}
