import type { Trip, TripStopTime } from "@/shared/api/types";
import { BUS_51B_12345, BUS_51B_67890 } from "./fleet";
import {
  RV_HCM_DL_MAIN,
  RV_HN_DN_MAIN,
  SCHEDULE_HCM_DL_DAILY,
  SCHEDULE_HN_DN_DAILY,
  STOP_DL_HOA_BINH,
  STOP_DL_TRUNG_TAM,
  STOP_DN_HAI_CHAU,
  STOP_DN_TRUNG_TAM,
  STOP_HCM_AN_SUONG,
  STOP_HCM_MIEN_DONG,
  STOP_HN_GIAP_BAT,
  STOP_HN_MY_DINH,
} from "./routes";

function hnDnStopTimes(tripId: string): TripStopTime[] {
  return [
    {
      id: `${tripId}__stop1`,
      tripId,
      stopId: STOP_HN_MY_DINH.id,
      stopSequence: 1,
      arrivalOffsetMin: null,
      departureOffsetMin: 0,
      stopRole: "PICKUP",
    },
    {
      id: `${tripId}__stop2`,
      tripId,
      stopId: STOP_HN_GIAP_BAT.id,
      stopSequence: 2,
      arrivalOffsetMin: 30,
      departureOffsetMin: 40,
      stopRole: "PICKUP",
    },
    {
      id: `${tripId}__stop3`,
      tripId,
      stopId: STOP_DN_TRUNG_TAM.id,
      stopSequence: 3,
      arrivalOffsetMin: 760,
      departureOffsetMin: 770,
      stopRole: "DROPOFF",
    },
    {
      id: `${tripId}__stop4`,
      tripId,
      stopId: STOP_DN_HAI_CHAU.id,
      stopSequence: 4,
      arrivalOffsetMin: 780,
      departureOffsetMin: null,
      stopRole: "DROPOFF",
    },
  ];
}

function hcmDlStopTimes(tripId: string): TripStopTime[] {
  return [
    {
      id: `${tripId}__stop1`,
      tripId,
      stopId: STOP_HCM_MIEN_DONG.id,
      stopSequence: 1,
      arrivalOffsetMin: null,
      departureOffsetMin: 0,
      stopRole: "PICKUP",
    },
    {
      id: `${tripId}__stop2`,
      tripId,
      stopId: STOP_HCM_AN_SUONG.id,
      stopSequence: 2,
      arrivalOffsetMin: 25,
      departureOffsetMin: 35,
      stopRole: "PICKUP",
    },
    {
      id: `${tripId}__stop3`,
      tripId,
      stopId: STOP_DL_TRUNG_TAM.id,
      stopSequence: 3,
      arrivalOffsetMin: 405,
      departureOffsetMin: 415,
      stopRole: "DROPOFF",
    },
    {
      id: `${tripId}__stop4`,
      tripId,
      stopId: STOP_DL_HOA_BINH.id,
      stopSequence: 4,
      arrivalOffsetMin: 420,
      departureOffsetMin: null,
      stopRole: "DROPOFF",
    },
  ];
}

const TRIP_HN_DN_MORNING_ID = "trip-hn-dn-0810-0800";
const TRIP_HN_DN_NIGHT_ID = "trip-hn-dn-0810-2000";
const TRIP_HCM_DL_MORNING_ID = "trip-hcm-dl-0810-0600";

export const TRIP_HN_DN_MORNING: Trip = {
  id: TRIP_HN_DN_MORNING_ID,
  busId: BUS_51B_12345.id,
  scheduleId: SCHEDULE_HN_DN_DAILY.id,
  routeVariantId: RV_HN_DN_MAIN.id,
  departureTime: "2026-08-10T08:00:00+07:00",
  arrivalTime: "2026-08-10T21:00:00+07:00",
  isActive: true,
  stopTimes: hnDnStopTimes(TRIP_HN_DN_MORNING_ID),
};

export const TRIP_HN_DN_NIGHT: Trip = {
  id: TRIP_HN_DN_NIGHT_ID,
  busId: BUS_51B_12345.id,
  scheduleId: SCHEDULE_HN_DN_DAILY.id,
  routeVariantId: RV_HN_DN_MAIN.id,
  departureTime: "2026-08-10T20:00:00+07:00",
  arrivalTime: "2026-08-11T09:00:00+07:00",
  isActive: true,
  stopTimes: hnDnStopTimes(TRIP_HN_DN_NIGHT_ID),
};

export const TRIP_HCM_DL_MORNING: Trip = {
  id: TRIP_HCM_DL_MORNING_ID,
  busId: BUS_51B_67890.id,
  scheduleId: SCHEDULE_HCM_DL_DAILY.id,
  routeVariantId: RV_HCM_DL_MAIN.id,
  departureTime: "2026-08-10T06:00:00+07:00",
  arrivalTime: "2026-08-10T13:00:00+07:00",
  isActive: true,
  stopTimes: hcmDlStopTimes(TRIP_HCM_DL_MORNING_ID),
};

export const mockTrips: Trip[] = [TRIP_HN_DN_MORNING, TRIP_HN_DN_NIGHT, TRIP_HCM_DL_MORNING];
