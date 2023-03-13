import React, { useMemo } from 'react'
import dayjs, { Dayjs } from 'dayjs'

export const useCalendar = (selectedDay: Dayjs, selectedWeek: Dayjs[], isMonthMatrixAligned: boolean = true) => {

	// - memoized array of hours in a day
    const hours_arr: string[] = useMemo(() => {
    	return new Array(24).fill(0).map((_, idx) => dayjs().startOf('day').add(idx, 'hour').format('HH:mm'))
    }, [])

    // - configure matrix of dayjs objects for each hour in a day during the week
    const getWeekMatrix = (week: Dayjs[]): Dayjs[][] => {
    	const matrix = hours_arr.map((_, hour_idx) => {
    		return new Array(7).fill(0).map((_, day_idx) => week[day_idx].add(hour_idx, 'hour'))
    	})
    	return matrix
    }

    // - memoized result of building week matrix
    const weekMatrix = useMemo(() => getWeekMatrix(selectedWeek), [selectedWeek])

    // - configure matrix with each hour for selected day
    const getDayMatrix = (day: Dayjs): Dayjs[] => {
    	const matrix = new Array(24).fill(0).map((_, idx) => day.startOf('day').add(idx, 'hour'))
    	return matrix
    }

    // - memoized result of building day matrix
    const dayMatrix = useMemo(() => getDayMatrix(selectedDay), [selectedDay])
    
    // - configure matrix of days in selected day's month
    const getMonthMatrix = (day: Dayjs, isAligned: boolean): Dayjs[] => {
    	if (isAligned) {
    		const alignedDaysInMonth = day.startOf('month').day() + day.daysInMonth() + (6 - day.endOf('month').day())
	    	const matrix = new Array(alignedDaysInMonth).fill(0)
	    		.map((_, idx) => day.startOf('month').add(idx - day.startOf('month').day(), 'day'))
	    	return matrix
    	}
    	return new Array(day.daysInMonth()).fill(0)
            .map((_, idx) => day.startOf('month').add(idx, 'day'))
    }

    // - memoized result of building month matrix
    const monthMatrix = useMemo(() => getMonthMatrix(selectedDay, isMonthMatrixAligned), [selectedDay, isMonthMatrixAligned])

    return {
    	hours_arr,
    	dayMatrix,
    	weekMatrix,
    	monthMatrix
    }

}









