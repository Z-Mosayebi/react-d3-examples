"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function DynamicBarChart() {
  const [data, setData] = useState<number[]>([10, 25, 15, 30, 20]);
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const width = 400;
    const height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };

    const x = d3
      .scaleBand()
      .domain(data.map((_, i) => i.toString()))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data)!])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const svg = d3.select(ref.current);
    svg.selectAll("*").remove(); // remove previos ghraph

    // bar chart
    svg
      .append("g")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (_, i) => x(i.toString())!)
      .attr("y", (d) => y(d))
      .attr("height", (d) => y(0) - y(d))
      .attr("width", x.bandwidth())
      .attr("fill", "steelblue");

    //  x
    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    //  y
    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5));
  }, [data]);

  // accident data
  const updateData = () => {
    const newData = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 40) + 5
    );
    setData(newData);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <svg ref={ref} width={400} height={200}></svg>
      <button
        onClick={updateData}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Update Data
      </button>
    </div>
  );
}
