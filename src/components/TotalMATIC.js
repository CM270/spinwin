import {Grid, Typography, Avatar } from "@mui/material";
import matic from "../images/Matic-icon.png";

const TotalMATIC = ({tokenAmount, price, msg}) =>{
    if (tokenAmount > 0 && tokenAmount!==""){
        return (
          <Grid container justifyContent="center" alignItems="center">
            <Typography sx={{color:'#FFFFFF'}}>{msg} {tokenAmount*price} MATIC</Typography>
            <Avatar
        alt=""
        src={matic}
        sx={{ width: 24, height: 24 }}
      />
          </Grid>
        )
    }
  }
  export default TotalMATIC