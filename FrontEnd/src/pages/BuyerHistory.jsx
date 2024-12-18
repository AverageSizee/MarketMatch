import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Paper, Chip, Button } from '@mui/material';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import axios from 'axios';
import '../App.css';

export default function BuyerHistory() {
    const [buyerHistory, setBuyerHistory] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/buyer-history/buyer', {
            params: { buyerId: sessionStorage.getItem('id') },
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        }).then(response => {
            setBuyerHistory(response.data);
            console.log(response.data);
        }).catch(error => {
            console.error('Error fetching buyer history:', error);
        });
    }, []);

    const deleteHistory = (id) => {
        axios.delete(`http://localhost:8080/api/buyer-history/delete/${id}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        }).then(() => {
            setBuyerHistory(prevHistory => prevHistory.filter(item => item.id !== id));
        }).catch(error => {
            console.error('Error deleting history:', error);
        });
    };

    return (
        <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#800000' }}>
            <Navbar />
            <Box sx={{ flexGrow: 1, display: 'flex', padding: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={3} lg={2.5}>
                        <SideBar />
                    </Grid>
                    <Grid item xs={12} md={9} lg={9.5}>
                        <Paper elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h5" sx={{ p: 2, borderBottom: '1px solid #e0e0e0', fontWeight: 'bold' }}>
                                Buyer History
                            </Typography>
                            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, maxHeight: 'calc(100vh - 250px)' }}>
                                {buyerHistory.length > 0 ? (
                                    buyerHistory.map((history) => (
                                        <HistoryItem key={history.id} history={history} deleteHistory={deleteHistory} />
                                    ))
                                ) : (
                                    <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>No history found. </Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
}


function HistoryItem({ history, deleteHistory }) {
    // Determine the color based on the status
    const getStatusColor = (status) => {
        if (status === 'Cancelled') {
            return 'error'; // Red
        }
        if (status === 'Completed') {
            return 'success'; // Green
        }
        return 'default'; // Default for other statuses
    };

    return (
        <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <Box sx={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                            src={history.image
                                ? 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                                : `data:image/jpeg;base64,${history.product.image}`}
                            alt={history.productName || 'Placeholder Image'}
                            style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>{history.product.productName}</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Price:</Typography>
                            <Typography variant="body1">P {history.product.price}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Quantity:</Typography>
                            <Typography variant="body1">{history.quantity} pcs</Typography>
                        </Grid>
                        <Grid item xs={6}>
                        {history.status === 'Cancelled' && (
                            <>
                                <Typography variant="body2" color="text.secondary">Canceled by:</Typography>
                                <Typography variant="body1">{history.canceledBy}</Typography>
                            </>
                        )}
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Total:</Typography>
                            <Typography variant="body1">P {history.totalPrice}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Date:</Typography>
                            <Typography variant="body1">{new Date(history.transactionDate).toLocaleDateString()}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">Status:</Typography>
                            <Chip
                                label={history.status}
                                variant="outlined"
                                size="small"
                                color={getStatusColor(history.status)}
                            />
                        </Grid>
                    </Grid>
                    {/* Delete button */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', pt: 2 }}>
                        <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => deleteHistory(history.id)}
                        >
                            Delete
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}