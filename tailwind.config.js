/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./index.html',
		'./src/**/*.{js,ts,jsx,tsx}',
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/**/*.{html,js,jsx,ts,tsx,mdx}',
		'./index.html',
		'./src/index.html',
		'node_modules/preline/dist/*.js',
	],
	darkMode: 'class',

	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'],
			},
			animation: {
				gradient: 'gradient 8s linear infinite',
			},
			keyframes: {
				gradient: {
					to: { 'background-position': '200% center' },
				},
			},
		},
	},
	plugins: [require('preline/plugin')],
};
