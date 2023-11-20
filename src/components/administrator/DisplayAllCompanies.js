import { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { ServerURL, getData, postData } from "../services/ServerServices";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, TextField, Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment, Switch } from "@mui/material";
import { useStyles } from './DisplayAllCompaniesCss';
import { useNavigate } from "react-router-dom";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Swal from "sweetalert2";
import CloseIcon from '@mui/icons-material/Close';
export default function DisplayAllCompanies(props) {
  var navigate = useNavigate()
  var classes = useStyles()
  const [companies, setCompanies] = useState([])
  const [open, setOpen] = useState(false);
  const [companyid, setCompanyId] = useState('');
  const [state, setState] = useState('')
  const [city, setCity] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [address, setAddress] = useState('')
  const [status, setStatus] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [companyLogo, setCompanyLogo] = useState({ filename: '/assets/water.png', bytes: '' })
  const [states, setStates] = useState([])
  const [cities, setCities] = useState([])
  const [btnStatus, setBtnStatus] = useState(false)
  const [oldPicture, setOldPicture] = useState('')
  const [message, setMessage] = useState('')
  const fetchstates = async () => {
    var result = await getData('statecity/fetch_states')
    setStates(result.data)
  }
  useEffect(function () {
    fetchstates()
  }, [])

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleImage = (event) => {
    setCompanyLogo({ filename: URL.createObjectURL(event.target.files[0]), bytes: event.target.files[0] })
    setBtnStatus(true)
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
  const handleClick = async () => {
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
    formData.append('logo', companyLogo.bytes)
    formData.append('createdat', dd)
    formData.append('updateat', dd)
    formData.append('createdby', 'ADMIN')
    formData.append('status', 'pending')
    var result = await postData('company/add_new_company', formData)
    console.log(result.data)
  }
  const handleOpenDialog = (rowData) => {
    // console.log(rowData/companyname)
    fetchcity(rowData.state)
    setCompanyId(rowData.companyid)
    setCompanyName(rowData.companyname)
    setOwnerName(rowData.ownername)
    setEmailAddress(rowData.emailaddress)
    setMobileNumber(rowData.mobilenumber)
    setAddress(rowData.address)
    setCity(rowData.city)
    setStatus(rowData.status)
    setState(rowData.state)
    setCompanyLogo({ filename: `${ServerURL}/images/${rowData.logo}`, bytes: '' })
    setOldPicture(rowData.logo)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditData = async () => {
    var cd = new Date()
    var dd = cd.getFullYear() + "/" + (cd.getMonth() + 1) + "/" + cd.getDate() + " " + cd.getHours() + ":" + cd.getMinutes() + ":" + cd.getSeconds()
    var body = {
      'companyid': companyid,
      'companyname': companyName,
      'ownername': ownerName,
      'emailaddress': emailAddress,
      'mobilenumber': mobileNumber,
      'address': address,
      'state': state,
      'city': city,
      'updateat': dd,
      'createdby': 'ADMIN',
      'status': status,
    }
    var result = await postData('company/edit_company_data', body)
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

    fetchAllCompanies()
  }
  const handleCancel = () => {
    setCompanyLogo({ filename: `${ServerURL}/images/${oldPicture}`, bytes: '' })
    setOldPicture('')
    setBtnStatus(false)
    setMessage('')
  }
  const handleSaveLogo = async () => {
    var formData = new FormData()
    formData.append('companyid', companyid)
    formData.append('logo', companyLogo.bytes)
    var result =await postData('company/edit_company_logo', formData)
    if (result.status) {
      setMessage("assets/tick.gif")
    }
    else {
      setMessage("")

    }
    fetchAllCompanies()
    setBtnStatus(false)
  }
  const PictureButton = () => {
    return (<div>{btnStatus ? <div style={{ display: 'flex', }}>
      <Button onClick={handleCancel}>Cancel</Button>
      <Button onClick={handleSaveLogo}>Save</Button>
    </div> : <div style={{ fontSize: 10, color: 'green', fontWeight: 'bold' }}><img src={message} width="60" /></div>}
    </div>)
  }
  const handleStatus = (temp) => {
    if (temp == 'Pending') {
      { setStatus('Verified') }
    }
    if (temp == 'Verified') {
      { setStatus('Pending') }
    }
  }

  const handleDelete = async (rowData) => {
    setOpen(false)
    Swal.fire({
      title: "Do you want to delete Company?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then(async (result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        var res = await postData('company/delete_company_data', { companyid: rowData.companyid })
        if (res.status) {
          Swal.fire("Deleted!", "", "Success");
          fetchAllCompanies()
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

  const showCompanyDetails = () => {
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
              Edit Company
            </div>
            <div>
              <CloseIcon style={{ cursor: 'pointer' }} onClick={handleClose} />
            </div>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} style={{ marginTop: 5 }}>
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
              <Grid item xs={6}>
                {status == "Pending" ? <Switch onChange={() => handleStatus(status)} /> : <Switch onChange={() => handleStatus(status)} defaultChecked />}
                {status}
              </Grid>
              <Grid item xs={6} className={classes.rowStyle}>
                <IconButton fullWidth color="primary" arial-label="Upload Picture" component="label">
                  <input hidden accept="image/*" type="file" onChange={handleImage} />
                  <PhotoCamera />
                </IconButton>
                <Avatar
                  alt="Remy Sharp"
                  varient="rounded"
                  src={companyLogo.filename}
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
  const fetchAllCompanies = async () => {
    var result = await getData('company/fetch_all_company')
    setCompanies(result.data)
  }
  useEffect(function () {
    fetchAllCompanies()
  }, [])
  function showAllCompany() {
    return (
      <MaterialTable
        title={<span className={classes.headingStyle}>Company List</span>}

        columns={[
          {
            title: 'Company Name', field: 'companyname',
            render: rowData => <div>{rowData.companyname}<br />{rowData.ownername}</div>
          },
          {
            title: 'Address', field: 'cityname',
            render: rowData => <div>{rowData.address}<br />{rowData.cityname}<br />{rowData.statename}</div>
          },
          {
            title: 'Contact Details',
            render: rowData => <div>{rowData.emailaddress}<br />{rowData.mobilenumber}</div>
          },
          { title: 'Status', field: 'status' },
          {
            title: 'Last Updation', field: 'createdby',
            render: rowData => <div>{rowData.createdat}<br />{rowData.updateat}<br />{rowData.createdby}</div>
          },
          {
            title: 'Logo',
            render: rowData => <Avatar src={`${ServerURL}/images/${rowData.logo}`} style={{ width: 70, height: 70 }} variant="rounded" />
          },

        ]}
        data={companies}
        actions={[
          {
            icon: 'add',
            isFreeAction:true,
            tooltip:'Add Company',
            onClick :(event)=> navigate('/company')
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
        {showAllCompany()}
        {showCompanyDetails()}
      </div>
    </div>
  )

}