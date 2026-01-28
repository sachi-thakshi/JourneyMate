import React from "react"
import { Stack  } from "expo-router"

const DashBoardLayout = () => {
    return(
        <Stack
            screenOptions={{
                headerShown: false, 
                animation: "slide_from_right"  
            }}
        >
        </Stack>
    )
}

export default DashBoardLayout