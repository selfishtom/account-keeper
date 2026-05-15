import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sub Link",
  description: "this application create by mrfishim !",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-black font-sans">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white sm:items-start">
        {children}
      </main>
    </div>
  );
}
