import { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { ServerURL, getData, postData } from "../services/ServerServices";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, TextField, Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment, Switch } from "@mui/material";
import { useStyles } from './DisplayAllCompaniesCSS';
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Swal from "sweetalert2";
import CloseIcon from '@mui/icons-material/Close';
export default function DisplayAllProducts(props) {
    var navigate = useNavigate()
    var classes = useStyles()
    const [products, setProducts] = useState([])
    const [open, setOpen] = useState(false);
    const [productid, setproductId] = useState('');
    const [companyId, setCompanyId] = useState('')
    const [categoryid, setCategoryId] = useState('')
    const [productName, setProductName] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState('')
    const [trending, setTrending] = useState('')
    const [deals, setDeals] = useState('')
    const [productImage, setProductImage] = useState({ filename: '/assets/water.png', bytes: '' })
    const [priceType, setPriceType] = useState([])
    const [btnStatus, setBtnStatus] = useState(false)
    const [oldPicture, setOldPicture] = useState('')
    const [message, setMessage] = useState('')
    const [categories, setCategories] = useState([])
    const [priceTypes, setPriceTypes] = useState([])
    const fetchpricetype = async () => {
        var result = await getData('product/fetch_pricetype')
        setPriceType(result.data)
    }
    useEffect(function () {
        fetchpricetype()
    }, [])

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleImage = (event) => {
        setProductImage({ filename: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
        setBtnStatus(true)
    }

    const fillpricetype = () => {
        return priceTypes.map((item) => {
            return <MenuItem value={item.pricetypeid}>{item.prtype}</MenuItem>
        })
    }
    const handlePriceChange = (event) => {
        setPriceType(event.target.value)
    }

    const handleClick = async () => {
        var cd = new Date()
        var dd = cd.getFullYear() + "/" + (cd.getMonth() + 1) + "/" + cd.getDate() + " " + cd.getHours() + ":" + cd.getMinutes() + ":" + cd.getSeconds()
        var formData = new FormData()
        formData.append('companyid', companyId)
        formData.append('categoryid', categoryid)
        formData.append('productname', productName)
        formData.append('pricetype', priceType)
        formData.append('description', description)
        formData.append('trending', trending)
        formData.append('deals', deals)
        formData.append('image', productImage.bytes)
        formData.append('createdat', dd)
        formData.append('updateat', dd)
        formData.append('createdby', 'ADMIN')
        formData.append('status', status)
        var result = await postData('product/add_new_product', formData)
        console.log(result.data)
    }
    const handleOpenDialog = (rowData) => {
        // console.log(rowData/companyname)
        setCompanyId(rowData.companyid)
        setCategoryId(rowData.categoryid)
        setProductName(rowData.productname)
        setStatus(rowData.status)
        setPriceType(rowData.pricetype)
        setDescription(rowData.description)
        setTrending(rowData.trending)
        setDeals(rowData.deals)
        setProductImage({ filename: `${ServerURL}/images/${rowData.image}`, bytes: '' })
        setOldPicture(rowData.image)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const fetchAllProducts = async () => {
        var result = await getData('product/fetch_all_products')
        setProducts(result.data)
    }
    useEffect(function () {
        fetchAllProducts()
    }, [])
    const handleEditData = async () => {
        var cd = new Date()
        var dd = cd.getFullYear() + "/" + (cd.getMonth() + 1) + "/" + cd.getDate() + " " + cd.getHours() + ":" + cd.getMinutes() + ":" + cd.getSeconds()
        var body = {
            
            'companyid': companyId,
            'categoryid': categoryid,
            'productname': productName,
            'status': status,
            'pricetype': priceType,
            'description': description,
            'trending': trending,
            'deals': deals,
            'updateat': dd,
            'createdby': 'ADMIN',
        }
        var result = await postData('product/edit_product_data', body)
        if (result.status) {
            setOpen(false)
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

        fetchAllProducts()
    }
    const handleCancel = () => {
        setProductImage({ filename: `${ServerURL}/images/${oldPicture}`, bytes: '' })
        setOldPicture('')
        setBtnStatus(false)
        setMessage('')
    }
    const handleSaveLogo = async () => {
        var formData = new FormData()
        formData.append('productid', productid)
        formData.append('image', productImage.bytes)
        var result = await postData('product/edit_product_image', formData)
        if (result.status) {
            console.log(result.status)
            setMessage("assets/tick.gif")
        }
        else {
            setMessage("")

        }
        fetchAllProducts()
        setBtnStatus(false)
    }
    const PictureButton = () => {
        return (<div>{btnStatus ? <div style={{ display: 'flex', }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSaveLogo}>Save</Button>
        </div> : <div style={{ fontSize: 10, color: 'green', fontWeight: 'bold' }}><img src={message} width="60" /></div>}
        </div>)
    }
    const handleDelete = async (rowData) => {
        setOpen(false)
        Swal.fire({
            title: "Do you want to delete Product?",
            showCancelButton: true,
            confirmButtonText: "Delete",
        }).then(async (result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                var res = await postData('product/delete_product_data', { productid: rowData.productid })
                if (res.status) {
                    Swal.fire("Deleted!", "", "Success");
                    fetchAllProducts()
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: result.message,
                    })

                }
            } else if (result.isDenied) {
                Swal.fire("Changes are not saved", "", "info");
            }
        })
    }
    const fetchcategory = async () => {
        var result = await getData('product/fetch_category')
        console.log("sssssssss")
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
    const handlecategoryChange = (event) => {
        setCategoryId(event.target.value)
    }
    const handleStatus = (temp) => {
        if (temp == 'Available') {
          { setStatus('Not Available') }
        }
        if (temp == 'Not Available') {
          { setStatus('Available') }
        }
      }
      const handleTrending = (temp) => {
        if (temp == 'Yes') {
          { setStatus('No') }
        }
        if (temp == 'No') {
          { setStatus('Yes') }
        }
      }
      const handleDeals = (temp) => {
        if (temp == 'Yes') {
          { setStatus('No') }
        }
        if (temp == 'No') {
          { setStatus('Yes') }
        }
      }
      
    const showProductDetails = () => {
        return (
            <div>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title" style={{ display: 'flex', justifyContent: 'space-between', }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img src="/assets/logo.png" width="40" />
                            Edit Product
                        </div>
                        <div>
                            <CloseIcon style={{ cursor: 'pointer' }} onClick={handleClose} />
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} style={{ marginTop: 5 }}>
                            <Grid item xs={6}>
                                <TextField value={companyId} fullWidth onChange={(event) => setCompanyId(event.target.value)} label="Company Id" variant="outlined" />
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={categoryid}
                                        label="State"
                                        onChange={handlecategoryChange}
                                    >
                                        <MenuItem value={'Choose Category...'}>Choose Category...</MenuItem>
                                        {fillcategory()}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                <TextField fullWidth value={productName} onChange={(event) => setProductName(event.target.value)} label="Product Name" variant="outlined" />
                            </Grid>

                            <Grid item xs={6}>
                                {status == "Available" ? <Switch onChange={() => handleStatus(status)} /> : <Switch onChange={() => handleStatus(status)} defaultChecked />}
                                {status}
                            </Grid>

                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Price Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={priceType}
                                        label="Price Type"
                                        onChange={handlePriceChange}
                                    >
                                        <MenuItem value={'Choose Price Type...'}>Choose Price Type...</MenuItem>
                                        {fillpricetype()}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={6}>
                                {trending == "Yes" ? <Switch onChange={() => handleTrending(trending)} /> : <Switch onChange={() => handleTrending(trending)} defaultChecked />}
                                {trending}
                            </Grid>

                            <Grid item xs={6}>
                                {deals == "Yes" ? <Switch onChange={() => handleDeals(deals)} /> : <Switch onChange={() => handleDeals(deals)} defaultChecked />}
                                {deals}
                            </Grid>

                            <Grid item xs={6} className={classes.rowStyle}>
                                <IconButton fullWidth color="primary" arial-label="Upload Picture" component="label">
                                    <input hidden accept="image/*" type="file" onChange={handleImage} />
                                    <PhotoCamera />
                                </IconButton>
                                <Avatar
                                    alt="Remy Sharp"
                                    varient="rounded"
                                    src={productImage.filename}
                                    sx={{ width: 56, height: 60 }}
                                />
                                <PictureButton />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleEditData}>Edit</Button>
                        <Button onClick={handleClose}>
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
     }
    // const fetchAllProducts = async () => {
    //     var result = await getData('company/fetch_all_products')
    //     setCompanies(result.data)
    // }
    // useEffect(function () {
    //     fetchAllCompanies()
    // }, [])
    function showAllProducts() {
        return (
            <MaterialTable
                title={<span className={classes.headingStyle}>Product List</span>}

                columns={[
                    {
                        title: 'Category Name', field: 'categoryid',
                        render: rowData => <div>{rowData.companyId}<br />{rowData.categoryid}</div>
                    },
                    {
                        title: 'Product', field: 'product',
                        render: rowData => <div>{rowData.productname}</div>
                    },
                    {
                        title: 'Description',
                        render: rowData => <div>{rowData.description}<br />{"Trending: "}{rowData.trending}<br/>{"Deals"}{rowData.deals}</div>
                    },
                    { title: 'Status', field: 'status' },
                    {
                        title: 'Last Updation', field: 'createdby',
                        render: rowData => <div>{rowData.createdat}<br />{rowData.updateat}<br />{rowData.createdby}</div>
                    },
                    {
                        title: 'Image',
                        render: rowData => <Avatar src={`${ServerURL}/images/${rowData.image}`} style={{ width: 70, height: 70 }} variant="rounded" />
                    },

                ]}
                data={products}
                actions={[
                    {
                        icon: 'add',
                        isFreeAction: true,
                        tooltip: 'Add Product',
                        onClick: (event) => navigate('/product')
                    },
                    {
                        icon: 'edit',
                        tooltip: 'Edit User',
                        onClick: (event, rowData) => handleOpenDialog(rowData)
                    },
                    {
                        icon: 'delete',
                        tooltip: 'Delete User',
                        onClick: (event, rowData) => handleDelete(rowData)
                    }
                ]}
            />
        )
    }
    return (
        <div className={classes.maincontainer}>
            <div className={classes.box}>
                {showAllProducts()}
                {showProductDetails()}
            </div>
        </div>
    )

}