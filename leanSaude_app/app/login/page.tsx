"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center w-1/2 p-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-medium text-gray-500 mb-2">LOGO</h1>

          <h2 className="text-2xl font-medium mb-2">Bem-vindo(a)</h2>
          <p className="text-gray-500 mb-8">
            Acesse sua conta para iniciar a sessão
          </p>

          <form className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <a href="#" className="text-primary hover:underline text-sm">
                Esqueceu sua senha?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? "Carregando..." : "Acessar plataforma"}
            </Button>
          </form>
        </div>
      </div>

      <div className="w-1/2 bg-primary"></div>
    </div>
  );
}
