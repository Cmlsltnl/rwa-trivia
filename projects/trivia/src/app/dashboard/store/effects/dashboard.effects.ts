import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { switchMap, map, filter, catchError } from 'rxjs/operators';
import { SocialService, StatsService } from '../../../../../../shared-library/src/lib/core/services';
import { Subscribers, Blog, RouterStateUrl, SystemStats } from 'shared-library/shared/model';
import { DashboardActionTypes } from '../actions';
import * as dashboardActions from '../actions/dashboard.actions';
import { UploadTaskSnapshot } from '@angular/fire/storage/interfaces';
import { of } from 'rxjs';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';

@Injectable()
export class DashboardEffects {
    // Save subscription
    @Effect()
    addSubscription$ = this.actions$
        .pipe(ofType(DashboardActionTypes.ADD_SUBSCRIBER))
        .pipe(
            switchMap((action: dashboardActions.AddSubscriber) =>
                this.socialService.checkSubscription(action.payload.subscription)
                    .pipe(
                        map(isSubscribed => {
                            if (isSubscribed) {
                                return new dashboardActions.CheckSubscriptionStatus(true);
                            } else {
                                this.socialService.saveSubscription(action.payload.subscription);
                                return new dashboardActions.CheckSubscriptionStatus(false);
                            }
                        }), catchError(err => of(new dashboardActions.AddSubscriberError(err))))

            ));

    // get total subscription
    @Effect()
    getTotalSubscription$ = this.actions$
        .pipe(ofType(DashboardActionTypes.TOTAL_SUBSCRIBER))
        .pipe(
            switchMap((action: dashboardActions.GetTotalSubscriber) =>
                this.socialService.getTotalSubscription()
                    .pipe(
                        map((totalCount: Subscribers) => new dashboardActions.GetTotalSubscriberSuccess(totalCount))
                    )
            )
        );


    // Load Social Score share url
    @Effect()
    loadSocialScoreShareUrl$ = this.actions$
        .pipe(ofType(DashboardActionTypes.LOAD_SOCIAL_SCORE_SHARE_URL))
        .pipe(
            switchMap((action: dashboardActions.LoadSocialScoreShareUrl) =>
                this.socialService.generateScoreShareImage(action.payload.imageBlob, action.payload.userId)
                    .pipe(
                        map((imageUrl: UploadTaskSnapshot) => new dashboardActions.LoadSocialScoreShareUrlSuccess(imageUrl)))
            ));


    // load blogs
    @Effect()
    getBlogs$ = this.actions$
        .pipe(ofType(ROUTER_NAVIGATION))
        .pipe(
            map((action: any): RouterStateUrl => action.payload.routerState),
            filter((routerState: RouterStateUrl) =>
                routerState.url.toLowerCase().startsWith('/')))
        .pipe(
            switchMap(() =>
                this.socialService.loadBlogs()
                    .pipe(
                        map((blogs: Blog[]) => new dashboardActions.LoadBlogsSuccess(blogs)),
                        catchError(err => of(new dashboardActions.LoadBlogsError(err)))
                    )
            )
        );

        // Load Score
        @Effect()
        LoadLeaderBoardInfo$ = this.actions$
            .pipe(ofType(DashboardActionTypes.LOAD_LEADERBOARD))
            .pipe(
                switchMap((action: dashboardActions.LoadLeaderBoard) =>
                    this.statsService.loadLeaderBoardStat().pipe(
                        map((score: any) => {
                            return new dashboardActions.LoadLeaderBoardSuccess(score);
                        }
                        )
                    )));

        // Load System Stat
        @Effect()
        LoadSystemStat$ = this.actions$
            .pipe(ofType(DashboardActionTypes.LOAD_SYSTEM_STAT))
            .pipe(
                switchMap((action: dashboardActions.LoadSystemStat) =>
                    this.statsService.loadSystemStat().pipe(
                        map((stat: SystemStats) =>
                            new dashboardActions.LoadSystemStatSuccess(stat)
                        ), catchError(err => of(new dashboardActions.LoadSystemStatError(err)))
                    )));

    constructor(
        private actions$: Actions,
        private socialService: SocialService,
        private statsService: StatsService
    ) { }
}
