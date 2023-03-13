import React from 'react'

declare module '@mui/material/styles' {

  interface Palette {
    tomato: Palette['primary']
  }

  interface PaletteOptions {
  	tomato: PaletteOptions['primary']
  }
 
}

declare module '@mui/material/Badge' {
  interface BadgePropsColorOverrides {
  	tomato: true
  }
}