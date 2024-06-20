import React from 'react';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const DashboardCard = ({title, value, delta_per, color, Icon}) => {
    const value_formatter = (value) => {
        // 1000 - K, 1,000,000 - M , 1,000,000,000 - B
        if(value >= 1_000_000_000)
            return `${(value/1_000_000_000).toFixed(2)} B`;
        else if(value >= 1_000_000)
            return `${(value/1_000_000).toFixed(2)} M`;
        else if(value >= 1000)
            return `${(value/1000).toFixed(2)} K`;
        else
            return value;
    }
  return (
    <div className='w-64 h-44 bg-white rounded-xl drop-shadow-lg p-4 flex flex-col justify-around'>
      <div className='font-semibold text-2xl'>{title}</div>
      <div className='flex flex-row'>
        <div className='flex flex-col flex-1'>
            <span className='text-3xl font-semibold'>{value_formatter(value)}</span>
            <span className={`text-sm ${delta_per > 0 ? "text-green-500" :"text-red-500"}`}>{delta_per > 0 ? <TrendingUpIcon/> : <TrendingDownIcon/>} {delta_per}%</span>
            <span className='text-sm'>Since last month</span>
        </div>
        <div className=' flex items-center justify-center'>
            <div className='p-2 drop-shadow-lg bg-slate-200 rounded-full'>
                <Icon sx={{color}}/>
            </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardCard
