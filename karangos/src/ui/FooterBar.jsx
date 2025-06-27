import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import LocalCafeIcon from '@mui/icons-material/LocalCafe';

export default function FooterBar() {
  return (
    <Box 
      component="footer" 
      sx={{ 
        backgroundColor: 'action.disabledBackground',
        display: 'flex',
        justifyContent: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100vw'
      }}
    >
      <Typography 
        variant="caption" 
        gutterBottom
        sx={{
          py: '12px', 
          '& a': {
            color: 'secondary.light'
          }
        }}
      >
      Desenvolvido por <a href="deyvidrosa@fatec.sp.gov.br">[Deyvid Blendal Conrado Rosa]</a> <LocalCafeIcon fontSize="small" />
      </Typography>
    </Box>
  );
}