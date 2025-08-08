/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                primary: "#a93439",
                secondary: "#FFD300",
                tertiary: "#6C4DDA",
                success: "#0ABE75",
                info: "#246BFD",
                warning: "#FACC15",
                error: "#F75555",
                disabled: "#D8D8D8",
                "secondary-white": "#F8F8F8",
                "tertiary-white": "#F7F7F7",
                "dark-1": "#000000",
                "dark-2": "#1F222A",
                "dark-3": "#35383F",
                "greyscale-900": "#212121",
                "greyscale-800": "#424242",
                "grayscale-700": "#616161",
                "grayscale-400": "#BDBDBD"
            }
        }
    },
    presets: [require("nativewind/preset")],
    plugins: []
}
