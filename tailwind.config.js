/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.jsx',
    './resources/**/*.js',
  ],
  theme: {
    extend: {
      colors:{ /* ...Medico Blue... */
      primary: "#20A0D8",
      white: "#fffffe",

      Headline: "#094067",
      Paragraph: "5f6c7b",

      Button: "#3da9fc",
      Buttontext: "#fffffe",
      
      Background: "#3D3D3D",
      Backgroundfooter: "#272932",

      darkblue: "#094067",

      Green: "#00E593",
      Red: "#FF6262",

      LightGray: "#DEDEDE",
      DarkGray: "#CCCCCC",

      HeavyGray: "#7C7777",

      LightBlue:"#20A0D8",
      DarkBlue:"#0E4C67",

    //  Illustration
      Stroke:"#094067",
      White:"fffffe",
      Hightlight:"#3da9fc",
      Secondary:"#90b4ce",
      Tertiary:"#ef4565"

    },
      fontFamily:{
        SpecHeadline : [ "Spectral", "serif"],
        SpecText: ["Spectral", "serif"],
        KarNav: ["Karla","sans-serif"]
      }
    },
  },
  plugins: [],
  important:true,
}

