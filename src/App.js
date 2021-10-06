import React from 'react';
import './App.css';
import { Select } from 'antd';
import 'antd/dist/antd.css';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

function App() {
  const [data, setData] = React.useState([]);

  const { Option } = Select;

  const loadStock = (symbol) => {
    // use your own server for testing and my saved JSON files.
    // you need to copy your files to your server
    // const URL_PATH = 'https://YOUR_SERVER/PATH/';
    // const url = URL_PATH + symbol + '.json';

    // use in real case - Alpha Vantage
    const API_KEY = 'L40HAQ0Q44I6R325';
    const URL_PATH =
      'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY';
    const url = URL_PATH + '&symbol=' + symbol + '&apikey=' + API_KEY;

    // use axios to get data
    axios.get(url).then((res) => {
      // store loaded data to local variable
      var data = [];
      // take only 10 first
      var countMAX = 10;
      var count = 0;
      // loop keys stored in json like: "2020-02-20", "2020-02-21", etc...
      Object.keys(res.data['Time Series (Daily)']).forEach(function (key) {
        // add count and take only countMAX
        count++;
        if (count < countMAX) {
          // push loaded json data to array with keys: data, open, etc...
          data.push({
            date: key,
            open: res.data['Time Series (Daily)'][key]['1. open'],
            high: res.data['Time Series (Daily)'][key]['2. high'],
            low: res.data['Time Series (Daily)'][key]['3. low'],
            close: res.data['Time Series (Daily)'][key]['4. close'],
            volume: res.data['Time Series (Daily)'][key]['5. volume'],
          });
        }
      });
      setData(data);
    });
  };

  function handleChange(value) {
    console.log(`selected ${value}`);
    loadStock(value);
  }

  return (
    <div>
      <div
        className="App"
        style={{
          flex: 'display',
          alignSelf: 'center',
        }}
      >
        <h1>Stock - Time Series</h1>
        <Select
          defaultValue="AAPL"
          style={{ width: 120 }}
          onChange={handleChange}
        >
          <Option value="AAPL">Apple</Option>
          <Option value="AMZN">Amazon</Option>
          <Option value="NOK">Nokia</Option>
          <Option value="TSLA">Tesla</Option>
        </Select>
      </div>
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin', 'dataMax']} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="open"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="monotone" dataKey="close" stroke="#82ca9d" />
            <Line type="monotone" dataKey="high" stroke="#ff0000" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
