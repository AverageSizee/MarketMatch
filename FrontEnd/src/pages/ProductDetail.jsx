import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Avatar } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; // Custom CSS
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

export default function ProductLayout() {
    const [products, setProducts] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const { productId } = useParams();
    const navigate = useNavigate();

    // New state for dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");

    useEffect(() => {
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
            console.error(`Error fetching seller details for userId ${userId}`, error);
            return null; // Return null if there's an error
          }
        };
      
        const fetchProductDetails = async () => {
          try {
            // Fetch the current product details
            const productResponse = await axios.get(`http://localhost:8080/api/user/getProducts/${productId}`, {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + sessionStorage.getItem('token'),
              },
            });
      
            const product = productResponse.data;
      
            // Fetch the seller details for the product
            const seller = await fetchSellerDetails(product.sellerid);
      
            // Combine product with seller details
            const productWithSeller = { ...product, seller };
      
            setProducts(productWithSeller);
            //console.log(productWithSeller);
      
            // Fetch related products
            fetchRelatedProducts(product.productName);
          } catch (error) {
            console.error('There was an error fetching the product!', error);
          }
        };
      
        fetchProductDetails();
      }, [productId]);

    const fetchRelatedProducts = (productName) => {
        // Fetch related or random products
        axios.get(`http://localhost:8080/api/user/related?productName=${productName}&productId=${productId}`, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
        })
        .then(response => {
            setRelatedProducts(response.data);
        })
        .catch(error => {
            console.error('There was an error fetching related products!', error);
        });
    };

    const handleAddToCart = () => {
        if (products) {
            const cartId = sessionStorage.getItem("id");
            axios.post(`http://localhost:8080/api/cart/addProduct/${cartId}/${productId}`, {}, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            })
            .then(response => {
                console.log(response.data);
                setDialogMessage("Product added to cart successfully!");
                setDialogOpen(true);
            })
            .catch(error => {
                console.error("Error adding product to cart", error);
                setDialogMessage("Failed to add product to cart. Please try again.");
                setDialogOpen(true);
            });
        } else {
            console.log("Products data is not yet available. Please try again.");
            setDialogMessage("Products data is not yet available. Please try again.");
            setDialogOpen(true);
        }
    };

    const handleBuy = () => {
        if (products) {
            const payload = {
                quantity: 1, 
                orderDate: new Date().toISOString(), 
                total: parseFloat(products.productPrice),
                buyer: {
                    buyerId: sessionStorage.getItem("id"), 
                },
                product: {
                    productId: productId, 
                },
            };

            axios.post('http://localhost:8080/api/buy/create', payload, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            })
            .then(response => {
                console.log("Purchase successful:", response.data);
                setDialogMessage("Purchase successful!");
                setDialogOpen(true);
            })
            .catch(error => {
                console.error("Error during purchase:", error);
                setDialogMessage("Failed to complete the purchase. Please try again.");
                setDialogOpen(true);
            });
        } else {
            console.log("Product data is not available yet. Please wait.");
            setDialogMessage("Product data is not available yet. Please wait.");
            setDialogOpen(true);
        }
    };

    return (
        <Container maxWidth={false} disableGutters sx={{ minHeight: '100vh', padding: 0 }}>
            <Navbar />
            <Grid container direction="row" wrap="nowrap" sx={{ height: '100%', backgroundColor: '#7D0C0E', padding: 2 }}>
                <Grid item xs={12} sx={{ 
                    backgroundColor: 'white', 
                    padding: 4, 
                    borderRadius: '8px', 
                    height: '100%', 
                    width: '100%',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    {/* Product Image */}
                    {products.image ? (
                    <Box
                        sx={{
                        width: '100%',
                        paddingTop: '75%',
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                    >
                        <img
                        src={`data:image/jpeg;base64,${products.image}`}
                        alt={products.productName}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                        />
                    </Box>
                    ) : (
                    <Box
                        sx={{
                        width: '100%',
                        paddingTop: '75%',
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        }}
                    >
                        <img
                        src="/placeholder.svg"
                        alt="Placeholder"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                        />
                    </Box>
                    )}
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}
                >
                    {/* Profile Avatar and Name */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            display: 'flex', // Align items horizontally
                            alignItems: 'center', // Vertically aligns items
                            gap: 1, // Adds space between the two boxes
                            zIndex: 2,
                            flexWrap: 'wrap', // Allows for wrapping of content if needed
                        }}
                        >
                        {/* Name and 'Sold by' Box */}
                        <Box
                            sx={{
                            backgroundColor: '#800000', // Maroon background
                            color: '#fff', // White text
                            padding: '6px 12px',
                            borderRadius: '4px',
                            fontSize: '1rem', // Larger font size
                            border: '1px solid #FFD700', // Gold border
                            whiteSpace: 'nowrap', // Prevent line breaks
                            maxWidth: '200px', // Max width to ensure it doesn't break layout
                            overflow: 'hidden', // Hide overflow text
                            textOverflow: 'ellipsis', // Add ellipsis for long names
                            }}
                        >
                            <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                display: 'inline', // Keep "Sold by" and name on the same line
                            }}
                            >
                            Sold by: {' '}
                            </Typography>
                            <Typography
                            variant="caption"
                            sx={{
                                fontWeight: 'bold',
                                display: 'inline', // Keep "Sold by" and name on the same line
                            }}
                            >
                            {products.seller ? `${products.seller.firstname} ${products.seller.lastname}` : 'Unknown Seller'}
                            </Typography>
                        </Box>

                        {/* Profile Avatar Box */}
                        <Box>
                            <Avatar
                            src={products.seller?.image ? `data:image/jpeg;base64,${products.seller.image}` : '/images/default-avatar.png'}
                            alt={products.seller?.firstname || 'Creator'}
                            sx={{
                                width: 60, // Larger Avatar
                                height: 60,
                                border: '3px solid #FFD700',
                                cursor: 'pointer',
                                '&:hover': {
                                transform: 'scale(1.1)',
                                },
                            }}
                            onClick={() => navigate(`/ViewProfile/${products.seller.firstname}.${products.seller.lastname}/${products.sellerid}`)}
                            />
                        </Box>
                    </Box>

                    {/* Product Details */}
                    <div>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                        {products.productName}
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#7D0C0E', fontWeight: 'bold', marginBottom: 2 }}>
                        P{products.productPrice}
                    </Typography>
                    <Divider sx={{ margin: '20px 0', borderColor: '#e0e0e0' }} />
                    <Typography variant="body1" paragraph sx={{ marginBottom: 4 }}>
                        {products.productDescription}
                    </Typography>
                    </div>
                    <div>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleBuy}
                            sx={{
                            backgroundColor: 'black',
                            color: 'white',
                            padding: '15px',
                            '&:hover': { backgroundColor: '#333' },
                            }}
                        >
                            Buy Now
                        </Button>
                        </Grid>
                        <Grid item xs={6}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleAddToCart}
                            sx={{
                            padding: '15px',
                            borderColor: 'black',
                            color: 'black',
                            '&:hover': { backgroundColor: '#f5f5f5' },
                            }}
                        >
                            Add to Cart
                        </Button>
                        </Grid>
                    </Grid>
                    </div>
                </Grid>
                </Grid>

                    <Box sx={{ marginTop: 4 }}>
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>You might also like</Typography>
                        <Grid container spacing={2}>
                            {relatedProducts.length > 0 ? (
                                relatedProducts.map(product => (
                                    <Grid item xs={6} sm={3} key={product.productId}>
                                        <Card
                                            onClick={() => navigate(`/${product.productName}/${product.productId}`)}
                                            sx={{
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                                                },
                                            }}
                                        >
                                            <CardMedia
                                                component="div"
                                                sx={{
                                                    paddingTop: '100%',
                                                    backgroundImage: product.image ? `url(data:image/jpeg;base64,${product.image})` : 'none',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                }}
                                            />
                                            <CardContent
                                                sx={{
                                                    flexGrow: 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between',
                                                }}
                                            >
                                                <Typography variant="subtitle2">{product.productName}</Typography>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        color: '#7D0C0E',
                                                        fontWeight: 'bold',
                                                        marginTop: 1,
                                                    }}
                                                >
                                                    P{product.productPrice}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))
                            ) : (
                                <Grid item xs={12}>
                                    <Typography variant="body2" align="center">No related products available</Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Grid>
            </Grid>

            {/* New Dialog component */}
            <Dialog 
                open={dialogOpen} 
                onClose={() => setDialogOpen(false)}
                PaperProps={{
                    style: { 
                        backgroundColor: '#800000',
                        border: '2px solid #FFD700',
                        borderRadius: '8px',
                    },
                }}
            >
                <DialogContent>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                        <Typography variant="body1" style={{ color: '#FFD700', textAlign: 'center' }}>
                            {dialogMessage}
                        </Typography>
                        <Button 
                            onClick={() => setDialogOpen(false)} 
                            style={{ 
                                color: '#800000', 
                                backgroundColor: '#FFD700', 
                                marginTop: '1rem',
                                fontWeight: 'bold',
                                padding: '8px 16px',
                                borderRadius: '4px',
                            }}
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </Container>
    );
}

