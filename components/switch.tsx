"use client";

type SwitchProps = {
  checked: boolean;
  onCheckedChange: () => void;
};

export function Switch({ checked, onCheckedChange }: SwitchProps) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onCheckedChange}
      className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border transition-colors duration-300 ${
        checked
          ? "border-accent/40 bg-accent/20"
          : "border-white/10 bg-white/5"
      }`}
    >
      <span
        className={`h-6 w-6 rounded-full transition-transform duration-300 ${
          checked ? "translate-x-7 bg-accent shadow-[0_0_24px_rgba(55,244,255,0.55)]" : "translate-x-1 bg-white/70"
        }`}
      />
    </button>
  );
}
