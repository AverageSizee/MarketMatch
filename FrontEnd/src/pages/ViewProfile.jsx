import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Avatar,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Divider,
  Paper
} from '@mui/material';
import axios from 'axios';
import Navbar from '../components/Navbar';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/getUserbyId`, {
          params: { id: userId },
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        });
        setUser(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  return (
        <Container
        maxWidth={false}
        disableGutters
        sx={{
            padding: 0,
            minHeight: '100vh', // Full height
            display: 'flex',
            flexDirection: 'column',
        }}
        >
        <Navbar />
        <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{
            backgroundColor: '#7D0C0E',
            padding: 2,
            flexGrow: 1, // Fill the remaining space
            }}
        >
        <Grid
            item
            sx={{
            backgroundColor: 'white',
            padding: 5,
            borderRadius: '8px',
            width: '100%', 
            margin: '0 auto', 
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', 
            minHeight: '85vh',
            height: 'auto', 
            }}
        >
            <Paper elevation={3} sx={{ p: 4, mb: 4, backgroundColor: '#800000', color: 'white' }}>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Avatar
                    src={user?.image ? `data:image/jpeg;base64,${user.image}` : '/images/default-avatar.png'}
                    alt={user?.firstname}
                    sx={{
                        width: 200,
                        height: 200,
                        border: '5px solid #FFD700',
                    }}
                    />
                </Box>
                </Grid>
                <Grid item xs={12} md={8}>
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    {user?.firstname} {user?.lastname}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <SchoolIcon sx={{ mr: 1, color: '#FFD700' }} />
                    <Typography variant="body1">
                    Student ID: {user?.studentid}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 1, color: '#FFD700' }} />
                    <Typography variant="body1">
                    {user?.email}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    sx={{
                    backgroundColor: '#FFD700',
                    color: '#800000',
                    '&:hover': { backgroundColor: '#E6C200' },
                    fontWeight: 'bold',
                    }}
                >
                    Contact User
                </Button>
                </Grid>
            </Grid>
            </Paper>

            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#800000' }}>
            Products for Sale
            </Typography>
            <Grid container spacing={3}>
            {user?.seller_id.products &&
            user.seller_id.products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.productId}>
                <Card
                    sx={{
                    height: '100%',
                    display: 'flex',
                    cursor: 'pointer',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                    },
                    }}
                    onClick={() => navigate(`/${product.productName}/${product.productId}`)}
                >
                    <CardMedia
                    component="img"
                    height="200"
                    image={product.image ? `data:image/jpeg;base64,${product.image}` : '/images/placeholder.png'}
                    alt={product.productName}
                    />
                    <CardContent sx={{ flexGrow: 1, bgcolor: '#F8F8F8' }}>
                    <Typography gutterBottom variant="h6" component="div" sx={{ color: '#800000', fontWeight: 'bold' }}>
                        {product.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }} noWrap>
                        {product.productDescription}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="h6" sx={{ color: '#800000', fontWeight: 'bold' }}>
                        P{product.productPrice}
                    </Typography>
                    </CardContent>
                </Card>
                </Grid>
            ))}
            </Grid>
        </Grid>
        </Grid>
        </Container>

  );
}

