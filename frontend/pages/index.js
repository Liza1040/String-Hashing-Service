import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Container, TextField, Button, MenuItem, Typography, Box } from "@mui/material";


export default function Home() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [input, setInput] = useState("");
    const [algorithm, setAlgorithm] = useState("sha256");
    const [result, setResult] = useState("");

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);
    if (status === "loading") {
        return <p>Загрузка сессии...</p>;
    }
    if (!session) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(input, algorithm)
            const res = await fetch("http://localhost:3001/hash", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ input, algorithm })
            });
            console.log(input, algorithm)
            const data = await res.json();
            if (res.ok) {
                setResult(data.hash);
            } else {
                setResult("Ошибка: " + (data.error || "Неизвестная ошибка"));
            }
        } catch (error) {
            setResult("Ошибка при запросе");
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Генерация хеша
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
                <TextField
                    fullWidth
                    label="Входная строка"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    required
                    margin="normal"
                />
                <TextField
                    select
                    fullWidth
                    label="Алгоритм"
                    value={algorithm}
                    onChange={(e) => setAlgorithm(e.target.value)}
                    margin="normal"
                >
                    <MenuItem value="md5">MD5</MenuItem>
                    <MenuItem value="sha1">SHA1</MenuItem>
                    <MenuItem value="sha256">SHA256</MenuItem>
                </TextField>
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Сгенерировать хеш
                </Button>
            </Box>
            {result && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h6">Результат:</Typography>
                    <Typography variant="body1">{result}</Typography>
                </Box>
            )}
        </Container>
    );
}