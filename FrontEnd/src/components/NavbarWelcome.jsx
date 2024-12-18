import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, Dialog, DialogContent, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../components/AuthContext';
import CloseIcon from '@mui/icons-material/Close';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#800000', // Maroon
    },
    secondary: {
      main: '#FFD700', // Gold
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h6: {
      fontWeight: 700,
    },
    body1: {
      fontWeight: 500,
    },
  },
});

export default function NavbarWelcome() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        address: '',
        phonenumber: '',
        studentid: '',
        email: '',
        password: '',
    });
    const [openLogin, setOpenLogin] = React.useState(false);
    const [openSignup, setOpenSignup] = React.useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [showError, setShowError] = useState({
        studentIdFormat: false,
        studentIdExists: false,
        phoneNumberFormat: false,
        isCitEmail: false,
        emailExists: false,
        passwordFormat: 'weak',
    });
    const { login } = useAuth();
    const [input, setInput] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleOpenLogin = () => {
        setOpenLogin(true);
        setError('');  
      };
    const handleCloseLogin = () => setOpenLogin(false);
    const handleOpenSignup = () => setOpenSignup(true);
    const handleCloseSignup = () => setOpenSignup(false);

    const studentIdRegex = /^\d{2}-\d{4}-\d{2}$/;

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prev) => !prev);
    };

    const isFormComplete = () => {
        return Object.values(formData).every((field) => field.trim() !== '');
    };

    const handleChange = async(e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === 'studentid') {
            const isValidFormat = validateStudentId(value);
            setShowError((prevErrors) => ({
                ...prevErrors,
                studentIdFormat: !isValidFormat,
            }));
            if (isValidFormat) {
                await checkStudentIdExists(value);
            }
        }else if (name === 'phonenumber') {
            const isValidPhone = validatePhoneNumber(value);
            setShowError((prevErrors) => ({
                ...prevErrors,
                phoneNumberFormat: !isValidPhone,
            }));
        }else if (name === 'email') {
            const isValidEmail = validateCitEmail(value);
            setShowError((prevErrors) => ({
                ...prevErrors,
                isCitEmail: !isValidEmail,
            }));
            if (isValidEmail) {
                await checkEmailExists(value);
            }
        }else if (name === 'password') {
            setShowError((prevErrors) => ({
                ...prevErrors,
                passwordFormat: checkPasswordStrength(value),
            }));
        }
        //console.log(showError);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(formData);
        if (isFormComplete()&&!showError.studentIdFormat&&!showError.studentIdExists
        &&!showError.phoneNumberFormat&&!showError.isCitEmail&&showError.passwordFormat!=='weak') {
            setIsLoading(true);
            try {
                const response = await fetch('http://localhost:8080/api/user/postUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
    
                if (response.ok) {
                    const data = await response.json();
                    const userId = data.userId;
                    console.log('Form submitted:', data);
                    
                    // Create Cart Payload
                    const cartPayload = {
                        dateAdded: new Date().toISOString(),
                        quantity: 0,
                        user: { userId: userId },
                    };
                    console.log(cartPayload);
                    await axios.post(
                        `http://localhost:8080/api/cart/postCart/` + userId,
                        cartPayload,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
    
                    // Create Seller Data Payload
                    const SellerData = {
                        products_sold: 0,
                        userid: { userId: userId },
                    };
                    console.log(SellerData);
                    await axios.post(
                        `http://localhost:8080/api/seller/postSeller/` + userId,
                        SellerData,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
    
                    // Create Buyer Data Payload
                    const BuyerData = {
                        totalTransaction: 0,
                        user: { userId: userId },
                    };
                    console.log(BuyerData);
                    await axios.post(
                        `http://localhost:8080/api/buyers/postBuyer/` + userId,
                        BuyerData,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
    
                    // Clear form data and session storage
                    setFormData({
                        firstname: '',
                        lastname: '',
                        address: '',
                        phonenumber: '',
                        studentid: '',
                        email: '',
                        password: '',
                    });
                    localStorage.removeItem('signupData');
    
                    // Popup and redirect logic
                    handleCloseSignup();
                    setSuccessMessage('Signup successful! Please proceed to login.');
                    setIsSuccess(true);
                    setTimeout(() => {
                        setIsSuccess(false);
                        handleOpenLogin();
                    }, 2000);
                } else {
                    throw new Error('Failed to sign up');
                }
            } catch (error) {
                console.error('Error:', error);
                setError('An error occurred. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else if(showError.studentIdFormat){
            setError('Please enter a valid student ID in the format XX-XXXX-XX.');
        }else if(showError.studentIdExists){
            setError('Student ID already exists.');
        }else if(showError.phoneNumberFormat){
            setError('Please enter a valid phone number.');
        }else if(showError.isCitEmail){
            setError('Please enter a valid CIT email.');
        }else if(showError.passwordFormat==='weak'){
            setError('Please enter a strong password.');
        }
        else {
            setError('Please fill in all fields before proceeding.');
            //console.log(formData)
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log(input);
        setError('');
        setIsLoading(true);
        try {
            const response = await login(input);
            if (response) {
                setError(response);
            } else {
                setSuccessMessage('Login Successful!');
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    navigate('/home');
                }, 2000);
            }
        } catch (error) {
            setError("Invalid email or password");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInput = (e) => {
        const { name, value } = e.target;

        setInput((prevInput) => ({
            ...prevInput,
            [name]: value
        }));
    };

    const validateStudentId = (id) => {
      const idFormat = /^\d{2}-\d{4}-\d{3}$/; // Regex for ##-####-###
      if (id === '') return true;
      return idFormat.test(id);
    };

    // Check Student ID in Database
    const checkStudentIdExists = async (id) => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/check-student-id', { studentId: id });
            setShowError((prevErrors) => ({
                ...prevErrors,
                studentIdExists: response.data.exists,
            }));
            //console.log(response.data.exists);
        } catch (error) {
            console.error('Error checking student ID:', error);
        }
    };

    const checkEmailExists = async (email) => {
        try {
            // Send a POST request to check if the email exists
            const response = await axios.post('http://localhost:8080/api/user/check-email', { email: email });
    
            // Update the state to show if the email exists
            setShowError((prevErrors) => ({
                ...prevErrors,
                emailExists: response.data.exists, 
            }));
    
            // Optionally log the result for debugging
            console.log('Email exists:', response.data.exists);
        } catch (error) {
            console.error('Error checking email:', error);
        }
    };

    const checkPasswordStrength = (password) => {
        // Define regular expressions for different password criteria
        const hasCapitalLetter = /[A-Z]/; // At least one uppercase letter
        const hasUniqueCharacter = /[^a-zA-Z0-9]/; // At least one non-alphanumeric character
        const hasLettersAndNumbers = /^[a-zA-Z0-9]+$/; // Only letters and numbers
        if(password === '') return '';
    
        if (hasUniqueCharacter.test(password)) {
            return 'Strong'; 
        } else if (hasCapitalLetter.test(password)) {
            return 'Mid'; 
        } else if (hasLettersAndNumbers.test(password)) {
            return 'Weak'; 
        } else {
            return 'Weak'; 
        }
    };

    const validatePhoneNumber = (number) => {
        const phoneRegex = /^\d{11}$/;
        if (number === '') return true;
        return phoneRegex.test(number);
      };
      
      const validateCitEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@cit\.edu$/;
        if (email === '') return true;
        return emailRegex.test(email);
      };

      const getIconColor = () => {
        if (showError.passwordFormat === 'Weak') return 'red';
        if (showError.passwordFormat === 'Mid') return 'gold';
        if (showError.passwordFormat === 'Strong') return 'green';
        return 'grey'; // Default color
    };

    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" sx={styles.appBar}>
                <Toolbar>
                    <Grid container alignItems="center">
                        <Grid item xs={6}>
                            <a>
                                <img
                                    src="/images/cit-logo.png"
                                    alt="Logo"
                                    style={styles.logo}
                                />
                            </a>
                        </Grid>

                        <Grid item xs={6} style={styles.buttonContainer}>
                            <div style={styles.buttonWrapper}>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleOpenSignup}
                                    sx={styles.button}
                                >
                                    Sign Up
                                </Button>

                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleOpenLogin}
                                    sx={styles.button}
                                >
                                    Log In
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </Toolbar>

                {/* Sign Up Modal */}
                <Modal open={openSignup} onClose={handleCloseSignup}>
                    <Box sx={styles.modal}>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseSignup}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: 'grey.500',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>

                        <h2 className="signup-title" style={styles.textstyle}>Sign up</h2>

                        <div className='signupbox' style={{width: '100%', maxWidth: '300px', padding: '0 20px', boxSizing: 'border-box', marginLeft: '45px'}}>
                            <form className="signup-form" onSubmit={handleSubmit} >
                                <div style={{ position: 'relative', width: '100%' }}>
                                <input
                                    type="text"
                                    name="studentid"
                                    placeholder="Student ID no."
                                    className="signup-input"
                                    value={formData.studentid}
                                    style={{
                                      ...styles.input,
                                      borderColor: showError.studentIdFormat ? 'red' : '#ccc',
                                    }}
                                    onChange={handleChange}
                                />
                                {(showError.studentIdFormat || showError.studentIdExists) && (
                                    <ErrorOutlineIcon
                                        style={{
                                            position: 'absolute',
                                            right: '-35px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: 'gold',
                                        }}
                                        titleAccess={showError.studentIdFormat ? "Invalid format. Use ##-####-###" : "Student ID already exists"}
                                    />
                                )}
                                </div>
                                <input
                                    type="text"
                                    name="firstname"
                                    placeholder="First Name"
                                    className="signup-input"
                                    value={formData.firstname}
                                    style={styles.input}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="lastname"
                                    placeholder="Last Name"
                                    className="signup-input"
                                    value={formData.lastname}
                                    style={styles.input}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Address"
                                    className="signup-input"
                                    value={formData.address}
                                    style={styles.input}
                                    onChange={handleChange}
                                />
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <input
                                        type="text"
                                        name="phonenumber"
                                        placeholder="Phone Number"
                                        className="signup-input"
                                        value={formData.phonenumber}
                                        style={{
                                            ...styles.input,
                                            borderColor: showError.phoneNumberFormat ? 'red' : '#ccc',
                                        }}
                                        onChange={handleChange}
                                    />
                                    {showError.phoneNumberFormat && (
                                        <ErrorOutlineIcon
                                            style={{
                                                position: 'absolute',
                                                right: '-35px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'gold',
                                            }}
                                            titleAccess="Invalid phone number. Must be 11 digits."
                                        />
                                    )}
                                </div>
                                <div style={{ position: 'relative', width: '100%' }}>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Institutional Email"
                                        className="signup-input"
                                        value={formData.email}
                                        style={{
                                            ...styles.input,
                                            borderColor: showError.isCitEmail ? 'red' : '#ccc',
                                        }}
                                        onChange={handleChange}
                                    />
                                    {(showError.isCitEmail || showError.emailExists) && (
                                        <ErrorOutlineIcon
                                            style={{
                                                position: 'absolute',
                                                right: '-35px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: 'gold',
                                            }}
                                            titleAccess={showError.isCitEmail ? "Invalid format. Use example@cit.edu" : "Email already exists"}
                                        />
                                    )}
                                </div>
                                <div className="password-container" >
                                    <input
                                        type={isPasswordVisible ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Password"
                                        className="signup-input password-input"
                                        value={formData.password}
                                        style={styles.passwordinput}
                                        onChange={handleChange}
                                    />
                                    <IconButton onClick={togglePasswordVisibility} className="visibility-icon" style={{right:45, top:'1px'}}>
                                        {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                    {formData.password && (
                                        <ErrorOutlineIcon
                                            style={{
                                                position: 'absolute',
                                                right: '-35px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                color: getIconColor(), // Dynamic color based on strength
                                            }}
                                            titleAccess={`Password Strength: ${showError.passwordFormat}`}
                                        />
                                    )}
                                </div>
                                {error && <p style={{ color: 'gold' }}>{error}</p>}
                                <button type="submit" className="signup-button">
                                    SIGN UP
                                </button>

                                <br />
                                <span style={{ color: 'gold' }}>Already have an account?</span>
                                <span
                                    onClick={() => {
                                        handleOpenLogin();
                                        handleCloseSignup();
                                    }}
                                    style={{ color: 'gold', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {' '}
                                    Log in Here
                                </span>
                            </form>
                        </div>
                    </Box>
                </Modal>

                {/* Log In Modal */}
                <Modal open={openLogin} onClose={handleCloseLogin}>
                    <Box sx={styles.modal}>
                        <IconButton
                            aria-label="close"
                            onClick={handleCloseLogin}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: 'grey.500',
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <h2 className="login-title" style={styles.textstyle}>Log in</h2>
                        <div className='formdiv' style={styles.forms}>
                            <form>
                                <input
                                    type="text"
                                    placeholder="Email"
                                    className="login-input"
                                    name="email"
                                    onChange={handleInput}
                                    style={styles.input}
                                />
                                <div className="password-container-login" style={styles.passwordContainerLogin}>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        className="login-input"
                                        name="password"
                                        onChange={handleInput}
                                        style={styles.input}
                                    />
                                    <span
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={styles.icon}
                                    >
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </span>
                                </div>

                                <button type="submit" className="login-button" onClick={handleLogin} style={styles.loginButton}>
                                    LOGIN
                                </button>

                                <span style={{ color: 'gold', marginLeft:30}}>Don't have an account?</span>
                                <span
                                    onClick={() => {
                                        handleOpenSignup();
                                        handleCloseLogin();
                                    }}
                                    style={{ color: 'gold', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                    {' '}
                                    Register here
                                </span>
                                
                                {error && (
                                    <Typography variant="body2" color="error" align="center">
                                        {error}
                                    </Typography>
                                )}
                            </form>
                        </div>
                    </Box>
                </Modal>

                {/* Loading Dialog */}
                <Dialog 
                    open={isLoading} 
                    disableEscapeKeyDown 
                    PaperProps={{
                        style: { backgroundColor: '#800000', border: '2px solid #FFD700' },
                    }}
                >
                    <DialogContent>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                            <CircularProgress style={{ color: 'white' }} />
                            <Typography variant="body1" style={{ marginTop: '1rem', color: 'white' }}>
                                Processing...
                            </Typography>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Success Dialog */}
                <Dialog 
                    open={isSuccess} 
                    disableEscapeKeyDown
                    PaperProps={{
                        style: { backgroundColor: '#800000', border: '2px solid #FFD700' },
                    }}
                >
                    <DialogContent>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                            <Typography variant="h6" style={{ color: 'white' }}>
                                {successMessage}
                            </Typography>
                        </div>
                    </DialogContent>
                </Dialog>
            </AppBar>
        </ThemeProvider>
    );
}

const styles = {
    appBar: {
        backgroundColor: 'white',
        boxShadow: 'none',
    },
    logo: {
        height: '60px',
        marginLeft: '-600px',
        cursor: 'pointer',
    },
    buttonContainer: {
        textAlign: 'right',
    },
    buttonWrapper: {
        display: 'inline-flex',
        gap: '10px',
    },
    button: {
        fontWeight: 'bold',
        padding: '10px 10px',
        borderRadius: '50px',
        backgroundColor: '#641616',
        transition: 'all 0.3s ease',
        color: 'white',
    },
    modal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'maroon',
        padding: '20px',
        borderRadius: '4px',
        boxShadow: 24,
        width: '80%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
    },
    input: {
        width: '90%', 
        padding: '12px', 
        margin: '10px 0px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        backgroundColor:'white'
    },
    loginButton: {
        width: '95%',
        padding: '12px',
        backgroundColor: '#641616',
        borderRadius: '4px',
        border: 'none',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    icon: {
        cursor: 'pointer',
        position: 'absolute', 
        left: 260,        
        top: '55%',           
        transform: 'translateY(-50%)', 
        color: 'gray',
    },
    textstyle: {
        color: 'white',
        textAlign: 'center',
    },
    passwordContainerLogin: {
        position: 'relative', 
        display: 'flex',
        alignItems: 'center',
    },
    forms:{
        width:300
    },
    passwordinput:{
        width:190, 
        padding: '12px', 
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
        backgroundColor:'white',
    },
    errorIcon: {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'red',
    },
};

