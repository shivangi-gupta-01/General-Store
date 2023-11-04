import React, { useState, useEffect } from "react";
import { Select, MenuItem, Avatar, TextField, Button, Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material"
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useStyles } from './CompanyCss';
import { getData, postData } from '../services/ServerServices';
import { AssistWalkerOutlined } from "@mui/icons-material";
import Swal from "sweetalert2";

export default function Company(props) {
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

    var classes = useStyles()
    const fetchstates = async () => {
        var result = await getData('statecity/fetch_states')
        setStates(result.data)
    }
    useEffect(function () {
        fetchstates()
    }, [])



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
    const handlecityChange=(event)=>{
        setCity(event.target.value)
    }
    const clearValue=()=>{
        setCompanyName('')
        setOwnerName('')
        setEmailAddress('')
        setMobileNumber('')
        setAddress('')
        setPassword('')
        setCity('Choose City...')
        setState('Choose State...')
        setCompanyLogo({filename: '/assets/water.png', bytes: ''})
    }
    const handleClick=async()=>{
        var cd= new Date()
        var dd= cd.getFullYear()+"/"+(cd.getMonth()+1)+"/"+cd.getDate()+" "+cd.getHours()+":"+cd.getMinutes()+":" +cd.getSeconds()
        var formData= new FormData()
        formData.append('companyname',companyName)
        formData.append('ownername',ownerName)
        formData.append('emailaddress',emailAddress)
        formData.append('mobilenumber',mobileNumber)
        formData.append('address',address)
        formData.append('state',state)
        formData.append('city',city)
        formData.append('password',password)
        formData.append('logo',companyLogo.bytes)
        formData.append('createdat',dd)
        formData.append('updateat', dd)
        formData.append('createdby','ADMIN')
        formData.append('status','pending')
        var result = await postData ('company/add_new_company',formData)
        
        if(result.status){
            Swal.fire({
                icon: 'success',
                title: result.message,
              })
        }
        else{
            Swal.fire({
                icon: 'error',
                title: result.message,
              })
            
        }
        clearValue()
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
                        <TextField value={companyName} fullWidth onChange={(event) => setCompanyName(event.target.value)} label="Company Name" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth value={ownerName} onChange={(event) => setOwnerName(event.target.value)} label="Owner Name" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth value={emailAddress} onChange={(event) => setEmailAddress(event.target.value)} label="Email address" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth value={mobileNumber} onChange={(event) => setMobileNumber(event.target.value)} label="Mobile Number" variant="outlined" />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField fullWidth value={address} onChange={(event) => setAddress(event.target.value)} label="Address" variant="outlined" />
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
                            >
                                <MenuItem value={'Choose State...'}>Choose State...</MenuItem>
                                {fillstate()}
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
                            onChange={handlecityChange}
                            >
                                <MenuItem value={'Choose City...'}>Choose City...</MenuItem>
                                {fillcities()}
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
                                value={password}
                                type={showPassword ? 'text' : 'password'}
                                onChange={(event) => setPassword(event.target.value)}
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