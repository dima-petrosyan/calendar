import { ResponsiveTimeRange, CalendarDatum } from '@nivo/calendar'
import { useTheme } from '@mui/material'
import dayjs from 'dayjs'

type TimeRangeProps = {
	data: CalendarDatum[]
}

export const TimeRange: React.FC<TimeRangeProps> = ({ data }) => {

	const theme = useTheme()

	return (
	    <ResponsiveTimeRange
	    	theme={{
	    		tooltip: {
	    			container: {
	    				background: theme.palette.background.default,
	    				color: theme.palette.text.secondary,
	    			}
	    		},
	    	}}
	        data={data}
	        from={dayjs().startOf('year').format('YYYY-MM-DD')}
	        to={dayjs().endOf('year').format('YYYY-MM-DD')}
	        emptyColor={theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eeeeee'}
	        colors={[ '#97e3d5', '#61cdbb', '#e8c1a0', '#f47560' ]}
	        margin={{ top: 40, right: 0, bottom: 0, left: 0 }}
	        dayBorderWidth={2}
	        dayBorderColor={theme.palette.background.default}
	        weekdayTicks={[]}
	        weekdayLegendOffset={0}
	    />
	)
}