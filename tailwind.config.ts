import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
        mono: ["var(--font-mono)"],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        pulse: {
          "0%, 100%": {
            opacity: "1",
          },
          "50%": {
            opacity: "0.7",
          },
        },
        spin: {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        pulse: "pulse 2s infinite",
        spin: "spin 1s linear infinite",
      },
      scale: {
        "102": "1.02",
      },
      backdropBlur: {
        xs: "2px",
      },
      spacing: {
        "18": "4.5rem",
        "72": "18rem",
        "84": "21rem",
        "96": "24rem",
      },
      lineClamp: {
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    function({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        '.line-clamp-3': {
          display: '-webkit-box',
          '-webkit-line-clamp': '3',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-4': {
          display: '-webkit-box',
          '-webkit-line-clamp': '4',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-5': {
          display: '-webkit-box',
          '-webkit-line-clamp': '5',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.line-clamp-6': {
          display: '-webkit-box',
          '-webkit-line-clamp': '6',
          '-webkit-box-orient': 'vertical',
          overflow: 'hidden',
        },
        '.tendedero-card': {
          transform: 'rotate(-1deg)',
          transition: 'all 0.3s ease',
          position: 'relative',
        },
        '.tendedero-card:nth-child(even)': {
          transform: 'rotate(1deg)',
        },
        '.tendedero-card:nth-child(3n)': {
          transform: 'rotate(-0.5deg)',
        },
        '.tendedero-card:hover': {
          transform: 'rotate(0deg) scale(1.02)',
          'z-index': '10',
        },
        '.clip-shadow': {
          'box-shadow': '0 -5px 10px rgba(107, 2, 167, 0.1), 0 4px 15px rgba(0, 0, 0, 0.1)',
        },
        '.floating-form': {
          'backdrop-filter': 'blur(10px)',
          background: 'rgba(255, 255, 255, 0.95)',
        },
        '.gradient-bg': {
          background: 'linear-gradient(135deg, hsl(320, 15%, 97%) 0%, hsl(310, 20%, 95%) 50%, hsl(320, 15%, 97%) 100%)',
        },
        '.pattern-alert': {
          animation: 'pulse 2s infinite',
        },
        '.clothesline': {
          background: 'linear-gradient(90deg, transparent 0%, hsl(320, 20%, 60%) 2%, hsl(320, 20%, 60%) 98%, transparent 100%)',
          height: '2px',
          position: 'relative',
        },
        '.clothespin': {
          width: '8px',
          height: '20px',
          background: 'linear-gradient(135deg, #8B4513, #A0522D)',
          'border-radius': '2px',
          position: 'absolute',
          top: '-10px',
          'box-shadow': '0 2px 4px rgba(0,0,0,0.2)',
        },
        '.glass': {
          background: 'rgba(255, 255, 255, 0.25)',
          'backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
        '.card-shadow': {
          'box-shadow': '0 4px 6px -1px rgba(107, 2, 167, 0.1), 0 2px 4px -1px rgba(107, 2, 167, 0.06)',
        },
        '.card-shadow:hover': {
          'box-shadow': '0 20px 25px -5px rgba(107, 2, 167, 0.1), 0 10px 10px -5px rgba(107, 2, 167, 0.04)',
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
} satisfies Config;
