const categories = [
  { label: "Buy", icon: "real_estate_agent", color: "primary" },
  { label: "Rent", icon: "key", color: "orange" },
  { label: "PG / Co-live", icon: "apartment", color: "purple" },
  { label: "Commercial", icon: "storefront", color: "blue" },
];

export default function Categories() {
  return (
    <section>
      <h3 className="text-xl font-bold mb-4">Categories</h3>
      <div className="grid grid-cols-4 gap-4">
        {categories.map((c) => (
          <div key={c.label} className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">{c.icon}</span>
            </div>
            <span className="text-xs">{c.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
