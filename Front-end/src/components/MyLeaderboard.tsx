import getRadiosParityData from "../data/RadioListData";
import { useEffect, useState } from "react";

const MonLeaderboard = () => {
  const [radios, setRadios] = useState([]) as any;
  useEffect(() => {
    async function fetchData() {
      const radiosParity = await getRadiosParityData();
      setRadios(radiosParity);
    }
    fetchData();
  }, []);

  useEffect(() => {
    radios.sort((a: any, b: any) => b.score - a.score);
  }, [radios]);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h2 className="text-2xl font-bold mb-4">Classement des Radios</h2>
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Position</th>
            <th className="border p-2">Nom de la Radio</th>
            <th className="border p-2">Temps d'antenne</th>
            <th className="border p-2">Score de parité</th>
          </tr>
        </thead>
        <tbody>
          {radios.map((radio: any, index: any) => (
            <tr key={radio.id}>
              <td className="border p-2">{index + 1}</td>
              <td className="border p-2">{radio.name}</td>
              <td className="border p-2">{radio.usage}</td>
              <td className="border p-2">{radio.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MonLeaderboard;
