import React, { useEffect, useState, useMemo } from 'react';
import { AppBar, Toolbar, Box, Autocomplete, TextField, Tabs, Tab, IconButton } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import { getAllMovies } from '../api-helpers/api-helpers.js';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch,  useSelector } from 'react-redux';
import { adminActions, userActions } from '../store/index.js';


const Header = () => {
    const isAdminLoggedIn = useSelector((state) => state.admin.isLoggedIn);
    const isUserLoggedIn = useSelector((state) => state.user.isLoggedIn);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const tabs = useMemo(() => [
        { label: 'Movies', to: '/movies' },
        ...(isUserLoggedIn || isAdminLoggedIn 
            ? []
            : [
                { label: 'Admin', to: '/admin' },
                { label: 'Auth', to: '/auth' },
            ]),
    ], [isUserLoggedIn, isAdminLoggedIn]);

    const userTabs = useMemo(() => (
        isUserLoggedIn
        ? [
            { label: 'Profile', to: '/user' },
            { label: 'Logout', to: '/' }
        ]
        : []
    ), [isUserLoggedIn]);

    const adminTabs = useMemo(() => (
        isAdminLoggedIn
        ? [
            { label: 'Add Movie', to: '/add' },
            { label: 'Profile', to: '/user-admin' },
            { label: 'Logout', to: '/' }
        ]
        : []
    ), [isAdminLoggedIn]);

    const handleLogout = (isAdmin) => {
        if (isAdmin) {
            dispatch(adminActions.logout()); // Dispatch admin logout action
        } else {
            dispatch(userActions.logout()); // Dispatch user logout action
        }
        navigate('/'); // Redirect to home page or login page
    };
    // Debugging: Log state values and tabs array
    // console.log("isAdminLoggedIn:", isAdminLoggedIn);
    // console.log("isUserLoggedIn:", isUserLoggedIn);
    // console.log("Tabs array:", tabs); 

    const [value, setValue] = useState();
    const [movies, setMovies] = useState([]);
    
    // const handleChange = (e, val) => {
        
    //     const movie = movies.find((m) => m.title === val);
    //     if(isUserLoggedIn){
    //         navigate(`/booking/${movie._id}`);
    //     }
    // };
    useEffect(() => {
        getAllMovies().then((data) => setMovies(data.movies)).catch((err) => console.log(err));
    }, []);
    return (
        <div>
            <AppBar position="sticky" sx={{ bgcolor: "#2b2d42" }}>
                <Toolbar>
                    <Box width={'20%'}>
                        <IconButton LinkComponent={Link} to="/">
                            <MovieIcon />
                        </IconButton>
                    </Box>
                    <Box width={'30%'} margin={'auto'}>
                        <Autocomplete
                            // onChange={handleChange}
                            freeSolo
                            options={movies && movies.map((option) => option.title)}
                            renderInput={(params) => <TextField sx={{ input: { color: "white " } }} variant="standard" {...params} placeholder="Search Across Multiple Movies" />}
                        />
                    </Box>
                    <Box display={'flex'}>
                        <Tabs
                            textColor="inherit"
                            indicatorColor="secondary"
                            value={value}
                            onChange={(e, val) => setValue(val)}
                        >
                            {tabs.map((tab, index) => (
                                <Tab key={index} label={tab.label} LinkComponent={Link} to={tab.to} />
                            ))}
                            {userTabs.map((tab, index) => (
                                <Tab key={index} label={tab.label} onClick={tab.label === 'Logout' ? () => handleLogout(isAdminLoggedIn) : undefined}
                                component={tab.label === 'Logout' ? 'div' : Link}
                                to={tab.to} />
                            ))}
                            {adminTabs.map((tab, index) => (
                                <Tab key={index} label={tab.label} onClick={tab.label === 'Logout' ? () => handleLogout(isAdminLoggedIn) : undefined}
                                component={tab.label === 'Logout' ? 'div' : Link}
                                to={tab.to} />
                            ))}
                        </Tabs>
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default Header;
