import React, { useEffect, useState } from "react";
import Pie, { ProvidedProps, PieArcDatum } from "@visx/shape/lib/shapes/Pie";
import { scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { GradientPinkBlue } from "@visx/gradient";

import { animated, useTransition, to } from "@react-spring/web";

import getRadiosParityData from "../data/RadioListData";


interface parityScoreInterface {
  label: String;
  usage: number;
}

// accessor functions
const usage = (d: parityScoreInterface) => d.usage;
const frequency = (d: { letter: string; frequency: number }) => d.frequency;

// color scales
const getGenderColor = (radioNames: any) => scaleOrdinal({
  domain: radioNames,
  range: ["lightblue", "pink"],
});
const getRadioColor = (letters: any) => scaleOrdinal({
  domain: letters.map((l: any) => l.letter),
  range: [
    "rgba(93,30,91,1)",
    "rgba(93,30,91,0.8)",
    "rgba(93,30,91,0.6)",
    "rgba(93,30,91,0.4)",
    "rgba(93,30,91,0.2)",
  ],
});

const defaultMargin = { top: 20, right: 20, bottom: 20, left: 20 };

export type PieProps = {
  width: number;
  height: number;
  margin?: typeof defaultMargin;
  animate?: boolean;
};

export default function Example({
  width,
  height,
  margin = defaultMargin,
  animate = true,
}: PieProps) {
  const [letters, setLetters] = useState<{ letter: string; frequency: number }[]>([]);
  const [radios, setRadios] = useState<parityScoreInterface[]>([]);
  const [radioNames, setRadioNames] = useState<String[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const radiosParity = await getRadiosParityData();
      const letters = radiosParity.map(
        (radio) => ({
          letter: radio.name,
          frequency: radio.score,
        })
      );
      let radioNames = radiosParity[0].genderFrequency.map(
        (gender) => gender.gender
      ) as string[];
      setLetters(letters);
      setRadioNames(radioNames);
      let radios = radioNames.map((name) => ({
        label: name,
        usage:
          radiosParity[0].genderFrequency.find((g) => g.gender === name)
            ?.frequency || 0,
      }));
      setRadios(radios);
      console.log(radios);
      console.log(letters);
      console.log(radioNames);
    }
    fetchData();
  }, []);

  if (width < 10) return null;

  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2;
  const centerY = innerHeight / 2;
  const centerX = innerWidth / 2;
  const donutThickness = 60;

  const selectedRadioData = selectedRadio
    ? radios.filter(({ label }) => label === selectedRadio)
    : radios;

  return (
    <svg width={width} height={height}>
      <GradientPinkBlue id="visx-pie-gradient" />
      <rect
        rx={14}
        width={width}
        height={height}
        fill="url('#visx-pie-gradient')"
      />
      <Group top={centerY + margin.top} left={centerX + margin.left}>
        <text
          x={-600} // Ajustez la position horizontale du titre
          y={-400} // Ajustez la position verticale du titre
          fill="white"
          fontSize={18} // Ajustez la taille de police du titre
          fontWeight={600} // Ajustez le poids de la police du titre
        >
          Parité hommes / femmes par radios
        </text>
        <Pie
          data={selectedRadioData}
          pieValue={usage}
          outerRadius={radius}
          innerRadius={radius - donutThickness}
          cornerRadius={3}
          padAngle={0.005}
        >
          {(pie) => (
            <AnimatedPie<parityScoreInterface>
              {...pie}
              animate={animate}
              getKey={(arc) => arc.data.label}
              onClickDatum={({ data: { label } }) =>
                animate &&
                setSelectedRadio(
                  selectedRadio && selectedRadio === label ? null : label
                )
              }
              getColor={(arc) => getGenderColor(radioNames)(arc.data.label)}
            />
          )}
        </Pie>
        <Pie
          data={
            selectedGenre
              ? letters.filter(({ letter }) => letter === selectedGenre)
              : letters
          }
          pieValue={frequency}
          pieSortValues={() => -1}
          outerRadius={radius - donutThickness * 1.3}
        >
          {(pie) => (
            <AnimatedPie<{ letter: string; frequency: number }>
              {...pie}
              animate={animate}
              getKey={({ data: { letter } }) => letter}
              onClickDatum={({ data: { letter } }) =>
                animate &&
                setSelectedGenre(
                  selectedGenre && selectedGenre === letter ? null : letter
                )
              }
              getColor={({ data: { letter } }) => getRadioColor(letters)(letter)}
            />
          )}
        </Pie>
      </Group>
      {animate && (
        <text
          textAnchor="end"
          x={width - 16}
          y={height - 16}
          fill="white"
          fontSize={11}
          fontWeight={300}
          pointerEvents="none"
        >
          Cliquez sur les segments pour mettre à jour
        </text>
      )}
    </svg>
  );
}

// Définition des transitions de react-spring
type AnimatedStyles = { startAngle: number; endAngle: number; opacity: number };

const fromLeaveTransition = ({ endAngle }: PieArcDatum<any>) => ({
  // Entrer depuis 360° si l'angle de fin est > 180°
  startAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  endAngle: endAngle > Math.PI ? 2 * Math.PI : 0,
  opacity: 0,
});
const enterUpdateTransition = ({ startAngle, endAngle }: PieArcDatum<any>) => ({
  startAngle,
  endAngle,
  opacity: 1,
});

type AnimatedPieProps<Datum> = ProvidedProps<Datum> & {
  animate?: boolean;
  getKey: (d: PieArcDatum<Datum>) => string;
  getColor: (d: PieArcDatum<Datum>) => string;
  onClickDatum: (d: PieArcDatum<Datum>) => void;
  delay?: number;
};

function AnimatedPie<Datum>({
  animate,
  arcs,
  path,
  getKey,
  getColor,
  onClickDatum,
}: AnimatedPieProps<any>) {
  const transitions = useTransition<PieArcDatum<any>, AnimatedStyles>(arcs, {
    from: animate ? fromLeaveTransition : enterUpdateTransition,
    enter: enterUpdateTransition,
    update: enterUpdateTransition,
    leave: animate ? fromLeaveTransition : enterUpdateTransition,
    keys: getKey,
  });
  return transitions((props, arc, { key }) => {
    const [centroidX, centroidY] = path.centroid(arc);
    const hasSpaceForLabel = arc.endAngle - arc.startAngle >= 0.1;

    return (
      <g key={key}>
        <animated.path
          d={to([props.startAngle, props.endAngle], (startAngle, endAngle) =>
            path({
              ...arc,
              startAngle,
              endAngle,
            })
          )}
          fill={getColor(arc)}
          onClick={() => {
            // Ajoutez un console.log pour enregistrer le clic
            console.log("Segment cliqué :", getKey(arc));
            onClickDatum(arc);
            /// show the hommes/femmes parity of the radio
            if (getKey(arc) !== "Hommes" && getKey(arc) !== "Femmes") {
              console.log(arc.data);
              // alert(
              //   `Le temps de parole des ${getKey(arc)} sur ${
              //     arc.data.label
              //   } est de ${Math.round(
              //     arc.data
              //   )}%`
              // );
            }
          }}
          onTouchStart={() => {
            // Ajoutez un console.log pour enregistrer le clic
            console.log("Segment tactilé :", getKey(arc));
            onClickDatum(arc);
          }}
        />
        {hasSpaceForLabel && (
          <animated.g style={{ opacity: props.opacity }}>
            <text
              fill="white"
              x={centroidX}
              y={centroidY}
              dy=".33em"
              fontSize={9}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc)}
            </text>
            <text
              fill="white"
              x={centroidX}
              y={centroidY + 20}
              dy=".33em"
              fontSize={9}
              textAnchor="middle"
              pointerEvents="none"
            >
              {getKey(arc) === "Hommes" || getKey(arc) === "Femmes"
                ? `${arc.data.usage * 100}%`
                : `Score de parité: ${Math.round(arc.data.frequency * 100)}`}
            </text>
          </animated.g>
        )}
      </g>
    );
  });
}
