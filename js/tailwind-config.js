tailwind.config = {
    theme: {
        extend: {
            colors: {
                tech: {
                    black: '#0a0a0a',
                    dark: '#121212',
                    card: '#1e1e1e',
                    blue: '#0070f3',
                    cyan: '#00d4ff',
                    text: '#e5e5e5',
                    muted: '#a1a1aa'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s ease-out',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            }
        }
    }
}
