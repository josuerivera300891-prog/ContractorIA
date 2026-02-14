import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#00a991",
                "brand-navy": "#092a3d",
                "brand-primary": "#00a991",
                "brand-slate": "#4a6674",
                "background-soft": "#f5f7f9",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.375rem",
                "lg": "0.5rem",
                "xl": "0.85rem",
                "2xl": "1rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
};
export default config;
