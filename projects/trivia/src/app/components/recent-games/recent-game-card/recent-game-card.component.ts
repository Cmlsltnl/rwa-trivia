import { Component, Input, OnChanges, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { User, Game, Category, PlayerMode, GameStatus } from 'shared-library/shared/model';
import { Utils } from 'shared-library/core/services';
import { AppState, appState, categoryDictionary } from '../../../store';
import { UserActions } from 'shared-library/core/store/actions';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
    selector: 'recent-game-card',
    templateUrl: './recent-game-card.component.html',
    styleUrls: ['./recent-game-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

@AutoUnsubscribe({ 'arrayName': 'subscriptions' })
export class RecentGameCardComponent implements OnInit, OnChanges, OnDestroy {
    @Input() game: Game;
    // @Input() userDict: { [key: string]: User };
    @Input() user: User;
    userDict$: Observable<{ [key: string]: User }>;
    userDict: { [key: string]: User } = {};
    PlayerMode = PlayerMode;
    correctAnswerCount: number;
    questionIndex: number;
    myTurn: boolean;
    categoryDictObs: Observable<{ [key: number]: Category }>;
    categoryDict: { [key: number]: Category };
    otherUserId: string;
    userProfileImageUrl: string;
    GameStatus = GameStatus;
    subscriptions = [];


    constructor(private store: Store<AppState>, private userActions: UserActions, public utils: Utils, private cd: ChangeDetectorRef) {
        this.categoryDictObs = store.select(categoryDictionary);
        this.subscriptions.push(this.categoryDictObs.subscribe(categoryDict => this.categoryDict = categoryDict));
    }

    ngOnInit(): void {
        this.userDict$ = this.store.select(appState.coreState).pipe(select(s => s.userDict));
        this.subscriptions.push(this.userDict$.subscribe(userDict => {
        this.userDict = userDict;
            this.cd.markForCheck();
        }));

        if (this.game) {
            this.otherUserId = this.getOpponentId(this.game);
            if (this.otherUserId !== undefined) {
                if (this.userDict[this.otherUserId] === undefined) {
                    this.store.dispatch(this.userActions.loadOtherUserProfile(this.otherUserId));
                    this.cd.markForCheck();
                }
            }
            this.userProfileImageUrl = this.getImageUrl(this.user);
        }
    }

    getOpponentId(game) {
        return game.playerIds.filter(userId => userId !== this.user.userId)[0];
    }

    ngOnChanges() {
        // if (this.game) {
        //     this.otherUserId = this.getOpponentId(this.game);
        //     if (this.otherUserId !== undefined) {
        //         if (this.userDict[this.otherUserId] === undefined) {
        //             this.store.dispatch(this.userActions.loadOtherUserProfile(this.otherUserId));
        //         }
        //     }
        //     this.userProfileImageUrl = this.getImageUrl(this.user);
        // }
    }

    getImageUrl(user: User) {
        return this.utils.getImageUrl(user, 44, 40, '44X40');
    }

    ngOnDestroy() {
        // this.cd.detach();
    }
}
