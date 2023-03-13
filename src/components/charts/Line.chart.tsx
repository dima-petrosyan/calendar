import React from 'react'
import { ITask } from '../../types/types'
import dayjs from 'dayjs'
import { ResponsiveLine, LineSvgProps, Point, DatumValue, Serie } from '@nivo/line'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material'

import { TaskTitle } from '../task/TaskTitle'

export const Line: React.FC<LineSvgProps> = ({ data }) => {
    
    const theme = useTheme()
    
    return (
        <ResponsiveLine
            data={data}
            theme={{
                textColor: theme.palette.text.secondary,
                // axis: {
                //     domain: {
                //         line: {
                //             stroke: theme.palette.text.secondary
                //         }
                //     }
                // },
                // grid: {
                //     line: {
                //         stroke: theme.palette.grey[50]
                //     }
                // }
            }}
            margin={{ top: 50, right: 20, bottom: 50, left: 60 }}
            curve='monotoneX'
            yFormat=' >-.2f'
            axisTop={null}
            axisRight={null}
            axisBottom={{
                // orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Date',
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                // orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Number of tasks',
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            colors={{datum: 'color'}}
            pointSize={0}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
            enableSlices="x"
            sliceTooltip={({ slice }) => {
                return (
                    <CustomTooltip slice={slice} data={data} />
                )
            }}
        />
    )
}

type CustomTooltipProps = {
    slice: {
        id: DatumValue
        height: number
        width: number
        x0: number
        x: number
        y0: number
        y: number
        points: Point[]
    }
    data: Serie[]
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ slice, data }) => {
    return (
        <Box sx={(theme) => ({ 
            bgcolor: 'background.default',
            color: 'text.secondary',
            borderRadius: 3,
            boxShadow: theme.shadows[3],
            p: 1,
        })}>
            {
                slice.points.map(point => {
                    return (
                        <>
                            <Box sx={{ minWidth: '150px', maxWidth: '200px' }}>
                                {
                                    data[0].data[point.index].tasks.length > 0 ? (
                                        data[0].data[point.index].tasks.map((task: ITask) => {
                                            return (
                                                <TaskTitle task={task} />
                                            )
                                        })
                                    ) : 'No tasks'
                                }
                            </Box>
                            <Stack sx={{mt: 1}} direction='row' justifyContent='flex-end'>
                                <Typography>
                                    {
                                        data[0].data[point.index].tasks[0]?.startDate.format('D MMMM YYYY')
                                    }
                                </Typography>
                            </Stack>
                        </>
                    )
                })
            }
            
        </Box>
    )
}







