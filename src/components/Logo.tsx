import logo from "@/assets/agriprice-logo.png";

export function Logo({
  className = "h-9 w-auto",
  invert = false,
  showWordmark = true,
}: {
  className?: string;
  invert?: boolean;
  showWordmark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${invert ? "text-background" : "text-primary"}`}>
      <img
        src={logo}
        alt="AgriPrice"
        className={className}
        style={invert ? { filter: "brightness(0) invert(1)" } : undefined}
        width={2000}
        height={2000}
      />
      {showWordmark && (
        <span className="font-display text-lg font-semibold tracking-tight">AgriPrice</span>
      )}
    </span>
  );
}