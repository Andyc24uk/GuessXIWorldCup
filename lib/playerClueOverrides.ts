import type { Player } from "./types";

export const careerPathByPlayerId: Record<string, string> = {};

export const notableFactByPlayerId: Record<string, string> = {
  "kevin-de-bruyne": "Won the Champions League as part of Manchester City's 2022-23 treble-winning team.",
  "romelu-lukaku": "Became Belgium's record men's goalscorer before age 25.",
  "jeremy-doku": "Known for explosive one-v-one dribbling from wide areas.",
  "mohamed-salah": "Won both the Premier League and Champions League with Liverpool.",
  "omar-marmoush": "Breakout Bundesliga scoring form earned a major Premier League move.",
  "thibaut-courtois": "Won the Yashin Trophy after starring in Real Madrid's 2022 Champions League final win.",
  "youri-tielemans": "Scored the winning goal for Leicester City in the 2021 FA Cup final.",
  "bernardo-silva": "Won the Champions League as part of Manchester City's 2022-23 treble-winning team.",
  "bruno-fernandes": "Known for chance creation, penalties, and long-range shooting.",
  "cristiano-ronaldo": "Has scored at five different FIFA World Cups.",
  "jordan-pickford": "Saved penalties in major-tournament shootouts for England.",
  "neymar": "Won the Champions League with Barcelona in 2015.",
  "bruno-guimaraes": "Helped Newcastle return to the Champions League after a long absence.",
  "marquinhos": "Reached the 2020 Champions League final with Paris Saint-Germain.",
  "virgil-van-dijk": "Finished runner-up for the 2019 Ballon d'Or.",
  "wataru-endo": "Built a reputation as a ball-winning defensive midfielder in Germany and England.",
  "martin-degaard": "Made his senior Norway debut at age 15.",
  "riyad-mahrez": "Starred in Leicester City's 2015-16 Premier League title win.",
  "david-alaba": "Won multiple Champions League titles across Bayern Munich and Real Madrid.",
  "luka-modric": "Won the 2018 Ballon d'Or after leading Croatia to the World Cup final.",
  "darwin-nunez": "Earned a major European move after a prolific season with Benfica.",
  "trezeguet": "Scored twice for Egypt at the 2018 FIFA World Cup.",
  "jordan-ayew": "Comes from one of Ghana's most famous football families.",
  "anibal-godoy": "A long-serving leader from Panama's first World Cup generation."
};

export function getCareerPathOverride(player: Player): string | undefined {
  return careerPathByPlayerId[player.id];
}

export function getNotableFactOverride(player: Player): string | undefined {
  return notableFactByPlayerId[player.id];
}
