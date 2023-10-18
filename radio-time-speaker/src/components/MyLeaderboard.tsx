import RadioListData from "../data/RadioListData";
const MonLeaderboard = () => {
  const radios = RadioListData;

  // Triez les radios par score décroissant
  radios.sort((a, b) => b.score - a.score);

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
          {radios.map((radio, index) => (
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
