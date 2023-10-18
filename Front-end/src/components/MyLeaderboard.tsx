import getRadiosParityData from "../data/RadioListData";
import { useEffect, useState } from "react";

const toHHMMSS = (secs: any) => {
  let sec_num = parseInt(secs, 10)
  let hours   = Math.floor(sec_num / 3600)
  let minutes = Math.floor(sec_num / 60) % 60
  let seconds = sec_num % 60

  let hhmmss = [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v,i) => v !== "00" || i > 0);
  let result = "";
  for (let i = 0; i < 3; i++) {
    result += hhmmss[i];
    if (i === 0)
      result += "h ";
    else if (i === 1)
        result += "m ";
    else
      result += "s";
  }
  return result;
}

const MonLeaderboard = () => {
  const [radios, setRadios] = useState([]) as any;
  useEffect(() => {
    async function fetchData() {
      let radiosParity = await getRadiosParityData();
      radiosParity = radiosParity.sort((a: any, b: any) => b.usage - a.usage);
      setRadios(radiosParity);
    }
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">Classement des Radios</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Position</th>
            <th className="border p-2">Nom de la Radio</th>
            <th className="border p-2">Temps d'antenne</th>
          </tr>
        </thead>
        <tbody>
          {radios.map((radio: any, index: any) => (
            <tr key={radio.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{radio.name}</td>
              <td className="border p-2">{toHHMMSS(radio.usage)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonLeaderboard;
