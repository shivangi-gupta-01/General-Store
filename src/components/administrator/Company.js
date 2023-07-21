import React, { useState } from "react";
import { Select,MenuItem,Avatar, TextField, Button, Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material"
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useStyles } from './CompanyCss';


export default function Company(props) {
    const [showPassword, setShowPassword] = useState(false);
    const [state,setState]=useState('')
    const [city,setCity]=useState('')
    const [comapnyName,setComapanyName]=useState('')
    const [ownerName,setOwnerName]=useState('')
    const [emailAddress,setEmailAddress]=useState('')
    const [mobileNumber,setMobileNumber]=useState('')
    const [companyLogo, setCompanyLogo] = useState({ filename: '/assets/water.png', bytes: '' })
    var classes = useStyles()
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleImage = (event) => {
        setCompanyLogo({ filename: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
    }
    return (
        <div className={classes.maincontainer}>
            <div className={classes.box}>

                <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.rowStyle}>
                        <div><img src="/assets/logo.png" width="40" /></div>
                        <div className={classes.headingStyle}>Company registration</div>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Company Name" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth label="Owner Name" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth label="Email address" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth label="Mobile Number" variant="outlined" />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth label="Address" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">State</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={state}
                                label="State"
                            // onChange={handleChange}
                            >
                                <MenuItem value={'Choose State...'}>Choose State...</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">City</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={city}
                                label="City"
                                // onChange={handleChange}
                            >
                                <MenuItem value={'Choose City...'}>Choose City...</MenuItem>
                                
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} className={classes.rowStyle}>
                        <IconButton fullWidth color="primary" arial-label="Upload Picture" component="label">
                            <input hidden accept="image/*" type="file" onChange={handleImage} />
                            <PhotoCamera />
                            <Avatar
                                alt="Remy Sharp"
                                varient="rounded"
                                src={companyLogo.filename}
                                sx={{ width: 56, height: 60 }}
                            />
                        </IconButton>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                            <OutlinedInput
                                id="outlined-adornment-password"
                                type={showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>

                                    </InputAdornment>
                                }
                                label="Password" />
                        </FormControl>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}