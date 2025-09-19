import DynamicBarChart from "./components/DynamicBarChart";
import WeeklyLineChart from "./components/WeeklyLineChart";

export default function Home() {
  return (
    <main className="p-8 space-y-8">
      <h1 className="text-xl font-bold">React + D3 Examples</h1>

      {/* Bar chart  */}
      <DynamicBarChart />

      {/* Line chart    */}
      <WeeklyLineChart />
    </main>
  );
}
