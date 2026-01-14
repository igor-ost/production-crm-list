import { Header } from "@/components/ui/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 bg-[#006fea] p-8">
         {children}
        </main>
      </div>
    </div>
  );
}
