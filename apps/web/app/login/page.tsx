// apps/web/app/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/panel",
    });

    setLoading(false);

    if (res?.ok) {
      window.location.href = "/panel";
    } else {
      setError("Correo o contraseña incorrectos.");
    }
  }

  async function handleMagicLink() {
    if (!email) return setError("Escribe tu correo primero");

    setLoading(true);
    setError(null);

    await signIn("resend", {
      email,
      redirect: false,
    });

    setLoading(false);
    setMagicSent(true);
  }

  async function handleGoogleLogin() {
    await signIn("google", {
      callbackUrl: "/mi-cuenta",
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-6">
      <div className="glass w-full max-w-sm rounded-2xl p-8">
        <Link href="/" className="mb-8 block font-display text-sm font-black">
          NEXORA <span className="text-cyan">LABS</span>
        </Link>

        {magicSent ? (
          <p className="text-sm text-text-muted">
            Te enviamos un link mágico a{" "}
            <span className="text-text">{email}</span>. Revisa tu correo.
          </p>
        ) : (
          <>
            <form onSubmit={handleCredentials} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg border border-border/10 bg-surface/5 p-3 text-sm"
              />

              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="rounded-lg border border-border/10 bg-surface/5 p-3 text-sm"
              />

              {error && (
                <p className="text-xs text-danger">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="rounded-full bg-text py-3 font-display text-sm font-medium text-bg disabled:opacity-50"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              <button
                type="button"
                onClick={handleMagicLink}
                disabled={loading}
                className="rounded-full border border-border/15 py-3 font-display text-sm text-text-muted"
              >
                Entrar con link mágico
              </button>
            </form>

            {/* Separador */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-border/15" />
              <span className="text-xs text-text-muted">o</span>
              <div className="h-px flex-1 bg-border/15" />
            </div>

            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-full border border-border/15 py-3 text-sm font-medium transition hover:bg-surface/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="h-5 w-5"
              >
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15 19 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.3 35.1 26.8 36 24 36c-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.4 5.7-6.2 7.5l6.2 5.2C39.1 37.1 44 31.2 44 24c0-1.3-.1-2.4-.4-3.5z"
                />
              </svg>

              Continuar con Google
            </button>
          </>
        )}

        <p className="mt-6 text-center text-xs text-text-muted">
          ¿No tienes cuenta?{" "}
          <Link href="/registro" className="text-cyan">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}