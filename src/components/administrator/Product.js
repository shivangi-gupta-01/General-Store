import React, { useState, useEffect } from "react";
import { Select, MenuItem, Avatar, TextField, Radio, RadioGroup, FormControlLabel, FormLabel, Button, Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material"
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useStyles } from './ProductCss';
import { getData, postData } from '../services/ServerServices';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Category from "./Category";

export default function Product(props) {
    var navigate = useNavigate();
    // All states to set input values
    const [categoryid, setCategoryId] = useState('')
    const [companyId, setCompanyId] = useState('')
    const [productName, setProductName] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [trending, setTrending] = useState('')
    const [deals, setDeals] = useState('')
    const [password, setPassword] = useState('')
    const [productImage, setProductImage] = useState({ filename: '/assets/water.png', bytes: '' })
    const [priceType, setPriceType] = useState([])
    const [error, setError] = useState({})
    const [categories, setCategories] = useState([])
    const [priceTypes, setPriceTypes] = useState([])

    var classes = useStyles()
    const fetchcategory = async () => {
        var result = await getData('product/fetch_category')
        console.log("sssssssss")
        setCategories(result.data)
    }
    useEffect(function () {
        fetchcategory()
    }, [])

    const fetchpricetype = async () => {
        var result = await getData('product/fetch_pricetype')
        console.log("sssssssss")
        setPriceTypes(result.data)
    }
    useEffect(function () {
        fetchpricetype()
    }, [])
    const handleError = (inputs, value) => {
        setError(prev => ({ ...prev, [inputs]: value }))

    }
    const validation = () => {
        var isValid = true
        if (!companyId) {

            handleError("companyId", "Invalid Company Id")
            isValid = false
        }
        if (!productName) {
            handleError("productName", "Invalid product Name")
            isValid = false
        }
        if (!description) {
            handleError("description", "Enter Description")
            isValid = false
        }
        if (!categoryid || categoryid == "Choose Category...") {
            handleError("categoryid", "Please Choose state")
            isValid = false
        }
        if (!status || status == "Choose Status...") {
            handleError("status", "Please Choose state")
            isValid = false
        }
        if (!priceType || priceType == "Choose Price Type...") {
            handleError("priceType", "Please Choose state")
            isValid = false
        }
        
    return isValid
};
const handleMouseDownPassword = (event) => {
    event.preventDefault();
};

const handleImage = (event) => {
    setProductImage({ filename: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
}

const fillcategory = () => {
    return categories.map((item) => {
        return <MenuItem value={item.categoryid}>{item.category}</MenuItem>
    })
}
const fillpricetype = () => {
    return priceTypes.map((item) => {
        return <MenuItem value={item.pricetypeid}>{item.prtype}</MenuItem>
    })
}
const handlePriceChange = (event) => {
    setPriceType(event.target.value)
  }
const clearValue = () => {
    setCompanyId('')
    setCategoryId('')
    setProductName('')
    setDescription('')
    setTrending('')
    setDeals('')
    setStatus('')
    setPriceType('Choose Product Type...')
    setProductImage({ filename: '/assets/water.png', bytes: '' })
}
const handleClick = async () => {
    if (validation()) {
        var cd = new Date()
        var dd = cd.getFullYear() + "/" + (cd.getMonth() + 1) + "/" + cd.getDate() + " " + cd.getHours() + ":" + cd.getMinutes() + ":" + cd.getSeconds()
        var formData = new FormData()
        formData.append('companyid', companyId)
        formData.append('categoryid', categoryid)
        formData.append('productname', productName)
        formData.append('description', description)
        formData.append('trending', trending)
        formData.append('deals', deals)
        formData.append('pricetype', priceType)
        formData.append('image', productImage.bytes)
        formData.append('createdat', dd)
        formData.append('updateat', dd)
        formData.append('createdby', 'ADMIN')
        formData.append('status', status)
        var result = await postData('product/add_new_product', formData)

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
const handlecategoryChange = (event) => {
    setCategoryId(event.target.value)
}

return (
    <div className={classes.maincontainer}>
        <div className={classes.box}>

            <Grid container spacing={2}>
                <Grid item xs={12} className={classes.rowStyle}>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div><img src="/assets/logo.png" width="40" /></div>
                        <div className={classes.headingStyle}>Add Product</div>
                    </div>
                    <div><FormatListBulletedIcon onClick={() => navigate('/displayAllproducts')} /></div>
                </Grid>
                <Grid item xs={6}>
                    <TextField error={!error.companyId ? false : true} helperText={error.companyId} onFocus={() => handleError("companyId", null)} value={companyId} fullWidth onChange={(event) => setCompanyId(event.target.value)} label="Company Id" variant="outlined" />
                </Grid>

                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={categoryid}
                            label="Category"
                            onChange={handlecategoryChange}
                            error={!error.categoryid ? false : true}
                            onFocus={() => handleError('categoryid', null)}
                        >
                            <MenuItem value={'Choose Category...'}>Choose Category...</MenuItem>
                            {fillcategory()}
                            <MenuItem sx={{ textDecoration: "none" }}><a href="/category">Add New Category</a></MenuItem>
                        </Select>
                        <div style={{ fontSize: 12, padding: 5, color: 'red', }}>{error.categoryid}</div>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth error={!error.productName ? false : true} helperText={error.productName} onFocus={() => handleError("productName", null)} value={productName} onChange={(event) => setProductName(event.target.value)} label="Product Name" variant="outlined" />
                </Grid>
                <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="status">Status</InputLabel>
                            <Select
                                labelId="status"
                                id="status"
                                value={status}
                                label="Status"
                                onChange={(event) => setStatus(event.target.value)}
                                error={!error.status ? false : true}
                                onFocus={() => handleError('status', null)}
                            >
                                <MenuItem value={"select staus<"}>Select Staus</MenuItem>
                                <MenuItem value={"available"}>Available</MenuItem>
                                <MenuItem value={"not available"}>Not Available</MenuItem>
                            </Select>
                            <div style={{ fontSize: 12, padding: 5, color: 'red', }}>{error.status}</div>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="pricetype">Price Type</InputLabel>
                            <Select
                                labelId="pricetype"
                                id="pricetype"
                                value={priceType}
                                label="Price Type"
                                onChange={handlePriceChange}
                                error={!error.priceType ? false : true}
                                onFocus={() => handleError('priceType', null)}

                            >
                                <MenuItem value={'Choose Price Type...'}>Choose Price Type...</MenuItem>
                            {fillpricetype()}
                            </Select>
                            <div style={{ fontSize: 12, padding: 5, color: 'red', }}>{error.priceType}</div>
                        </FormControl>
                    </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth error={!error.description ? false : true} helperText={error.description} onFocus={() => handleError("description", null)} value={description} onChange={(event) => setDescription(event.target.value)} label="Add product Description" variant="outlined" />
                </Grid>

                <Grid item xs={4}>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Trending</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={trending}
                            onChange={(event) => setTrending(event.target.value)}
                            error={!error.trending ? false : true}
                            onFocus={() => handleError('trending', null)}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                        <div style={{ fontSize: 12, padding: 5, color: 'red', }}>{error.trending}</div>
                    </FormControl>
                </Grid>
                <Grid item xs={4}>
                    <FormControl>
                        <FormLabel id="demo-row-radio-buttons-group-label">Deals</FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="demo-row-radio-buttons-group-label"
                            name="row-radio-buttons-group"
                            value={deals}
                            onChange={(event) => setDeals(event.target.value)}
                            error={!error.deals ? false : true}
                            onFocus={() => handleError('deals', null)}
                        >
                            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                            <FormControlLabel value="no" control={<Radio />} label="No" />
                        </RadioGroup>
                        <div style={{ fontSize: 12, padding: 5, color: 'red', }}>{error.deals}</div>
                    </FormControl>
                </Grid>


                <Grid item xs={4} className={classes.rowStyle}>
                    <IconButton style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', width: '100%' }} fullWidth color="primary" arial-label="Upload Picture" component="label">
                        <input hidden accept="image/*" type="file" onChange={handleImage} />
                        <PhotoCamera />
                        <Avatar
                            alt="Remy Sharp"
                            varient="rounded"
                            src={productImage.filename}
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