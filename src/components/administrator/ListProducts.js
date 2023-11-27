import React, { useState, useEffect } from "react";
import { Select, MenuItem, Avatar, TextField, Radio, RadioGroup, FormControlLabel, FormLabel, Button, Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material"
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useStyles } from './ProductCss';
import { getData, postData } from '../services/ServerServices';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { DropzoneArea } from 'material-ui-dropzone';


export default function ListProduct(props) {
    var navigate = useNavigate();
    // All states to set input values
    const [categoryid, setCategoryId] = useState('')
    const [companyId, setCompanyId] = useState('')
    const [productId, setProductId] = useState('')
    const [description, setDescription] = useState('')
    const [weight, setWeight] = useState('')
    const [price, setPrice] = useState('')
    const [offerPrice, setOfferPrice] = useState('')
    const [productImage, setProductImage] = useState([])
    const [error, setError] = useState({})
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    var classes = useStyles()
    const fetchcategory = async () => {
        var result = await getData('product/fetch_category')
        setCategories(result.data)
    }
    useEffect(function () {
        fetchcategory()
    }, [])
    const fillcategory = () => {
        return categories.map((item) => {
            return <MenuItem value={item.categoryid}>{item.category}</MenuItem>
        })
    }
    const fetchproduct = async (categoryid) => {
        var body = { 'categoryid': categoryid }
        var result = await postData('productlist/fetch_productname', body)
        setProducts(result.data)
        console.log(result.data)
    }
    const fillproducts = () => {
        return products.map((item) => {
            return <MenuItem value={item.productid}>{item.productname}</MenuItem>
        })
    }
    const handlecategoryChange = (event) => {
        setCategoryId(event.target.value)
        fetchproduct(event.target.value)
    }
    const handleproductChange = (event) => {
        setProductId(event.target.value)
    }
    const handleError = (inputs, value) => {
        setError(prev => ({ ...prev, [inputs]: value }))

    }
    const validation = () => {
        var isValid = true
        if (!companyId) {

            handleError("companyId", "Invalid Company Id")
            isValid = false
        }
        if (!productId) {
            handleError("productId", "Invalid product Name")
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
        // if (!status || status == "Choose Status...") {
        //     handleError("status", "Please Choose state")
        //     isValid = false
        // }
        // if (!priceType || priceType == "Choose Price Type...") {
        //     handleError("priceType", "Please Choose state")
        //     isValid = false
        // }

        return isValid
    };
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleProductImage = (files) => {
        setProductImage(files)
    }


    const clearValue = () => {
        setCompanyId('')
        setCategoryId('')
        setProductId('')
        setDescription('')
        setWeight('')
        setPrice('')
        setOfferPrice('')
    }
    const handleClick = async () => {
        if (validation()) {
            var cd = new Date()
            var dd = cd.getFullYear() + "/" + (cd.getMonth() + 1) + "/" + cd.getDate() + " " + cd.getHours() + ":" + cd.getMinutes() + ":" + cd.getSeconds()
            var formData = new FormData()
            formData.append('companyid', companyId)
            formData.append('categoryid', categoryid)
            formData.append('productid', productId)
            formData.append('description', description)
            formData.append('weight', weight)
            formData.append('price', price)
            formData.append('offerprice', offerPrice)
            formData.append('createdat', dd)
            formData.append('updateat', dd)
            formData.append('createdby', 'ADMIN')
            productImage.map((items,i)=>{
                formData.append('images'+i,items)
            })
            var result = await postData('productlist/add_new_productlist', formData)

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
                            <div className={classes.headingStyle}>Product List</div>
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
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Product Name</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={productId}
                                label="Product Name"
                                onChange={handleproductChange}
                                error={!error.categoryid ? false : true}
                                onFocus={() => handleError('productid', null)}
                            >
                                <MenuItem value={'Choose Product...'}>Choose Product...</MenuItem>
                                {fillproducts()}
                                <MenuItem sx={{ textDecoration: "none" }}><a href="/product">Add New Product</a></MenuItem>
                            </Select>
                            <div style={{ fontSize: 12, padding: 5, color: 'red', }}>{error.productId}</div>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth error={!error.weight ? false : true} helperText={error.weight} onFocus={() => handleError("weight", null)} value={weight} onChange={(event) => setWeight(event.target.value)} label="Weighth" variant="outlined" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth error={!error.price ? false : true} helperText={error.price} onFocus={() => handleError("price", null)} value={price} onChange={(event) => setPrice(event.target.value)} label="Price" variant="outlined" />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth error={!error.offerPrice ? false : true} helperText={error.offerPrice} onFocus={() => handleError("offerPrice", null)} value={offerPrice} onChange={(event) => setOfferPrice(event.target.value)} label="Offer Price" variant="outlined" />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField fullWidth error={!error.description ? false : true} helperText={error.description} onFocus={() => handleError("description", null)} value={description} onChange={(event) => setDescription(event.target.value)} label="Add product Description" variant="outlined" />
                    </Grid>


                    <Grid item xs={6}>
                        <DropzoneArea
                            acceptedFiles={['image/*']}
                            dropzoneText={"Drag and drop an image here or click"}
                            onChange={(files) => handleProductImage(files)}
                        />
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