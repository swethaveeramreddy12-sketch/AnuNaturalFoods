import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, Leaf } from "lucide-react";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
const signupSchema = loginSchema.extend({
  fullName: z.string().trim().min(2, "Enter your name").max(80),
});

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/account";

  if (loading) return null;
  if (user) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const schema = mode === "signup" ? signupSchema : loginSchema;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const f: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { f[i.path[0] as string] = i.message; });
      setErrors(f);
      return;
    }
    setErrors({});
    setBusy(true);

    const result = mode === "signup"
      ? await signUp(parsed.data.email, parsed.data.password, (parsed.data as { fullName: string }).fullName)
      : await signIn(parsed.data.email, parsed.data.password);

    setBusy(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(mode === "signup" ? "Welcome to Anunatural Foods!" : "Welcome back!");
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md rounded-3xl bg-card p-8 shadow-card sm:p-10">
          <div className="text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-mango">
              <Leaf className="h-6 w-6 text-secondary-foreground" />
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold text-primary">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Sign in to track your mango orders"
                : "Save your address & view past orders"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="fullName">Full name</label>
                <input id="fullName" name="fullName" required className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                {errors.fullName && <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>}
              </div>
            )}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required autoComplete="email" className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground" htmlFor="password">Password</label>
              <input id="password" name="password" type="password" required minLength={6} autoComplete={mode === "login" ? "current-password" : "new-password"} className="mt-1 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
            </div>

            <button type="submit" disabled={busy} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:scale-[1.01] disabled:opacity-60">
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "login" ? "New customer?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErrors({}); }} className="font-semibold text-primary underline-offset-4 hover:underline">
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">← Back to shop</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
