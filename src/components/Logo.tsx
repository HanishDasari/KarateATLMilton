import { useState } from "react";

/**
 * Site logo.
 *
 * Drop the real logo file in at:  public/logo.png   (or .svg/.webp — update the
 * `src` below to match). It will then appear in the header, footer, and favicon.
 * Until that file exists, this gracefully falls back to the "K" badge so nothing
 * looks broken.
 */
export default function Logo({
  className = "h-12 w-auto",
  badgeClassName = "w-12 h-12",
}: {
  className?: string;
  badgeClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`${badgeClassName} rounded-lg bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shrink-0`}
      >
        <span className="text-white font-bold text-xl">K</span>
      </div>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="Karate Atlanta Milton logo"
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
