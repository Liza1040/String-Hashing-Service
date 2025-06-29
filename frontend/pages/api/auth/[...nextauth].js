import NextAuth from "next-auth";
import YandexProvider from "next-auth/providers/yandex";

export default NextAuth({
    providers: [
        YandexProvider({
            clientId: process.env.YANDEX_CLIENT_ID,
            clientSecret: process.env.YANDEX_CLIENT_SECRET,
            scope: "login:email"
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
});