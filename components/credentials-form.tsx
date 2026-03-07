"use client";

import { useActionState, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { signInWithPassword, signUpWithPassword, type ActionState } from "@/lib/actions";
import type { Locale } from "@/lib/types";
import { cn } from "@/lib/cn";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";

const initialState: ActionState = {
  status: "idle"
};

export function CredentialsForm({
  locale,
  dictionary
}: {
  locale: Locale;
  dictionary: {
    email: string;
    password: string;
    signInButton: string;
    signUpButton: string;
    signInNote: string;
    signUpNote: string;
  };
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInAction] = useActionState(signInWithPassword, initialState);
  const [signUpState, signUpAction] = useActionState(signUpWithPassword, initialState);

  return (
    <div className="space-y-8">
      {/* Animated Toggle */}
      <div className="flex items-center justify-center p-1 rounded-full border border-[var(--line)] bg-[var(--paper-warm)] max-w-[280px] mx-auto">
        <button
          type="button"
          onClick={() => setMode("signin")}
          className={cn(
            "relative flex-1 py-2.5 text-[13px] uppercase tracking-wider font-medium rounded-full transition-colors z-10 cursor-pointer",
            mode === "signin" ? "text-[var(--surface)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
          )}
        >
          {mode === "signin" && (
            <motion.div layoutId="auth-tab" className="absolute inset-0 bg-[var(--ink)] rounded-full -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
          )}
          {locale === "da" ? "Log ind" : "Sign In"}
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={cn(
            "relative flex-1 py-2.5 text-[13px] uppercase tracking-wider font-medium rounded-full transition-colors z-10 cursor-pointer",
            mode === "signup" ? "text-[var(--surface)]" : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
          )}
        >
          {mode === "signup" && (
            <motion.div layoutId="auth-tab" className="absolute inset-0 bg-[var(--ink)] rounded-full -z-10" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
          )}
          {locale === "da" ? "Opret konto" : "Sign Up"}
        </button>
      </div>

      <div className="relative min-h-[300px]">
        <AnimatePresence mode="wait">
          {mode === "signin" ? (
            <motion.form 
              key="signin"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              action={signInAction} 
              className="space-y-5"
            >
              <input name="locale" type="hidden" value={locale} />
              <div className="space-y-2">
                <Label htmlFor="credentials-email-signin">{dictionary.email}</Label>
                <Input autoComplete="email" id="credentials-email-signin" name="email" required type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credentials-password">{dictionary.password}</Label>
                <Input autoComplete="current-password" id="credentials-password" name="password" required type="password" />
              </div>
              <p className="text-sm leading-6 text-[var(--ink-soft)]">
                {signInState.message ? <span className="text-[var(--terracotta)]">{signInState.message}</span> : dictionary.signInNote}
              </p>
              <SubmitButton className="w-full" size="lg" variant="default">
                {dictionary.signInButton}
              </SubmitButton>
            </motion.form>
          ) : (
            <motion.form 
              key="signup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              action={signUpAction} 
              className="space-y-5"
            >
              <input name="locale" type="hidden" value={locale} />
              <div className="space-y-2">
                <Label htmlFor="credentials-email">{dictionary.email}</Label>
                <Input autoComplete="email" id="credentials-email" name="email" required type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credentials-password-signup">{dictionary.password}</Label>
                <Input autoComplete="new-password" id="credentials-password-signup" minLength={8} name="password" required type="password" />
              </div>
              <p className="text-sm leading-6 text-[var(--ink-soft)]">
                {signUpState.message ? <span className="text-[var(--terracotta)]">{signUpState.message}</span> : dictionary.signUpNote}
              </p>
              <SubmitButton className="w-full" size="lg" variant="default">
                {dictionary.signUpButton}
              </SubmitButton>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
