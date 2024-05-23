import { create } from 'zustand'

export const useData = create((set, get) => {
    return {
        //

        seriesSet: [],

        activeSeriesID: false,
    }
})
