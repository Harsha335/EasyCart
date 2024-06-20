import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale,
} from "chart.js";
// import date-fns locale:  time
import "chartjs-adapter-date-fns";
import { parseISO, format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  TimeScale
); // filler for filling bg color

const RevenueChart = ({ revenue, timeUnit, tooltipTitle, displayXscale }) => {
  const { currentData, previousData, currMinDate, currMaxDate } = revenue;

  const options = {
    responsive: true,
    tension: 0.3, //  Set the tension (curvature) of the line to your liking.  (You may want to lower this a smidge.)
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const originalDate = context[0].raw.originalDate;
            return format(parseISO(originalDate), tooltipTitle);
          },
          label: (context) => {
            return `${context?.dataset?.label}: ${context?.raw?.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: timeUnit,
          tooltipFormat: tooltipTitle,
          displayFormats: {
            day: displayXscale,
            month: displayXscale,
          },
        },
        min: new Date(currMinDate).toJSON().slice(0, 10),
        max: new Date(currMaxDate).toJSON().slice(0, 10),
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    // labels,
    datasets: [
      {
        label: "Current Year",
        // {x: '2024-02-20', y:200, originalDate: '2024-02-20'},
        data: currentData.map((record) => {
          return {
            x: new Date(
              record._id.year,
              record._id?.month ? record._id.month - 1 : 0,
              record._id?.day || 1
            ).toISOString(),
            y: record.totalAmount,
            originalDate: new Date(
              record._id.year,
              record._id?.month ? record._id.month - 1 : 0,
              record._id?.day || 1
            ).toISOString(),
          };
        }),
        borderColor: "rgb(8, 0, 236)",
        backgroundColor: "rgb(99, 143, 255)",
        fill: {
          target: "origin", // Set the fill options
          above: "rgba(15, 77, 246, 0.3)",
        },
      },
      {
        label: "Previous Year",
        data: previousData.map((record) => {
          return {
            x: new Date(
              record._id.year + 1,
              record._id?.month ? record._id.month - 1 : 0,
              record._id?.day || 1
            ).toISOString(),
            y: record.totalAmount,
            originalDate: new Date(
              record._id.year,
              record._id?.month ? record._id.month - 1 : 0,
              record._id?.day || 1
            ).toISOString(),
          };
        }),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(73, 170, 235, 0.3)",
        fill: "origin", // Set the fill options
      },
    ],
  };
//   console.log("options : ", options);
//   console.log("data : ", data);

  return (
    <>
      <Line options={options} data={data} />
    </>
  );
};

export default RevenueChart;
