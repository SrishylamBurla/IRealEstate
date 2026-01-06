export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-200 px-6 pt-12 pb-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-primary"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAT_8DnXAw-2znOkSLnTgqhumXWz3bjPEbdLWtckeqWLhxSzdMNv89MXEwmB14xFqiOSCLm2nMdgp9NiR01287-eqmp3sveXI0CNHHwbPF_xVe9px0Yo2G1NKA4r064c-Zl8YvR3vqVWwhJi7hButhhuDNTmINWbXRS8xtMedEQ8n7lglCDUBdhLtETd1Ha7e_zk3tzbLOrBVbIWVv1Bjt02-zWysYpbv7Gu5yaQmjA7svxAMIM3Iq-Dxj55uXVXV-jxnFfTKzYu9GU')",
          }}
        />
        <div>
          <span className="text-xs text-gray-500">Welcome back</span>
          <h1 className="text-lg font-bold">Rahul Sharma</h1>
        </div>
      </div>

      <button className="relative p-2 rounded-full hover:bg-gray-100">
        <span className="material-symbols-outlined text-gray-700">
          notifications
        </span>
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
      </button>
    </header>
  );
}
