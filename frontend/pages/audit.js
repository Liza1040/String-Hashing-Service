import React from 'react';
import PropTypes from 'prop-types';
import { getSession } from 'next-auth/react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function AuditPage({ auditLogs, error }) {
    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" component="h1" gutterBottom>
                        Ошибка загрузки аудита
                    </Typography>
                    <Typography color="error">{error}</Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Аудит логов
                </Typography>
                {auditLogs.length === 0 ? (
                    <Typography>Логов не обнаружено.</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Дата</TableCell>
                                    <TableCell>Пользователь</TableCell>
                                    <TableCell>Операция</TableCell>
                                    <TableCell>Дополнительная информация</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {auditLogs.map((log) => {
                                    const date = new Date(log.created_at).toLocaleString();
                                    const userText = log.user_id ? log.user_id : 'Системное действие';
                                    const meta = log.meta || {};
                                    // Формируем строку для meta
                                    const metaDetails = Object.entries(meta)
                                        .map(([key, value]) => `${key}: ${value}`)
                                        .join(', ');
                                    return (
                                        <TableRow key={log.id}>
                                            <TableCell>{log.id}</TableCell>
                                            <TableCell>{date}</TableCell>
                                            <TableCell>{userText}</TableCell>
                                            <TableCell>{log.operation}</TableCell>
                                            <TableCell>{metaDetails}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Container>
    );
}

AuditPage.propTypes = {
    auditLogs: PropTypes.array.isRequired,
    error: PropTypes.string,
};

export async function getServerSideProps(context) {
    const session = await getSession(context);

    if (!session || session.user.role !== 'admin') {
        return {
            redirect: {
                destination: '/no-access',
                permanent: false,
            },
        };
    }

    try {
        console.log(session.user.role)
        const res = await fetch('http://localhost:3001/audit', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        });

        if (!res.ok) {
            throw new Error('Ошибка при получении данных аудита');
        }

        const auditLogs = await res.json();
        return { props: { auditLogs } };
    } catch (err) {
        return { props: { auditLogs: [], error: err.message } };
    }
}