export default function BottomNav() {
  return (
    <nav className="fixed bottom-6 left-6 right-6 z-40">
      <div className="bg-surface-dark/95 rounded-full px-6 py-2 flex justify-between items-center">
        {["home", "favorite", "add", "chat_bubble", "person"].map((icon) => (
          <button key={icon} className="w-12 h-12 flex items-center justify-center">
            <span className="material-symbols-outlined">{icon}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
