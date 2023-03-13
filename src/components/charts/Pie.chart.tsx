import React from 'react'
import { ResponsivePie, PieSvgProps } from '@nivo/pie'
import { useTheme } from '@mui/material'

export const Pie: React.FC<PieSvgProps<any>> = ({ data }) => {
    
    const theme = useTheme()

    return (
        <ResponsivePie
            data={data}
            theme={{
                tooltip: {
                    container: {
                        background: theme.palette.background.default
                    }
                },
            }}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.2
                    ]
                ]
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={theme.palette.text.secondary}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        2
                    ]
                ]
            }}
            colors={{ datum: 'data.color' }}
        />
    )
}