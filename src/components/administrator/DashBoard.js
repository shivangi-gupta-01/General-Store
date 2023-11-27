// https://mui.com/store/previews/minimal-dashboard-free/
import * as React from 'react';
import { AppBar, Divider, Grid, Paper } from '@mui/material';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CategoryIcon from '@mui/icons-material/Category';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LogoutIcon from '@mui/icons-material/Logout';
import { Route, Routes } from 'react-router-dom';
import DisplayAllCategories from './DisplayAllCategories';
import { useNavigate } from 'react-router-dom';
export default function DashBoard(props) {
    var navigate = useNavigate()
    return (<div>
        <AppBar position="static" style={{ background: '#000' }}>
            <Toolbar variant="dense">
                <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                    <MenuIcon style={{ color: '#FFF' }} />
                </IconButton>
                <Typography variant="h6" component="div">
                    <span style={{ color: '#FFF' }}>GeneralStore</span>
                </Typography>
            </Toolbar>
        </AppBar>
        <Grid container spacing={3}>
            <Grid item xs={2}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <img src='/assets/logo.png' style={{ width: 80, margin: 20 }} />
                    <Paper style={{ width: 220, height: 70, background: "#dfe6e9", margin: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} elevation={1} >
                        <img src='/assets/admin.jpg' style={{ marginLeft: 15, width: 50, borderRadius: 25 }} />
                        <span style={{ fontWeight: 'bold', fontFamily: 'Poppins', marginRight: 15 }}>Shivangi Gupta</span>
                    </Paper>
                    {/* List */}
                    <div style={{ width: 220, margin: 20 }}>
                        <List component="nav">
                            <ListItemButton
                            onClick={() => navigate("/dashboard/displayallcategories")}
                            >
                                <ListItemIcon>
                                    <CategoryIcon />
                                </ListItemIcon>
                                <ListItemText primary={<span style={{ fontWeight: 500, letterSpacing: 1, fontFamily: 'Poppins' }}>Category</span>} />
                            </ListItemButton>

                            <ListItemButton
                            // onClick={(event) => handleListItemClick(event, 0)}
                            >
                                <ListItemIcon>
                                    <AddShoppingCartIcon />
                                </ListItemIcon>
                                <ListItemText primary={<span style={{ fontWeight: 500, letterSpacing: 1, fontFamily: 'Poppins' }}>Products</span>} />
                            </ListItemButton>

                            <ListItemButton
                            // onClick={(event) => handleListItemClick(event, 0)}
                            >
                                <ListItemIcon>
                                    <AddPhotoAlternateIcon />
                                </ListItemIcon>
                                <ListItemText primary={<span style={{ fontWeight: 500, letterSpacing: 1, fontFamily: 'Poppins' }}>Add Pictures</span>} />
                            </ListItemButton>
                            <Divider />

                            <ListItemButton
                            // onClick={(event) => handleListItemClick(event, 0)}
                            >
                                <ListItemIcon>
                                    <LogoutIcon />
                                </ListItemIcon>
                                <ListItemText primary={<span style={{ fontWeight: 500, letterSpacing: 1, fontFamily: 'Poppins' }}>Logout</span>} />
                            </ListItemButton>
                        </List>
                    </div>
                </div>
            </Grid>
            <Grid item xs={10}>
                <Routes>
                    <Route element={<DisplayAllCategories />} path={"/displayallcategories"} />
                </Routes>
            </Grid>
        </Grid>
    </div>)
}