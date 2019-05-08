import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, CategoriesResolver, TagsResolver } from 'shared-library/core/route-guards';
import {
    ProfileSettingsComponent,
    QuestionAddUpdateComponent,
    MyQuestionsComponent,
    InviteFriendsComponent
} from '../components';
import { InviteFriendsDialogComponent } from '../components/invite-friends/invite-friends-dialog/invite-friends-dialog.component';

export const userRoutes: Routes = [
    {
        path: 'profile/:userid',
        component: ProfileSettingsComponent
    },
    {
        path: 'my',
        children: [
        {
            path: 'profile/:userid',
            component: ProfileSettingsComponent
        },
        {
            path: 'questions',
            component: MyQuestionsComponent,
            canActivate: [AuthGuard],
            resolve: { 'categories': CategoriesResolver, 'tags': TagsResolver }
        },
        {
            path: 'invite-friends',
            component: InviteFriendsComponent,
            canActivate: [AuthGuard]
        },
        {
            path: 'questions/add',
            component: QuestionAddUpdateComponent,
            canActivate: [AuthGuard]
        },
        {
            path: 'app-invite-friends-dialog',
            component: InviteFriendsDialogComponent,
            canActivate: [AuthGuard]
        },
    ]}
];
