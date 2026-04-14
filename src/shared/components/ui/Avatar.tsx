export interface AvatarProps {
  src?: string | null;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-xs", lg: "h-12 w-12 text-sm" };

export default function Avatar({ src, alt = "Avatar", initials, size = "md" }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizes[size]} rounded-full object-cover border border-outline-variant/30`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant font-semibold`}
    >
      {initials || "?"}
    </div>
  );
}
