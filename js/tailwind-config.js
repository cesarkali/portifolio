tailwind.config = {
    theme: {
        extend: {
            colors: {
                tech: {
                    black: '#030303',
                    dark: '#0a0a0a',
                    card: '#121212',
                    blue: '#0070f3',
                    cyan: '#00d4ff',
                    purple: '#7928ca',
                    magenta: '#ff0080',
                    text: '#fdfdfd',
                    muted: '#a1a1aa',
                    accent: '#3dd9eb'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in': 'fadeIn 1s ease-out forwards',
                'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'reveal-right': 'revealRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'spin-slow': 'spin 12s linear infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px) scale(0.98)' },
                    '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(0, 112, 243, 0.2), 0 0 10px rgba(0, 112, 243, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(0, 112, 243, 0.6), 0 0 40px rgba(0, 212, 255, 0.4)' },
                },
                revealRight: {
                    '0%': { width: '0%', opacity: '0' },
                    '100%': { width: '100%', opacity: '1' },
                }
            },
            backgroundImage: {
                'mesh-gradient': "radial-gradient(at 0% 0%, rgba(0, 112, 243, 0.15) 0, transparent 50%), radial-gradient(at 50% 0%, rgba(121, 40, 202, 0.1) 0, transparent 50%), radial-gradient(at 100% 0%, rgba(255, 0, 128, 0.05) 0, transparent 50%)",
            }
        }
    }
}

