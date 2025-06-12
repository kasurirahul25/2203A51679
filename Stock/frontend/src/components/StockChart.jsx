import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine
} from "recharts";
import {
  Container, Typography, Select, MenuItem
} from "@mui/material";
import axios from "axios";

const StockPage = () => {
  const [ticker, setTicker] = useState("NVDA");
  const [minutes, setMinutes] = useState(30);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(`http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}`);
        const formatted = res.data.map(item => ({
          time: new Date(item.lastUpdatedAt).toLocaleTimeString(),
          price: item.price
        }));
        setData(formatted);
      } catch (e) {
        console.error("Error fetching stock", e);
      }
    };
    fetchStock();
  }, [ticker, minutes]);

  const avg = data.reduce((acc, val) => acc + val.price, 0) / data.length;

  return (
    <Container>
      <Typography variant="h4">Stock Prices</Typography>
      <Select value={minutes} onChange={e => setMinutes(e.target.value)}>
        {[10, 30, 60].map(min => <MenuItem key={min} value={min}>{min} minutes</MenuItem>)}
      </Select>
      <LineChart width={900} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
        <ReferenceLine y={avg} label="Avg" stroke="red" strokeDasharray="3 3" />
      </LineChart>
    </Container>
  );
};

export default StockPage;
