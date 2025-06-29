import NextAuth from "next-auth";
import YandexProvider from "next-auth/providers/yandex";

export default NextAuth({
    providers: [
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID,
            clientSecret: process.env.YANDEX_CLIENT_SECRET,
            scope: "login:email",
            profile: (data) => {
                return {
                    id: data.id,
                    name: data.realname,
                    email: data.default_email,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, account, profile }) {
            // При первом входе (когда account и profile доступны)
            if (user && !token.role) {
                token.role = user.email === "elizaveta1040maximova@yandex.ru"  ? "admin" : "user";
            }
            if (user) {
                token.token = account?.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            // Передача роли из токена в session.user
            session.user.role = token.role;
            session.user.token = token.token;
            return session;
        },
    },
});