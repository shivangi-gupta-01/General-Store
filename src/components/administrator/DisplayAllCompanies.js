import { useEffect, useState } from "react";
import MaterialTable from "@material-table/core";
import { ServerURL, getData ,postData} from "../services/ServerServices";
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Select, MenuItem, TextField, Grid, IconButton, FormControl, InputLabel, OutlinedInput, InputAdornment } from "@mui/material";
import { useStyles } from './DisplayAllCompaniesCss';
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import CloseIcon from '@mui/icons-material/Close';
import CloseIcon from '@mui/icons-material/Close';
export default function DisplayAllCompanies(props) {
  var classes = useStyles()
  const [companies, setCompanies] = useState([])
  const [open, setOpen] = useState(false);
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
    console.log(result.data)
}
  const handleOpenDialog = (rowData) => {
        // console.log(rowData/companyname)
        setCompanyName(rowData.comapnyname)
        setOwnerName(rowData.ownername)
        setEmailAddress(rowData.emailaddress)
        setMobileNumber(rowData.mobilenumber)
        setAddress(rowData.address)
        setPassword('')
        setCity('Choose City...')
        setState('Choose State...')
        setCompanyLogo({filename: '/assets/water.png', bytes: ''})
        setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
            <Grid container spacing={2}>
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
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button>Edit</Button>
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
    console.log("hry",result.data[0].comapnyname)
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
            render: rowData => <div>{rowData.comapnyname}<br />{rowData.ownername}</div>
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
            icon: 'edit',
            tooltip: 'Edit User',
            onClick: (event, rowData) => handleOpenDialog(rowData)
          },
          {
            icon: 'delete',
            tooltip: 'Delete User',
            onClick: (event, rowData) => alert("You want to delete " + rowData.name)
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