import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ReviewerRoutingModule } from './reviewer-routing.module';
import { ReviewerHomepageComponent } from './homepage/homepage.component';
import { ModalFoodComponent } from './modal-food/modal-food.component';
import { ModalDessertComponent } from './modal-dessert/modal-dessert.component';
import { RandomFoodComponent } from './random-food/random-food.component';
import { SearchRestaurantComponent } from './search-result/search-result.component';

@NgModule({
  declarations: [
    ReviewerHomepageComponent,
    ModalFoodComponent,
    ModalDessertComponent,
    RandomFoodComponent,
    SearchRestaurantComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    ReviewerRoutingModule
  ]
})

export class ReviewerModule { }