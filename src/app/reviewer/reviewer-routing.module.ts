import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RandomFoodComponent } from './random-food/random-food.component';
import { ReviewerHomepageComponent } from './homepage/homepage.component';
import { SearchRestaurantComponent } from './search-result/search-result.component';
import { RestaurantDetailComponent } from './restaurant-detail/restaurant-detail.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewerHomepageComponent
  },
  {
    path: 'search',
    component: SearchRestaurantComponent
  },
  {
    path: 'random',
    component: RandomFoodComponent
  },
  {
    path: 'restaurant',
    component: RestaurantDetailComponent
  },
  {
    path: '',
    redirectTo: '/reviewer',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewerRoutingModule { }
