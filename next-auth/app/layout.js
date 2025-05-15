import "../app/globals.css";
import Navbar from "../component/navbar";

export const metadata = {
  title: "Auth App",
  description: "Next.js Auth",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen text-gray-900 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="max-w-xl w-full p-6 rounded-lg">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
