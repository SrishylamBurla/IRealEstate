// import SocketProvider from "@/components/SocketProvider";
// import "./globals.css";
// import Navbar from "../components/Navbar";

// export default function RootLayout({ children }) {
//   const user =
//     typeof window !== "undefined"
//       ? JSON.parse(localStorage.getItem("user"))
//       : null;

//   return (
//     <html>
//       <body>
//         {user && <SocketProvider userId={user._id} />}
//         <Navbar />
//         {children}
//       </body>
//     </html>
//   );
// }


import "./globals.css";
import Navbar from "../components/Navbar";
import { Providers } from "../store/providers";
import SocketProvider from "@/components/SocketProvider";

export default function RootLayout({ children }) {
    const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : null;
  return (
    <html lang="en">
      <body>
        <Providers>
        {user && <SocketProvider userId={user._id} />}
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
