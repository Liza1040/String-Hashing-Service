import { signIn, signOut, useSession } from "next-auth/react";

export default function SignInButton() {
    const { data: session } = useSession();

    if (session) {
        return (
            <div>
                <p>Добро пожаловать, {session.user.name}</p>
                <button onClick={() => signOut()}>Выйти</button>
            </div>
        );
    }
    return (
        <button onClick={() => signIn("yandex")}>
            Войти через Яндекс
        </button>
    );
}