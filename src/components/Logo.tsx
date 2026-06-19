import logo from "@/assets/agriprice-logo.png";

export function Logo({
  className = "h-9 w-auto",
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <img
      src={logo}
      alt="AgriPrice"
      className={className}
      style={invert ? { filter: "brightness(0) invert(1)" } : undefined}
      width={2000}
      height={2000}
    />
  );
}