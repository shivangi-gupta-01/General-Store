import React, { useState, useEffect } from "react";
import { Select,Tooltip, MenuItem, Avatar, TextField, Button, Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material"
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useStyles } from './CompanyCss';
import { getData, postData } from '../services/ServerServices';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Company(props) {
    var navigate = useNavigate();
    // All states to set input values
    const [showPassword, setShowPassword] = useState(false);
    const [state, setState] = useState('')
    const [city, setCity] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [ownerName, setOwnerName] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [address, setAddress] = useState('')
    const [mobileNumber, setMobileNumber] = useState('')
    const [password, setPassword] = useState('')
    const [companyLogo, setCompanyLogo] = useState({ filename: '/assets/water.png', bytes: '' })
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [error, setError] = useState({})

    var classes = useStyles()
    const fetchstates = async () => {
        var result = await getData('statecity/fetch_states')
        setStates(result.data)
    }
    useEffect(function () {
        fetchstates()
    }, [])

    const handleError = (inputs, value) => {
        setError(prev => ({ ...prev, [inputs]: value }))

    }
    const validation = () => {
        var isValid = true
        if (companyName == '') {

            handleError("companyName", "Invalid Company Name")
            isValid = false
        }
        if (!ownerName) {
            handleError("ownerName", "Invalid Owner Name")
            isValid = false
        }
        if (!mobileNumber || !(/^[0-9]{10}$/.test(mobileNumber))) {
            handleError("mobileNumber", "Invalid Mobile Number")
            isValid = false
        }
        if (!emailAddress || !(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailAddress))) {
            handleError("emailAddress", "Invaild Email Address")
            isValid = false
        }
        if (!address) {
            handleError("address", "Please Input Address")
            isValid = false
        }
        if (!state || state == "Choose State...") {
            handleError("state", "Please Choose state")
            isValid = false
        }
        if (!city || city == "Choose City...") {
            handleError("city", "Please Choose City")
            isValid = false
        }
        if (!password) {
            handleError("password", "Please Enter Password")
            isValid = false
        }
        return isValid
    }

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleImage = (event) => {
        setCompanyLogo({ filename: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
    }

    const fillstate = () => {
        return states.map((item) => {
            return <MenuItem value={item.stateid}>{item.statename}</MenuItem>
        })
    }
    const fetchcity = async (stateid) => {
        var body = { 'stateid': stateid }
        var result = await postData('statecity/fetch_cities', body)
        setCities(result.data)
    }
    const fillcities = () => {
        return cities.map((item) => {
            return <MenuItem value={item.cityid}>{item.cityname}</MenuItem>
        })
    }
    const handlestateChange = (event) => {
        setState(event.target.value)
        fetchcity(event.target.value)
    }
    const handlecityChange = (event) => {
        setCity(event.target.value)
    }
    const clearValue = () => {
        setCompanyName('')
        setOwnerName('')
        setEmailAddress('')
        setMobileNumber('')
        setAddress('')
        setPassword('')
        setCity('Choose City...')
        setState('Choose State...')
        setCompanyLogo({ filename: '/assets/water.png', bytes: '' })
    }
    const handleClick = async () => {
        if (validation()) {
            var cd = new Date()
            var dd = cd.getFullYear() + "/" + (cd.getMonth() + 1) + "/" + cd.getDate() + " " + cd.getHours() + ":" + cd.getMinutes() + ":" + cd.getSeconds()
            var formData = new FormData()
            formData.append('companyname', companyName)
            formData.append('ownername', ownerName)
            formData.append('emailaddress', emailAddress)
            formData.append('mobilenumber', mobileNumber)
            formData.append('address', address)
            formData.append('state', state)
            formData.append('city', city)
            formData.append('password', password)
            formData.append('logo', companyLogo.bytes)
            formData.append('createdat', dd)
            formData.append('updateat', dd)
            formData.append('createdby', 'ADMIN')
            formData.append('status', 'Pending')
            var result = await postData('company/add_new_company', formData)

            if (result.status) {
                Swal.fire({
                    icon: 'success',
                    title: result.message,
                })
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: result.message,
                })

            }
            clearValue()
        }
    }


    return (
        <div className={classes.maincontainer}>
            <div className={classes.box}>

                <Grid container spacing={2}>
                    <Grid item xs={12} className={classes.rowStyle}>
                        <div style={{ display: 'flex', flexDirection: 'row' }}>
                            <div><img src="/assets/logo.png" width="40" /></div>
                            <div className={classes.headingStyle}>Company registration</div>
                        </div>
                        <div><Tooltip title="Company List"><FormatListBulletedIcon onClick={() => navigate('/displayAllCompanies')} /></Tooltip></div>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField error={!error.companyName ? false : true} helperText={error.companyName} onFocus={() => handleError("companyName", null)} value={companyName} fullWidth onChange={(event) => setCompanyName(event.target.value)} label="Company Name" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth error={!error.ownerName ? false : true} helperText={error.ownerName} onFocus={() => handleError("ownerName", null)} value={ownerName} onChange={(event) => setOwnerName(event.target.value)} label="Owner Name" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth error={!error.emailAddress ? false : true} helperText={error.emailAddress} onFocus={() => handleError("emailAddress", null)} value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)} label="Email address" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField error={!error.mobileNumber ? false : true} helperText={error.mobileNumber} fullWidth value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value)} label="Mobile Number" variant="outlined" />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth error={!error.address ? false : true} helperText={error.address} onFocus={() => handleError('address', null)} value={address} onChange={(event) => setAddress(event.target.value)} label="Address" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">State</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={state}
                                label="State"
                                onChange={handlestateChange}
                                error={!error.state ? false : true}
                                onFocus={() => handleError('state', null)}
                            >
                                <MenuItem value={'Choose State...'}>Choose State...</MenuItem>
                                {fillstate()}
                            </Select>
                            <div style={{ fontSize: 12, padding: 5, color: 'red', }}>{error.state}</div>
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
                                onChange={handlecityChange}
                                error={!error.city ? false : true}
                                onFocus={() => handleError('city', null)}
                            >
                                <MenuItem value={'Choose City...'}>Choose City...</MenuItem>
                                {fillcities()}
                            </Select>
                            <div style={{ fontSize: 12, padding: 5, color: 'red', }}>{error.city}</div>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6} className={classes.rowStyle}>
                        <IconButton style={{display:'flex', justifyContent:'space-between',flexDirection:'row',width:'100%'}} fullWidth color="primary" arial-label="Upload Picture" component="label">
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
                                value={password}
                                type={showPassword ? 'text' : 'password'}
                                onChange={(event) => setPassword(event.target.value)}
                                onFocus={() => handleError('password', null)}
                                error={!error.password ? false : true}
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
                        <div style={{ fontSize: 12, padding: 5, color: 'red', }}>{error.city}</div>
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth onClick={handleClick} variant="contained">Submit</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth onClick={clearValue} variant="contained">Reset</Button>
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}