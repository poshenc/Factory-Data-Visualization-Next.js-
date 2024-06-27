import { GetActionEventsParams } from "@/app/api/events/actions/request-dto"
import { GetStepsTimeRangeParams } from "@/app/api/events/steps/request-dto"
import { StepsTimeRange } from "@/app/api/events/steps/response-dto"
import { GetEventTimeRangeParams } from "@/app/api/events/time-range/request-dto"
import { EventTimeRange } from "@/app/api/events/time-range/response-dto"
import axios from "axios"

export const fetchEventTimeRange = async (params: GetEventTimeRangeParams) => {
    const { data } = await axios.get<EventTimeRange>('api/events/time-range', { params })
    return data
}

export const fetchActionEvents = async (params: GetActionEventsParams) => {
    const { data } = await axios.get<string[]>('api/events/actions', { params })
    const result = data.filter(event => event !== 'STEP')
    return result
}

export const fetchStepsTimeRange = async (params: GetStepsTimeRangeParams) => {
    const { data } = await axios.get<StepsTimeRange[]>('api/events/steps', { params })
    return data
}