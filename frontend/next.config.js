module.exports = {
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; " +
                            "connect-src 'self' http://localhost:3001; " +
                            "font-src 'self' data: yastatic.net; " +
                            "img-src 'self' data: https://authjs.dev; " +
                            "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                            "style-src 'self' 'unsafe-inline';"                    }
                ]
            }
        ]
    }
}