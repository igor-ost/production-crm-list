import { Sidebar } from "@/components/ui/sidebar";
import { TopHeader } from "@/components/ui/top-header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopHeader/>

        <main className="flex-1 bg-gradient-to-br from-cyan-400 to-blue-500 p-8">
         {children}
        </main>
      </div>
    </div>
  );
}
