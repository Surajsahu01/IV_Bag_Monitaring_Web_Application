import { Alert, Snackbar } from '@mui/material';
import React, { createContext, useCallback, useContext, useState } from 'react'

const SnackbarContext = createContext();

export const useSnackbar = () => useContext(SnackbarContext);

export const SnakbarProvider = ({ children }) => {
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'info'
    
    });

    const showSnackbar = useCallback((message, severity = 'info') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar}}>
            {children}
            <Snackbar
            open={snackbar.open}
            autoHideDuration={2000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>

            </Snackbar>
        </SnackbarContext.Provider>
    );
};