import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import SignInButton from "../components/SignInButton";
import {
    Container,
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
} from "@mui/material";

export default function Login() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/");
        }
    }, [session, router]);

    if (status === "loading") {
        return (
            <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center" }}>
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>
                    Проверка сессии...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom align="center">
                            Вход в систему
                        </Typography>
                        <Typography variant="body1" gutterBottom align="center">
                            Пожалуйста, авторизуйтесь для использования приложения.
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                            <SignInButton />
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}