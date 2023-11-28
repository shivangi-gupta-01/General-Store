import { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { ServerURL, getData, postData } from "../services/ServerServices";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, TextField, Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment, Switch } from "@mui/material";
import { useStyles } from './DisplayAllCategoriesCss';
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Swal from "sweetalert2";
import CloseIcon from '@mui/icons-material/Close';
export default function DisplayAllCategories(props) {
  var navigate = useNavigate()
  var classes = useStyles()
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false);
  const [categoryid, setCategoryId] = useState('');
  const [companyId, setCompanyId] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [description, setDescription] = useState('')
  const [categoryImage, setCategoryImage] = useState({ filename: '/assets/water.png', bytes: '' })
  const [oldPicture, setOldPicture] = useState('')
  const [message, setMessage] = useState('')
  const [btnStatus, setBtnStatus] = useState(false)
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleImage = (event) => {
    setCategoryImage({ filename: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
    setBtnStatus(true)
  }

  const handleClick = async () => {
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
    // console.log(result.data)
  }
  const handleOpenDialog = (rowData) => {
    setCategoryId(rowData.categoryid)
    setCompanyId(rowData.companyid)
    setCategoryName(rowData.category)
    setDescription(rowData.description)
    setCategoryImage({ filename: `${ServerURL}/images/${rowData.icon}`, bytes: '' })
    setOldPicture(rowData.icon)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditData = async () => {
    var cd = new Date()
    var dd = cd.getFullYear() + "/" + (cd.getMonth() + 1) + "/" + cd.getDate() + " " + cd.getHours() + ":" + cd.getMinutes() + ":" + cd.getSeconds()
    var body = {
      'categoryid': categoryid,
      'companyid': companyId,
      'category': categoryName,
      'description': description,
      'updateat': dd,
      'createdby': 'ADMIN',
    }
    var result = await postData('category/edit_category_data', body)
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

    fetchAllCategories()
  }
  const handleCancel = () => {
    setCategoryImage({ filename: `${ServerURL}/images/${oldPicture}`, bytes: '' })
    setOldPicture('')
    setBtnStatus(false)
    setMessage('')
  }
  const handleSaveLogo = async () => {
    var formData = new FormData()
    formData.append('categoryid', categoryid)
    formData.append('icon', categoryImage.bytes)
    var result =await postData('company/edit_category_image', formData)
    if (result.status) {
      setMessage("assets/tick.gif")
    }
    else {
      setMessage("")

    }
    fetchAllCategories()
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
      title: "Do you want to delete Category?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var res = await postData('category/delete_category_data', { categoryid: rowData.categoryid })
        if (res.status) {
          Swal.fire("Deleted!", "", "Success");
          fetchAllCategories()
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

  const showCategoryDetails = () => {
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
              Edit Category
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
                <TextField fullWidth value={categoryName} onChange={(event) => setCategoryName(event.target.value)} label="Category Name" variant="outlined" />
              </Grid>

              <Grid item xs={6}>
                <TextField fullWidth value={description} onChange={(event) => setDescription(event.target.value)} label="Description" variant="outlined" />
              </Grid>

              <Grid item xs={6} className={classes.rowStyle}>
                <IconButton fullWidth color="primary" arial-label="Upload Picture" component="label">
                  <input hidden accept="image/*" type="file" onChange={handleImage} />
                  <PhotoCamera />
                </IconButton>
                <Avatar
                  alt="Remy Sharp"
                  varient="rounded"
                  src={categoryImage.filename}
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
  const fetchAllCategories = async () => {
    var result = await getData('category/fetch_all_category')
    setCategories(result.data)
  }
  useEffect(function () {
    fetchAllCategories()
  }, [])
  function showAllCategory() {
    return (
      <MaterialTable
        title={<span className={classes.headingStyle}>Category List</span>}

        columns={[
          {
            title: 'Company Id', field: 'companyid',
            render: rowData => <div>{rowData.companyid}<br /></div>
          },
          {
            title: 'Category', field: 'category',
            render: rowData => <div>{rowData.category}</div>
          },
          {
            title: 'Description', field: 'description',
            render: rowData => <div>{rowData.description}</div>
          },
          {
            title: 'Last Updation', field: 'createdby',
            render: rowData => <div>{rowData.createdat}<br />{rowData.updateat}<br />{rowData.createdby}</div>
          },
          {
            title: 'Image',
            render: rowData => <Avatar src={`${ServerURL}/images/${rowData.icon}`} style={{ width: 70, height: 70 }} variant="rounded" />
          },

        ]}
        data={categories}
        actions={[
          {
            icon: 'add',
            isFreeAction:true,
            tooltip:'Add Category',
            onClick :(event)=> navigate('/dashboard/category')
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
        {showAllCategory()}
        {showCategoryDetails()}
      </div>
    </div>
  )

}