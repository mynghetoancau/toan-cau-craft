import { Cormorant, Lato, League_Spartan } from "next/font/google";

//cormorant
export const cormorantRegular = Cormorant({
    subsets: ['latin'],
    display: 'swap',
    weight: "400"
})

export const cormorantMedium = Cormorant({
  subsets: ['latin'],
  display: 'swap',
  weight: "500"
})

export const cormorantSemiBold = Cormorant({
  subsets: ['latin'],
  display: 'swap',
  weight: "600"
})

export const cormorantSemiBoldItalic = Cormorant({
  subsets: ['latin'],
  display: 'swap',
  weight: "600",
  style: 'italic'
})


//lato
export const latoRegular = Lato({
  subsets: ['latin'],
  display: 'swap',
  weight: "400"
})

export const latoBold = Lato({
  subsets: ['latin'],
  display: 'swap',
  weight: "700"
})

//league spartan
export const leagueSpartanRegular = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
  weight: "400"
})

export const leagueSpartanMedium = League_Spartan({
  subsets: ['latin'],
  display: 'swap',
  weight: "500"
})