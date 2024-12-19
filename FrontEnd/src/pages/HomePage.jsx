import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
  Container,
  Grid,
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CircularProgress,
  Avatar,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

const brandingImages = [
  '/images/branding1.png',
  '/images/branding2.png',
  '/images/branding3.png',
];

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const currentUserId = sessionStorage.getItem('id');
  
    // Function to fetch seller details by ID
    const fetchSellerDetails = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/user/getUserbyId`, {
          params: { id: userId }, // Assuming the request parameter is `id`
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        });
        return response.data; // Return the seller details
      } catch (error) {
        console.error('Error fetching seller details for userId', error);
        return null; // Return null if there's an error
      }
    };
  
    const fetchProducts = async () => {
      setLoading(true); // Start loading before fetching products
      try {
        const productResponse = await axios.get('http://localhost:8080/api/user/getAllProducts', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + sessionStorage.getItem('token'),
          },
        });
  
        const products = productResponse.data.filter(
          (product) => String(product.userId) !== String(currentUserId)
        );
        //console.log(products);
        // Fetch seller details for each product
        const productsWithSellers = await Promise.all(
          products.map(async (product) => {
            const seller = await fetchSellerDetails(product.sellerid);
            return { ...product, seller }; // Combine product with seller details
          })
        );
  
        setProducts(productsWithSellers);
        setDisplayedProducts(productsWithSellers.slice(0, visibleCount));
        //console.log(productsWithSellers);
      } catch (error) {
        console.error('There was an error fetching the products!', error);
      } finally {
        setLoading(false); // Stop loading after the fetch operation
      }
    };
  
    fetchProducts();
  }, [visibleCount]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    const filteredProducts = products.filter(
      (product) =>
        product.productName &&
        product.productName.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setDisplayedProducts(filteredProducts.slice(0, visibleCount));
  };

  const loadMoreProducts = () => {
    setVisibleCount((prevCount) => prevCount + 8);
  };

  return (
    <div style={{ backgroundColor: '#800000' }}>
      <Navbar />

      <Box sx={{ backgroundColor: '#f5f5f5', paddingTop: 2 }}>
        <Container maxWidth="xl">
          <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
            {brandingImages.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`Branding ${index + 1}`}
                  style={{ height: '400px', objectFit: 'cover' }}
                />
              </div>
            ))}
          </Carousel>
        </Container>
      </Box>

      {/* Search Bar */}
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper
          component="form"
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: '6px 12px',
            borderRadius: 50,
            boxShadow: 3,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <TextField
            fullWidth
            placeholder="Search for products..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{
              flex: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: 50, 
              },
            }}
          />
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              backgroundColor: '#800000', 
              color: '#FFD700',
              borderRadius: '50%',
              '&:hover': {
                backgroundColor: '#660000',
              },
              padding: 1,
            }}
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Container>

      {/* Loading Icon or Product Grid */}
      <Container maxWidth="xl" sx={{ mt: 5 }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
            }}
          >
            <CircularProgress
              sx={{
                color: '#FFD700',
              }}
              size={60}
            />
          </Box>
        ) : (
          <>
          <Grid container spacing={0} sx={{ mx: -1 }}>
            {displayedProducts.map((product, index) => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={index} sx={{ p: 1 }}>
                <Card
                  sx={{
                    height: '100%',
                    maxWidth: 250,
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                    boxShadow: 3,
                    borderRadius: 1,
                    position: 'relative',
                  }}
                >
                  <Link
                    to={`/${product.productName}/${product.productId}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <CardMedia
                      component="img"
                      sx={{
                        aspectRatio: '1 / 1',
                        objectFit: 'cover',
                      }}
                      image={
                        product.image
                          ? `data:image/jpeg;base64,${product.image}`
                          : '/images/placeholder.png'
                      }
                      alt={product.productName || 'Product Image'}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {product.productName || 'Unnamed Product'}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {product.productDescription || 'No description available'}
                      </Typography>
                    </CardContent>
                    <CardActions
                      sx={{
                        justifyContent: 'space-between',
                        padding: '8px 16px',
                      }}
                    >
                      <Typography variant="h6" sx={{ color: '#800000' }}>
                        P{product.productPrice}
                      </Typography>
                    </CardActions>
                  </Link>
                  {/* Profile Picture and Name */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      zIndex: 1,
                    }}
                  >
                    <Avatar
                      src={product.seller?.image ? `data:image/jpeg;base64,${product.seller.image}` : '/images/default-avatar.png'}
                      alt={product.sellerName || 'Seller'}
                      sx={{
                        width: 40,
                        height: 40,
                        border: '2px solid #FFD700',
                        cursor: 'pointer',
                        zIndex: 3, // Ensure it's above the name box
                        '&:hover': {
                          transform: 'scale(1.1)',
                        },
                      }}
                      onClick={() => navigate(`/ViewProfile/${product.seller.firstname}.${product.seller.lastname}/${product.sellerid}`)}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 48, // Position it to the right of the avatar
                        backgroundColor: '#800000', // Maroon background
                        color: '#fff', // White text
                        padding: '4px 8px',
                        borderRadius: '0 4px 4px 0',
                        opacity: 0,
                        transition: 'opacity 0.3s ease-in-out',
                        border: '1px solid #FFD700', // Gold border
                        '.MuiAvatar-root:hover + &, &:hover': {
                          opacity: 1,
                        },
                        whiteSpace: 'nowrap', // Prevent line breaks in the name
                        zIndex: 2, // Ensure it's above the card content
                      }}
                    >
                      <Typography variant="caption">
                        {product.seller ? `${product.seller.firstname} ${product.seller.lastname}` : 'Unknown Seller'}
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
            {visibleCount < products.length && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button variant="contained" onClick={loadMoreProducts}>
                  See More
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default HomePage;
