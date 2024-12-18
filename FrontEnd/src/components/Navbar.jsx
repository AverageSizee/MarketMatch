import React , { useState , useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useAuth } from './AuthContext';
import TermsAgreementDialog from './TermsAgreementDialog';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Use Link from react-router-dom
import '../App.css'; // Custom CSS

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isSeller, setIsSeller] = useState();
    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8080/api/user/getUserbyId', {
          params: { id: sessionStorage.getItem('id') },
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
          },
        })
          .then(response => {
            setIsSeller(response.data.seller);
          })
          .catch(error => {
            console.error('Error fetching user data!', error);
          });
      }, []);
    

    const logoutUser = () => {
        logout();
        navigate('/');
    };

    const handleLogoClick = () => {
        navigate('/home'); 
      };

    const handleLinkClick = (event) => {
        event.preventDefault(); 
        
        
        if (isSeller) {
            navigate('/sell-product');
        } else {
            setDialogOpen(true);  
        }
      };
    
     
      const handleCloseDialog = () => {
        setDialogOpen(false);
      };
      
      const makeUserSeller = async () => {
        try {
          const response = await fetch('http://localhost:8080/api/user/'+sessionStorage.getItem('id')+'/make-seller', {
            method: 'PUT', // Assuming the endpoint uses PUT method
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
            },
          });
    
          if (response.ok) {
            console.log('User is now a seller');
            return true;
          } else {
            console.error('Failed to update user as seller');
            return false;
          }
        } catch (error) {
          console.error('Error occurred while updating user as seller:', error);
          return false;
        }
      };
      const handleAgree = async () => {
        const success = await makeUserSeller();
        if (success) {
          setDialogOpen(false); // Close the dialog
          navigate('/sell-product'); // Navigate to the upload product page
        } else {
          // Handle failure if needed (e.g., show an error message)
          alert('Could not make you a seller. Please try again later.');
        }
      };

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: 'none' }}>
            <Toolbar>
                <Grid container alignItems="center" justifyContent="space-between">
                    {/* CIT University logo */}
                    <Grid item>
                        <a >
                            <img src="/images/cit-logo.png" alt="Logo" style={{ height: '60px' }} onClick={handleLogoClick} />
                        </a>
                    </Grid>

                    {/* Navigation Links aligned to the right */}
                    <Grid item>
                        <Grid container alignItems="center" justifyContent="flex-end">
                            <Link to="/home" style={{ textDecoration: 'none', marginRight: '1.5rem' }}>
                                <Typography variant="h6" sx={{ color: 'black' }}>Home</Typography>
                            </Link>
                            <Link to="/my-account" style={{ textDecoration: 'none', marginRight: '1.5rem' }}>
                                <Typography variant="h6" sx={{ color: 'black' }}>My Account</Typography>
                            </Link>
                            <Link to="/sell-product" onClick={handleLinkClick} style={{ textDecoration: 'none', marginRight: '1.5rem' }}>
                                <Typography variant="h6" sx={{ color: 'black' }}>Sell Product</Typography>
                            </Link>

                            {/* Terms Agreement Dialog */}
                            <TermsAgreementDialog
                                open={dialogOpen}
                                onClose={handleCloseDialog}
                                onAgree={handleAgree}
                            />
                            <Link to="/cart" style={{ textDecoration: 'none', marginRight: '1.5rem' }}>
                                <Typography variant="h6" sx={{ color: 'black' }}>My Cart</Typography>
                            </Link>
                            {/* <Link to="/product-detail/1" style={{ textDecoration: 'none', marginRight: '1.5rem' }}>
                                <Typography variant="h6" sx={{ color: 'black' }}>Buy Product</Typography>
                            </Link> */}
                            {isAuthenticated ? (
                                <Typography
                                    onClick={logoutUser}
                                    variant="h6"
                                    sx={{ color: 'black', cursor: 'pointer', marginRight: '1.5rem' }}
                                >
                                    Logout
                                </Typography>
                            ) : (
                                <Link to="/login" style={{ textDecoration: 'none', marginRight: '1.5rem' }}>
                                    <Typography variant="h6" sx={{ color: 'black' }}>Login</Typography>
                                </Link>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
}
