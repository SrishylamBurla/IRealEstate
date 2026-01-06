export default function SearchBar() {
  return (
    <section className="flex flex-col gap-4">
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input
          className="w-full pl-12 pr-12 py-4 rounded-full bg-white dark:bg-surface-dark ring-1 ring-white/10 focus:ring-primary"
          placeholder="Search '3BHK in Indiranagar'"
        />
      </div>
    </section>
  );
}
