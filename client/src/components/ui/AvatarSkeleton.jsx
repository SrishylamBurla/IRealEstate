export default function AvatarSkeleton({ size = 64 }) {
  return (
    <div
      className="animate-pulse rounded-full bg-gray-200"
      style={{
        width: size,
        height: size,
      }}
    />
  );
}
