const config = {
    darkMode: "class",
    content: [
        "../../apps/web/app/**/*.{ts,tsx}",
        "../../apps/web/components/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "rgb(var(--color-bg) / <alpha-value>)",
                surface: "rgb(var(--color-surface) / <alpha-value>)",
                border: "rgb(var(--color-border) / <alpha-value>)",
                text: "rgb(var(--color-text) / <alpha-value>)",
                "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
                purple: "rgb(var(--color-purple) / <alpha-value>)",
                blue: "rgb(var(--color-blue) / <alpha-value>)",
                cyan: "rgb(var(--color-cyan) / <alpha-value>)",
                success: "rgb(var(--color-success) / <alpha-value>)",
                warning: "rgb(var(--color-warning) / <alpha-value>)",
                danger: "rgb(var(--color-danger) / <alpha-value>)",
            },
            fontFamily: {
                display: ["Satoshi", "Inter", "sans-serif"],
                body: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            borderRadius: {
                sm: "var(--radius-sm)",
                md: "var(--radius-md)",
                lg: "var(--radius-lg)",
                full: "var(--radius-full)",
            },
            keyframes: {
                aurora: {
                    "0%": { transform: "translate(0,0) scale(1)" },
                    "100%": { transform: "translate(4%,6%) scale(1.15)" },
                },
                scan: {
                    "0%": { left: "-30%" },
                    "100%": { left: "130%" },
                },
                "pulse-ring": {
                    "0%": { transform: "scale(0.8)", opacity: "0.7" },
                    "100%": { transform: "scale(1.8)", opacity: "0" },
                },
            },
            animation: {
                aurora: "aurora 22s ease-in-out infinite alternate",
                scan: "scan 0.9s cubic-bezier(0.2,0.7,0.2,1)",
                "pulse-ring": "pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite",
            },
            backdropBlur: {
                glass: "20px",
                "glass-strong": "28px",
            },
        },
    },
    plugins: [],
};
export default config;
