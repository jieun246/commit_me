import axios, { AxiosResponse } from 'axios';
import {
  Accounts,
  Attendances,
  AttendancesResponse,
  AccountResponse,
} from './interface';

//해당하는 html 태그 변수 선언
function $<T extends HTMLElement = HTMLDivElement>(selector: string) {
  const element = document.querySelector(selector);
  return element as T;
}

const attendanceList = $('.attendance') as HTMLDivElement;
const rankingList = $('.ranking') as HTMLDivElement;

//출석체크 조회
function searchAttendance(): Promise<AxiosResponse<AttendancesResponse>> {
  return axios.get(
    'http://localhost:8000/attendance/search?startDate=2022-07-03&endDate=2022-07-09',
  );
}

//랭킹 순위 조회
function searchRanking(): Promise<AxiosResponse<AccountResponse>> {
  return axios.get('http://localhost:8000/account/ranking?kind=attendances');
}

//출석체크 Set
async function setAttendance(data: AttendancesResponse) {
  data.forEach((value: Attendances) => {
    //const { user_id, attendance_date } = value;
    //attendanceList.innerHTML += `${user_id} :::: ${attendance_date} <br>`;
    console.log(value);
  });
}

//랭킹 set
function setRanking(data: AccountResponse) {
  data.forEach((value: Accounts) => {
    console.log(value);
  });
}

//setup Data
async function setData() {
  const { data } = await searchAttendance();
  setAttendance(data);
  //const { data2 } = await searchRanking();
  //setRanking(data2);
}

setData();
