import React , {useState , useEffect} from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const options = {
    legend: {
      display: false,
    },
    elements: {
      point: {
        radius: 0,
      },
    },
    maintainAspectRatio: false,
    tooltips: {
      mode: "index",
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          return numeral(tooltipItem.value).format("+0,0");
        },
      },
    },
    scales: {
      xAxes: [
        {
          type: "time",
          time: {
            format: "MM/DD/YY",
            tooltipFormat: "ll",
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            callback: function (value, index, values) {
              return numeral(value).format("0a");
            },
          },
        },
      ],
    },
  };
  

      const buildChartData = (data , casesType= 'cases') => {
        let chartData = [];
        let lastDataPoint;
        for(let date in data.cases) {
            if(lastDataPoint){
                const newDataPoint = {
                    x : date,
                    y : data[casesType][date] - lastDataPoint
                }
                chartData.push(newDataPoint);
             }
                lastDataPoint = data[casesType][date];
        };
        return chartData;
    };

    const LineGraph = ({casesType = 'cases', ...props}) => {
        const [data, setData] =useState({});
        const classes = useStyles();

    useEffect(() => {
        const fetchData = async () =>{
        await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then((responce) => {
            return responce.json();
        })
        .then((data) =>{
            const chartData = buildChartData(data , casesType);
            setData(chartData);
        });
        }
        fetchData();
       }, [casesType]);
      
    return (
      <>
        <div className={props.className, classes.root}>
            {data?.length > 0 && (

            <Line 
            options={options}
            data={{
            datasets : [{
            backgroundColor:"rgba(204, 16, 52, 0.5)",
            borderColor:"#CC1034" ,
            data : data,
        },
    ],
}}
            />
            )}
            
        </div>
        </>
    )
}

export default LineGraph
