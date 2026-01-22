import React from "react";
import { TimelineLayout } from "./TimelineLayout";
import { timeLineData } from "../../constants/timelineData";


const  TimeLine=() =>{
  return (
    <div className="w-full">
      <TimelineLayout data={timeLineData} />
    </div>
  );
}

export default TimeLine;
