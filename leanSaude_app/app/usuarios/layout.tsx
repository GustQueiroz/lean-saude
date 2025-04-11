import type React from "react";

export default function UsuariosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto py-6 px-4">{children}</main>
    </div>
  );
}
