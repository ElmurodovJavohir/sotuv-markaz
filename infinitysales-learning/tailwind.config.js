module.exports = {
  content: [
    "./components/**/*.{vue,js}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
  ],
  theme: {
    screens: {
      sm: { max: "640px" },
      md: { max: "767px" },
      lg: { max: "1024px", min: "768px" },
      xl: { min: "1024px" },
    },
    extend: {
      colors: {
        blue: "#268ae7",
        dark: "#080e14",
        grey: "#768194",
        bg: "#f5f7f9",
        divider: "#edf1f5",
      },
      boxShadow: {
        card: "0px 4px 12px 0px rgba(0,0,0,0.02)",
        header: "0px 8px 28px 0px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        card: "16px",
        "card-lg": "20px",
      },
    },
  },
};
