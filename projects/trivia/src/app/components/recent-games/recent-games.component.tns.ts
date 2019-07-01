import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserActions } from 'shared-library/core/store/actions';
import { Page } from 'tns-core-modules/ui/page';
import { AppState } from '../../store';
import { RecentGames } from './recent-games';
import { Utils } from 'shared-library/core/services';
import { FirebaseScreenNameConstants } from 'shared-library/shared/model';

@Component({
  selector: 'recent-games',
  templateUrl: './recent-games.component.html',
  styleUrls: ['./recent-games.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class RecentGamesComponent extends RecentGames implements OnInit, OnDestroy {

  // This is magic variable
  // it delay complex UI show Router navigation can finish first to have smooth transition
  renderView = false;

  constructor(store: Store<AppState>,
    cd: ChangeDetectorRef,
    userActions: UserActions,
    private ngZone: NgZone,
    private page: Page,
    private utils: Utils
    ) {
    super(store, cd, userActions);
    this.utils.setScreenNameInFirebaseAnalytics(FirebaseScreenNameConstants.RECENT_COMPLETED_GAMES);
  }

  ngOnInit(): void {
    // update to variable needed to do in ngZone otherwise it did not understand it
    this.page.on('loaded', () => this.ngZone.run(() => {
      this.renderView = true;
      this.cd.markForCheck();
    }));
  }

  ngOnDestroy(): void {
    this.page.off('loaded');
  }
}
