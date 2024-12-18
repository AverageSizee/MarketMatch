import React, { useEffect, useState } from 'react';
import { Container, Grid, Typography, Box, Paper, Button, TextField, FormControlLabel, Switch, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Navbar from '../components/Navbar';
import SideBar from '../components/SideBar';
import axios from 'axios';
import '../App.css';

export default function MyProducts() {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);   

    const sellerId = sessionStorage.getItem('id');

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/seller/getAll/${sellerId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            })
            .then((response) => {
                setProducts(response.data.products || []);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    }, [sellerId]);

    const handleEdit = (productId) => {
        const product = products.find((p) => p.productId === productId);
        setCurrentProduct(product);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setCurrentProduct(null);
    };

    const handleChange = (e) => {
        const { name, value, checked } = e.target;
        if (name === "productStatus") {
            setCurrentProduct((prev) => ({ ...prev, [name]: checked ? "Available" : "No Stock" }));
        } else {
            setCurrentProduct((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSave = () => {
        if (!currentProduct) {
            console.error('No product selected for update');
            return;
        }
    
        const updatedProduct = {
            productId: currentProduct.productId,
            productName: currentProduct.productName,
            productPrice: currentProduct.productPrice,
            productDescription: currentProduct.productDescription,
            productStock: currentProduct.productStock,
            productStatus: currentProduct.productStatus,
            productTimeCreated: currentProduct.productTimeCreated,
            image: currentProduct.image,
        };
        
        axios
            .put(`http://localhost:8080/api/user/putProduct/${currentProduct.productId}`, updatedProduct, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            })
            .then((response) => {
                console.log('Product updated successfully:', response.data);
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.productId === currentProduct.productId ? { ...product, ...updatedProduct } : product
                    )
                );
                handleClose();
            })
            .catch((error) => {
                console.error('Error updating product:', error.response?.data || error);
            });
    };

    const handleDeleteOpen = (productId) => {
        setDeleteProductId(productId);
        setOpenDeleteDialog(true);
    };

    const handleDeleteClose = () => {
        setOpenDeleteDialog(false);
        setDeleteProductId(null);
    };

    const handleDeleteConfirm = () => {
        axios
            .delete(`http://localhost:8080/api/user/deleteProduct/${deleteProductId}`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                },
            })
            .then((response) => {
                setProducts((prevProducts) =>
                    prevProducts.filter((product) => product.productId !== deleteProductId)
                );
                handleDeleteClose();
                console.log('Product deleted successfully:', response.data);
            })
            .catch((error) => {
                console.error('Error deleting product:', error.response?.data || error);
                handleDeleteClose();
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
                                My Products
                            </Typography>
                            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2, maxHeight: 'calc(100vh - 250px)' }}>
                                {products.length > 0 ? (
                                    products.map((product) => (
                                        <ProductItem key={product.productId} product={product} handleEdit={handleEdit} handleDeleteOpen={handleDeleteOpen} />
                                    ))
                                ) : (
                                    <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>No products found.</Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <Box sx={{ padding: 3 }}>
                    <Typography variant="h6" mb={2}>
                        Edit Product
                    </Typography>
                    <Box sx={{ textAlign: 'center', marginTop: 1 }}>
                        <IconButton
                            color="primary"
                            aria-label="upload image"
                            component="label"
                            sx={{
                                position: 'relative',
                                display: 'inline-block',
                                width: 200,
                                height: 200,
                                borderRadius: 2,
                                overflow: 'hidden',
                                backgroundColor: currentProduct?.image ? 'transparent' : '#f0f0f0',
                                border: currentProduct?.image ? 'none' : '1px dashed #ccc',
                            }}
                        >
                            {currentProduct?.image ? (
                                <Box
                                    component="img"
                                    src={`data:image/jpeg;base64,${currentProduct.image}`}
                                    alt="Uploaded"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            ) : (
                                <>
                                    <CloudUploadIcon sx={{ fontSize: 50, color: '#ccc' }} />
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        Upload an image
                                    </Typography>
                                </>
                            )}
                            <input
                                hidden
                                accept="image/*"
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = () => {
                                            const imageData = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');
                                            setCurrentProduct((prev) => ({
                                                ...prev,
                                                image: imageData,
                                            }));
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                            />
                        </IconButton>
                    </Box>

                    <TextField
                        fullWidth
                        margin="normal"
                        label="Product Name"
                        name="productName"
                        value={currentProduct?.productName || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Product Price"
                        name="productPrice"
                        value={currentProduct?.productPrice || ''}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Product Description"
                        name="productDescription"
                        value={currentProduct?.productDescription || ''}
                        onChange={handleChange}
                        multiline
                        rows={3}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Product Stock"
                        name="productStock"
                        value={currentProduct?.productStock || ''}
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={currentProduct?.productStatus === "Available"}
                                onChange={handleChange}
                                name="productStatus"
                            />
                        }
                        label={currentProduct?.productStatus === "Available" ? "Available" : "No Stock"}
                    />
                    <Box mt={3} display="flex" justifyContent="space-between">
                        <Button variant="outlined" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Dialog>

            <Dialog
                open={openDeleteDialog}
                onClose={handleDeleteClose}
                maxWidth="sm"
                fullWidth
                sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    backdropFilter: 'blur(5px)',
                    zIndex: 1000,
                }}
            >
                <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                    Delete Product
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ textAlign: 'center' }}>
                        Are you sure you want to delete this product? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

function ProductItem({ product, handleEdit, handleDeleteOpen }) {
    return (
        <Grid
            container
            sx={{
                border: '1px solid black',
                borderRadius: 2,
                padding: 2,
                marginBottom: 2,
                backgroundColor: '#f9f9f9',
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Grid
                item
                xs={12}
                md={2}
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box
                    component="img"
                    src={
                        product.image
                            ? `data:image/jpeg;base64,${product.image}`
                            : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                    }
                    alt={product.productName}
                    sx={{
                        width: '100px',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: 1,
                    }}
                />
            </Grid>

            <Grid
                item
                xs={12}
                md={7}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingLeft: 2,
                }}
            >
                <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    {product.productName}
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 1 }}>
                    Price: ${parseFloat(product.productPrice).toFixed(2)}
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray' }}>
                    Status: {product.productStatus}
                </Typography>
            </Grid>

            <Grid
                item
                xs={12}
                md={3}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'row', md: 'column' },
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    gap: 1,
                    mt: { xs: 2, md: 0 },
                }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        backgroundColor: 'black',
                        color: 'white',
                        width: '100px',
                    }}
                    onClick={() => handleEdit(product.productId)}
                >
                    EDIT
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    sx={{
                        backgroundColor: 'red',
                        color: 'white',
                        width: '100px',
                    }}
                    onClick={() => handleDeleteOpen(product.productId)}
                >
                    DELETE
                </Button>
            </Grid>
        </Grid>
    );
}

