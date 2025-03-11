import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: 'class',
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#4338ca",
          "primary-focus": "#1d4ed8",
          "primary-content": "#ffffff",
          "secondary": "#0ea5e9",
          "secondary-focus": "#0284c7",
          "accent": "#06b6d4",
          "neutral": "#1e293b",
          "neutral-content": "#f8fafc",
          "base-100": "#ffffff",
          "base-200": "#f1f5f9",
          "base-300": "#e2e8f0",
          "base-content": "#1e293b",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      {
        corporate: {
          "primary": "#0284c7",
          "secondary": "#0ea5e9",
          "accent": "#06b6d4",
          "neutral": "#1e293b",
          "neutral-content": "#f8fafc",
          "base-100": "#ffffff",
          "base-200": "#f1f5f9",
          "base-300": "#e2e8f0",
          "base-content": "#0f172a",
          "info": "#0ea5e9",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444"
        }
      },
      {
        dark: {
          "primary": "#818cf8",
          "secondary": "#a78bfa",
          "accent": "#37CDBE",
          "neutral": "#1f2937",
          "neutral-content": "#f3f4f6",
          "base-100": "#111827",
          "base-content": "#f3f4f6",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
} satisfies Config;



/**


        light: {
          "primary": "#4F46E5",
          "secondary": "#10B981",
          "accent": "#F59E0B",
          "neutral": "#3D4451",
          "base-100": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
      },
        dark: {
          "primary": "#6366F1",
          "secondary": "#34D399",
          "accent": "#FBBF24",
          "neutral": "#1F2937",
          "base-100": "#1E293B",
          "info": "#0EA5E9",
          "success": "#10B981",
          "warning": "#F59E0B",
          "error": "#EF4444",
        }
      

 */