import "./App.css";
import ParentSize from "@visx/responsive/lib/components/ParentSize";

import ParityChart from "./components/ParityChart";
import MyLeaderboard from "./components/MyLeaderboard";
import Presentation from "./components/Presentation";

function App() {
  return (
    <>
      <Presentation />
      <ParentSize>
        {({ width, height }) => <ParityChart width={width} height={height} />}
      </ParentSize>
      <MyLeaderboard />,
    </>
  );
}

export default App;
