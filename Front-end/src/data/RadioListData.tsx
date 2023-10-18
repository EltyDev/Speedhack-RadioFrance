import { getRadiosParity } from "./API.js"

type GenderFrequency = {
  gender: string;
  frequency: number;
};

export type RadioData = {
  id: number;
  name: string;
  score: number;
  usage: number;
  genderFrequency: GenderFrequency[];
};

const getRadiosParityData = async () => {
  const radiosParity = await getRadiosParity() as { [key: string]: number[] };

  return [
    {
      id: 0,
      name: "France Inter",
      score: 10,
      usage: 1233,

      genderFrequency: [
        { gender: "Hommes", frequency: radiosParity["France Inter"][1] },
        { gender: "Femmes", frequency: radiosParity["France Inter"][2] },
      ],
    },

    {
      id: 1,
      name: "France Info",
      score: 10,
      usage: 1233,

      genderFrequency: [
        { gender: "Hommes", frequency: radiosParity["France Info"][1] },
        { gender: "Femmes", frequency: radiosParity["France Info"][2] },
      ],
    },

    {
      id: 2,
      name: "France Culture",
      score: 10,
      usage: 1233,

      genderFrequency: [
        { gender: "Hommes", frequency: radiosParity["France Culture"][1] },
        { gender: "Femmes", frequency: radiosParity["France Culture"][2] },
      ],
    },
  ] as RadioData[];
};

export default getRadiosParityData;
