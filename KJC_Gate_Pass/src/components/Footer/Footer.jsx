import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import YouTubeIcon from '@mui/icons-material/YouTube';
import PublicIcon from '@mui/icons-material/Public';

function Footer() {
  return (
    <Box 
      sx={{
          position: { xs: 'static', md: 'fixed' }, 
          zIndex: { md: 10 }, 
          bottom: { md: 0 },
          backgroundColor: '#000', 
          color: '#fff', 
          py: 0.5, 
          px: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexDirection: { xs: 'column', md: 'row' }, 
          textAlign: { xs: 'center', md: 'left' }, 
          width: '100%', 
          boxSizing: 'border-box', 
          mt: 'auto', 
          maxWidth: '100%',
      }}
    >
      <Typography variant="body2" sx={{ fontSize: '0.8rem' , fontFamily: 'Inter, sans-serif',}}> 
        © 2024 - All rights reserved - Kristu Jayanti Software Development Centre
      </Typography>
      <Box sx={{ mt: { xs: 1, md: 0 }, display: 'flex', justifyContent: 'center' }}>
        <IconButton color="inherit" href="https://instagram.com" sx={{ mx: 0.5, p: 0.5 }}> 
          <InstagramIcon fontSize="small" /> 
        </IconButton>
        <IconButton color="inherit" href="https://kristujayanti.edu.in/home/" sx={{ mx: 0.5, p: 0.5 }}>
          <PublicIcon fontSize="small" />
        </IconButton>
        <IconButton color="inherit" href="https://twitter.com" sx={{ mx: 0.5, p: 0.5 }}>
          <TwitterIcon fontSize="small" />
        </IconButton>
        <IconButton color="inherit" href="https://youtube.com" sx={{ mx: 0.5, p: 0.5 }}>
          <YouTubeIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}

export default Footer;
