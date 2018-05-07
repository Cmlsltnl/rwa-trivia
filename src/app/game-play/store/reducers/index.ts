import { ActionReducerMap, createSelector, createFeatureSelector } from '@ngrx/store';

import { Game, Question } from '../../../model';
import { currentGame, newGameId, currentGameQuestion, updateGame, gameInvites, userAnsweredQuestion } from './game-play.reducer';

export * from './game-play.reducer';

export interface GamePlayState {
  currentGame: Game;
  newGameId: string;
  currentGameQuestion: Question,
  updateGame: any,
  gameInvites: Game[]
  userAnsweredQuestion: any
}

export const reducer: ActionReducerMap<GamePlayState> = {
  currentGame: currentGame,
  newGameId: newGameId,
  currentGameQuestion: currentGameQuestion,
  updateGame: updateGame,
  gameInvites: gameInvites,
  userAnsweredQuestion: userAnsweredQuestion
};

export const gameplayState = createFeatureSelector<GamePlayState>('gameplay');
