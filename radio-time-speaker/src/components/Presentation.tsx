import React from "react";

function Presentation() {
  return (
    <div className="p-4 bg-purple-700">
      <div>
        <h2 className="text-2xl font-semibold text-white mb-4">
          Promouvoir l'égalité des sexes dans le temps de parole sur les radios
          de Radio France
        </h2>
        <p className="text-white">
          Bienvenue dans notre application qui vise à promouvoir l'égalité des
          sexes dans le temps de parole sur les radios de Radio France. Cette
          application analyse et affiche les données sur la répartition du temps
          de parole entre les genres masculin et féminin sur les stations de
          Radio France.
        </p>
        <p className="text-white mt-4">
          Grâce à des graphiques interactifs et des données en temps réel, notre
          objectif est de sensibiliser à l'égalité des sexes et de mettre en
          évidence les domaines où des améliorations sont nécessaires. Nous
          croyons en une société égalitaire, y compris dans le domaine des
          médias, et cette application est notre contribution pour y parvenir.
        </p>
        {/* Ajoutez plus de contenu au besoin */}
      </div>
    </div>
  );
}

export default Presentation;
