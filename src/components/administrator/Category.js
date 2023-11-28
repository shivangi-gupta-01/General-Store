import React, { useState, useEffect } from "react";
import {Avatar, TextField, Button, Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment, Tooltip } from "@mui/material"
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useStyles } from './CategoryCss';
import { getData, postData } from '../services/ServerServices';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function Category(props) {
    var navigate = useNavigate();
    const [companyId, setCompanyId] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [description, setDescription] = useState('')
    const [categoryImage, setCategoryImage] = useState({ filename: '/assets/water.png', bytes: '' })
    const [error, setError] = useState({})

    const handleError = (inputs, value) => {
        setError(prev => ({ ...prev, [inputs]: value }))

    }
    const validation = () => {
        var isValid = true
        if (!companyId) {

            handleError("companyId", "Invalid Company Id")
            isValid = false
        }
        if (!categoryName) {
            handleError("categoryName", "Invalid Category Name")
            isValid = false
        }
        if (!description) {
            handleError("description", "Invalid Description")
            isValid = false
        }
        return isValid
    }

    var admin = JSON.parse(localStorage.getItem('ADMIN'))
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    var classes = useStyles()

    const handleImage = (event) => {
        setCategoryImage({ filename: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
    }
    const clearValue = () => {
        setCompanyId('')
        setCategoryName('')
        setDescription('')
        setCategoryImage({ filename: '/assets/water.png', bytes: '' })
    }
    const handleClick = async () => {
        if (validation()) {
            var cd = new Date()
            var dd = cd.getFullYear() + "/" + (cd.getMonth() + 1) + "/" + cd.getDate() + " " + cd.getHours() + ":" + cd.getMinutes() + ":" + cd.getSeconds()
            var formData = new FormData()
            formData.append('companyid', companyId)
            formData.append('category', categoryName)
            formData.append('description', description)
            formData.append('icon', categoryImage.bytes)
            formData.append('createdat', dd)
            formData.append('updateat', dd)
            formData.append('createdby', 'ADMIN')
            var result = await postData('category/add_new_category', formData)

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
                            <div className={classes.headingStyle}>Category registration</div>
                        </div>
                        <div><Tooltip title="Category List"><FormatListBulletedIcon onClick={() => navigate('/dashboard/displayAllCategories')} /></Tooltip></div>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField error={!error.companyId ? false : true} helperText={error.companyId} onFocus={() => handleError("companyId", null)} value={admin.companyid} fullWidth onChange={(event) => setCompanyId(event.target.value)} label="Company Id" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField error={!error.categoryName ? false : true} helperText={error.categoryName} onFocus={() => handleError("categoryName", null)} fullWidth value={categoryName} onChange={(event) => setCategoryName(event.target.value)} label="Category" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField error={!error.description ? false : true} helperText={error.description} onFocus={() => handleError("description", null)} fullWidth value={description} onChange={(event) => setDescription(event.target.value)} label="Description" variant="outlined" />
                    </Grid>

                    <Grid item xs={6} className={classes.rowStyle}>
                        <IconButton style={{display:'flex', justifyContent:'space-between',flexDirection:'row',width:'100%'}} fullWidth color="primary" arial-label="Upload Picture" component="label">
                            <input hidden accept="image/*" type="file" onChange={handleImage} />
                            <PhotoCamera />
                            <Avatar
                                alt="Remy Sharp"
                                varient="rounded"
                                src={categoryImage.filename}
                                sx={{ width: 56, height: 60 }}
                            />
                        </IconButton>
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