import { makeStyles } from "@mui/styles";
export const useStyles=makeStyles({
    maincontainer:{
        display: 'flex',
        // justifyContent: 'center',
        alignItems: 'center',
        background: '#dfe6e9',
        width: '100vw',
        height: '100vh'
    },
    box:{
        padding: 20,
        marginLeft: '16%',
        background: '#fff',
        width: 800,
        borderRadius:10
    },
    headingStyle:{
        fontWeight:'bold',
        fontSize: 18,
        fontFamily:'Poppins',
        letterSpacing: 1
    },
    rowStyle:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between'
    }
})