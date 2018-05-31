import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CdkTableModule } from '@angular/cdk/table';
import { ImageCropperModule } from 'ngx-img-cropper';
import { SharedMaterialModule } from './shared-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { ShareButtonModule } from '@ngx-share/button';


import {
  QuestionComponent, QuestionsComponent, QuestionsSearchComponent, QuestionsTableComponent,
  QuestionFormComponent, RejectedQuestionContentComponent, SocialPaletteComponent
} from './components';

@NgModule({
  declarations: [
    QuestionComponent,
    QuestionsComponent,
    QuestionsSearchComponent,
    QuestionsTableComponent,
    QuestionFormComponent,
    RejectedQuestionContentComponent,
    SocialPaletteComponent
  ],
  imports: [
    CommonModule,

    // http client
    HttpClientModule,
    // Forms
    ReactiveFormsModule,
    // cdk
    CdkTableModule,
    // Material
    SharedMaterialModule,
    // Flex
    FlexLayoutModule,
    RouterModule,
    ImageCropperModule,

    HttpClientModule,       // for share counts
    ShareButtonModule.forRoot()

  ],
  providers: [
  ],
  exports: [QuestionComponent, QuestionsComponent, QuestionsSearchComponent, QuestionsTableComponent,
    CommonModule, HttpClientModule, ReactiveFormsModule,
    FlexLayoutModule, QuestionFormComponent,
    SharedMaterialModule, CdkTableModule, RejectedQuestionContentComponent,
    ImageCropperModule, HttpClientModule, ShareButtonModule, SocialPaletteComponent]
})
export class SharedModule { }
