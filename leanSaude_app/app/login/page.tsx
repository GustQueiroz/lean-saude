"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setError("");
    setEmailError("");
    setPasswordError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.access_token);
      router.push("/usuarios");
    } catch (err: any) {
      const message = err.response?.data?.message || "Erro ao fazer login.";
      if (message.toLowerCase().includes("email")) {
        setEmailError("Email não encontrado. Confira e tente novamente.");
      } else if (message.toLowerCase().includes("senha")) {
        setPasswordError(
          "Senha incorreta. Por favor, verifique e tente novamente."
        );
      } else {
        setError("Erro ao fazer login. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center w-1/2 p-10">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-medium text-gray-500 mb-2">LOGO</h1>
          <h2 className="text-2xl font-medium mb-2">Bem-vindo(a)</h2>
          <p className="text-gray-500 mb-8">
            Acesse sua conta para iniciar a sessão
          </p>

          {error && (
            <p className="text-sm text-red-500 bg-red-100 p-2 rounded-md mb-4">
              {error}
            </p>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={emailError ? "border-red-500" : ""}
                required
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={passwordError ? "border-red-500" : ""}
                required
              />
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">{passwordError}</p>
              )}
            </div>
            <a href="#" className="text-primary hover:underline text-sm">
              Esqueceu sua senha?
            </a>

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
