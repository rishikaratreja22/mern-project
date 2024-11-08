import { Box, Button, Dialog, FormLabel, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Link } from 'react-router-dom';

const labelStyle = {mt: 1, mb: 1};
const AuthForm = ({onSubmit, isAdmin}) => {
  const [inputs, setInputs] = useState({
    name : "",
    email : "",
    password : "",
  });
  const [isSignUp, setIsSignUp] = useState(false);
  //----------------------------------------------------
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name] : e.target.value 
    }));
  };
  //----------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(inputs);
    onSubmit({inputs, signup : isAdmin ? false : isSignUp});
  };
  //----------------------------------------------------------
  return (
    <Dialog PaperProps={{ style : {borderRadius : 20}}} open={true}>
        <Box sx={{ml: "auto", padding: 1}}>
          <IconButton LinkComponent={Link} to="/">
            <CloseRoundedIcon/>
          </IconButton>
        </Box>
        <Typography variant='h4' textAlign={'center'}>
          {isSignUp ? "Signup" : "Login"}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box padding={6} display={"flex"} flexDirection="column" width={400} margin="auto" alignContent="center">
            {!isAdmin && isSignUp && 
              <>
                {" "}
                <FormLabel sx={labelStyle} >Name</FormLabel>
                <TextField value={inputs.name} onChange={handleChange} margin="normal" variant="standard" type={"text"} name="name" />
              </>
            }           
            <FormLabel sx={labelStyle} >Email</FormLabel>
            <TextField value={inputs.email} onChange={handleChange} margin="normal" variant="standard" type={"email"} name="email" /> 
            <FormLabel sx={labelStyle} >Password</FormLabel>
            <TextField value={inputs.password} onChange={handleChange} margin="normal" variant="standard" type={'password'} name="password" />
            
          <Button type='submit' fullWidth sx={{mt: 2, borderRadius: 10, bgcolor: "#2b2d42"}} variant='contained'>
            {isSignUp ? "Signup" : "Login"}
          </Button>
          {!isAdmin && <Button onClick={()=>setIsSignUp(!isSignUp)} fullWidth sx={{mt: 2, borderRadius: 10}}>
            Switch To {isSignUp ? "Login" : "Signup"}
          </Button> }
          </Box>
        </form>
    </Dialog> 
  );
};

export default AuthForm;

