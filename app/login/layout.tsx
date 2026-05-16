// app/manager/layout.tsx
export const metadata = {
  title: "Account Keeper",
  description: "Panel Account Keeper Login",
};

export default function ManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">{children}</div>
  );
}
