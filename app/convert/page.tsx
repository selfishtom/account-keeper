"use client";

import { useState } from "react";
//import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/Modal";

export default function Home() {
  const [value, setValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [links, setLinks] = useState<(string | null | undefined)[]>([]);
  const [dataLimit, setDataLimit] = useState<string>("");
  const [dataUsed, setDataUsed] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  //const router = useRouter();

  const handleClick = async () => {
    if (!value) return;
    //const newVal = value.split("/")[4].trim();
    //router.push(`/convert/${newVal}`);

    // استخراج slug از لینک ورودی
    const slug = value.split("/")[4]?.trim();
    if (!slug) {
      setError("لینک وارد شده معتبر نیست.");
      return;
    }

    // باز کردن Modal و شروع loading
    setIsModalOpen(true);
    setIsLoading(true);
    setLinks([]);
    setError("");
    setUsername("");
    setDataLimit("");
    setDataUsed("");

    try {
      // درخواست به API Route خودمون
      const response = await fetch("/api/get-links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در دریافت لینک‌ها");
      }

      setLinks(data.links || []);
      setDataLimit(data.DataLimit || "");
      setDataUsed(data.DataUsed || "");
      setUsername(data.username || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطای ناشناخته");
      setLinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-black font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Input
          className="w-half border-2 p-2"
          type="text"
          placeholder="paste your sublink"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError("");
          }}
        />

        {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}

        <Button
          onClick={handleClick}
          className="bg-green-300 p-5 rounded-4xl mt-5 hover:border-2"
          disabled={isLoading}
        >
          {isLoading ? "در حال پردازش..." : "Let's Go"}
        </Button>
      </main>

      {/* Modal برای نمایش نتایج */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        links={links}
        dataLimit={dataLimit}
        dataUsed={dataUsed}
        isLoading={isLoading}
        username={username}
      />
    </div>
  );
}
