import { IGameSystem } from '@shared/models/game.interface';

export const gameSystems: IGameSystem[] = [
  {_id: 1, name: 'Dungeons and Dragons'},
  {_id: 2, name: 'Coriolis'},
  {_id: 3, name: 'Vampire: The Masquerade'},
  {_id: 4, name: 'Pathfinder'},
  {_id: 5, name: 'Mörk Borg'},
  {_id: 6, name: 'YKY'},
  {_id: 7, name: 'Delta Green'},
  {_id: 8, name: 'Shadowrun'},
  {_id: 9, name: 'Cyberpunk'},
  {_id: 10, name: 'GURPS'},
  {_id: 11, name: 'Call of Cthulhu'},
  {_id: 12, name: 'Warhammer Age of Sigmar'},
  {_id: 13, name: 'Warhammer 40k'},
  {_id: 14, name: 'Warhammer Fantasy Roleplay'},

  {_id: 998, name: 'Narrative Adventure'},
  {_id: 999, name: 'Інша гра'},
].sort((a, b) => (a.name < b.name) ? -1 : 1);
