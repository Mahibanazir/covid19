import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent
  
} from "@material-ui/core";
import InfoBox from './InfoBox';

import Table from './Table';
import {prettyPrintStat, sortData} from './util';
import LineGraph from "./LineGraph";


const App = () => {
 
  const [country, setCountry] = useState('worldwide');
  const [countries, setCountries] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState('cases');
  
  
  useEffect(() =>{
      fetch('https://disease.sh/v3/covid-19/all')
      .then((response)=> response.json())
      .then((data) => {
        setCountryInfo(data);
      });
    },[]
  );
 

  useEffect(() => {
    const getCountriesData = async () => {
     await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);

          setTableData(data);
          setCountries(countries);
          setTableData(sortedData);
        
        });
    };
    

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
  const countryCode = event.target.value;
  const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
     
      });
 }
 

  return (
    <div className="app">
       <div className="app__left">
       <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
             >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox active={casesType==='cases'} onClick={e => setCasesType('cases')} title='Coronavirus Cases' cases={prettyPrintStat(countryInfo.todayCases)} total={prettyPrintStat(countryInfo.cases)}/>

          <InfoBox active={casesType==='recovred'} onClick={e => setCasesType('recovred')} title='Recovered' cases={prettyPrintStat(countryInfo.todayRecovered)} total={prettyPrintStat(countryInfo.recovered)}/>

          <InfoBox active={casesType==='deaths'} onClick={e => setCasesType('deaths')} title='Deaths' cases={prettyPrintStat(countryInfo.todayDeaths)} total={prettyPrintStat(countryInfo.deaths)}/>

        </div>
        <h3>Worldwide New {casesType}</h3>
        <LineGraph className="app__graph" casesType={casesType} />
       
       </div>
       

       <Card className="app__right">
         <CardContent>
           <h3>Lives Cases by Country</h3>
           <Table countries={tableData}  />
         </CardContent>
         
       </Card>
       
        </div>
  );
}


export default App;
