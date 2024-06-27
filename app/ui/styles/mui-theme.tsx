import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
    components: {
        // Inputs
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    width: '100%',
                    fontSize: '1rem',
                    fontFamily: "NotoSansTC-Medium",
                    "& .MuiOutlinedInput-notchedOutline": {
                        border: '0.125rem solid #04203c'
                    },
                    // "&:hover": {
                    //     "& .MuiOutlinedInput-notchedOutline": {
                    //         border: '0.125rem solid #04203c'
                    //     }
                    // },
                    "&.Mui-focused": {
                        "& .MuiOutlinedInput-notchedOutline": {
                            border: '0.125rem solid #04203c'
                        }
                    }
                }
            }
        },
        //Select
        MuiSelect: {
            styleOverrides: {
                root: {
                    borderRadius: '0.3125rem'
                },
                select: {
                    padding: '0.825rem 0.875rem'
                }
            }
        },
        // MenuItem
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontSize: '1rem',
                    fontFamily: 'NotoSansTC-Medium'
                }
            }
        }
    }
})

export default muiTheme;
