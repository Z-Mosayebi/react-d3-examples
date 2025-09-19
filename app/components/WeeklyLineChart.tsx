"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

interface WeatherData {
  day: string;
  temp: number;
}

export default function WeeklyLineChart() {
  const ref = useRef<SVGSVGElement | null>(null);
  const [city, setCity] = useState("Berlin");
  const [data, setData] = useState<WeatherData[]>([]);

  // get data base on the city name
  async function fetchWeather(cityName: string) {
    try {
      // 1)  city info
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=1`
      );
      const geoJson = await geoRes.json();
      if (!geoJson.results || geoJson.results.length === 0) {
        alert("City not found");
        return;
      }
      const { latitude, longitude, name, country } = geoJson.results[0];

      // 2) get temprature Data  
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&timezone=Europe%2FBerlin`
      );
      const weatherJson = await weatherRes.json();

      const days: string[] = weatherJson.daily.time;
      const temps: number[] = weatherJson.daily.temperature_2m_max;

      const formatted = days.map((d: string, i: number) => ({
        day: d,
        temp: temps[i],
      }));

      setData(formatted);
      setCity(`${name}, ${country}`);
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  }

  // default Berlin
  useEffect(() => {
    fetchWeather("Berlin");
  }, []);

  // change default
  useEffect(() => {
    if (!ref.current || data.length === 0) return;

    const width = 500;
    const height = 250;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const x = d3
      .scalePoint()
      .domain(data.map((d) => d.day))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.temp)!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line<WeatherData>()
      .x((d) => x(d.day)!)
      .y((d) => y(d.temp));

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove();

    svg.attr("width", width).attr("height", height);

    // خط
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "tomato")
      .attr("stroke-width", 2)
      .attr("d", line);

    // نقاط
    svg
      .selectAll("circle")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.day)!)
      .attr("cy", (d) => y(d.temp))
      .attr("r", 4)
      .attr("fill", "tomato");

    // x = data
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat((d) => d.toString().slice(5)));

    // y= tempartuer
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5));
  }, [data]);

  // submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).city.value;
    fetchWeather(input);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="font-semibold">Weekly Max Temperature (°C)</h2>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          name="city"
          placeholder="Enter city"
          className="border rounded px-2 py-1"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Search
        </button>
      </form>
      <p className="text-gray-600">City: {city}</p>
      <svg ref={ref}></svg>
    </div>
  );
}
