import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Restaurant, RestaurantDetailModel, SocialContactModel } from 'src/models/restaurant-info.model';
import { GetReviewInfoRequest, ReviewInfoModel } from 'src/models/review-info.model';
import { RestaurantService } from '../restaurant.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { ResponseModel } from 'src/models/response.model';
import { LocalStorageKey } from 'src/constant/local-storage-key.constant';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class RestaurantDashboardComponent implements OnInit {

  @Input() isLoading: boolean = true;

  Info: Restaurant;
  Reviews: Array<ReviewInfoModel>
  SocialContact: Array<SocialContactModel>;

  TotalReview: number = 0;
  TotalRating: number = 0;

  TodayReview: Array<ReviewInfoModel> = [];
  TodayRating: number = 0;

  CountGoodReview: number = 0;

  Star: Array<string>;
  RestaurantType: Array<string>;
  awsS3Url = environment.awsS3Url;
  userId: string;
  restaurantId: string;


  constructor(
    private restaurantService: RestaurantService,
    private localStorageService: LocalStorageService,
  ) { }

  ngOnInit(): void {
    this.userId = this.localStorageService.get<string>(LocalStorageKey.userId) ?? '';
    this.restaurantId = this.localStorageService.get<string>(LocalStorageKey.restaurantId) ?? '';
    this.getRestaurantDetail();
    this.getRestaurantReviews();
  }

  getRestaurantDetail() {
    let request = new GetReviewInfoRequest();
    request.userId = this.userId;
    request.restaurantId = this.restaurantId;
    this.restaurantService.getRestaurantDetail(request).subscribe(
      (response: ResponseModel<RestaurantDetailModel>) => {
        if (response && response?.status === 200) {
          this.Info = response.data.restaurantInfo;
          this.SocialContact = response.data.socialContact;
        }
    })
  }

  getRestaurantReviews() {
    this.restaurantService.getRestaurantReviews(this.restaurantId).subscribe(
      (response: ResponseModel<Array<ReviewInfoModel>>) => {
        if (response && response?.status === 200) {
          this.Reviews = response.data;
          
          if (this.Reviews.length != 0) {
            this.TotalReview = this.Reviews.length
            let ratingCount = 0;
            this.Reviews.forEach(x => { 
              ratingCount += x.rating
            });
            this.TotalRating = ratingCount/this.Reviews.length
            
            this.Reviews.forEach(element => {
              let today = new Date();
              let reviewDate = new Date(element.createAt)
              if (this.checkIsToday(today,reviewDate)) {
                this.TodayReview.push(element);
              }
              if (element.rating >= 3) {
                this.CountGoodReview += 1;
              }
              element.reviewTimeString = this.getReviewTimeInString(reviewDate)
            });

            if (this.TodayReview.length != 0) {
              let ratingCount = 0;
              this.TodayReview.forEach(x => { 
                ratingCount += x.rating;
              });
              this.TodayRating = ratingCount/this.TodayReview.length;
            }

          }
          this.Star = this.getRatingStarArray(this.TodayRating);
          this.isLoading = false;
        }
        else {
          this.Reviews = [];
          this.getRatingStarArray(this.TodayRating);
          this.isLoading = false;
        }
    })
  }

  checkIsToday(d1: Date, d2: Date) {
    let result = (d1.getFullYear() == d2.getFullYear() &&
            d1.getMonth() == d2.getMonth() &&
            d1.getDate() == d2.getDate());
    return result;  
  }

  getRatingStarArray(rating: number) {
    switch (rating) {
      case 5:
        return ["star", "star", "star", "star", "star"]
      case 4.5:
        return ["star", "star", "star", "star", "star_half"]
      case 4:
        return ["star", "star", "star", "star", "star_empty"]
      case 3.5:
        return ["star", "star", "star", "star_half", "star_empty"]
      case 3:
        return ["star", "star", "star", "star_empty", "star_empty"]
      case 2.5:
        return ["star", "star", "star_half", "star_empty", "star_empty"]
      case 2:
        return ["star", "star", "star_empty", "star_empty", "star_empty"]
      case 1:
        return ["star", "star_empty", "star_empty", "star_empty", "star_empty"]
      default:
        return ["star_empty", "star_empty", "star_empty", "star_empty", "star_empty"]
    }
  }

  getReviewTimeInString(date: Date) {
    let stringTime = "";
    let today = new Date();
    let diffTime = (+today - +date)/60000;
    console.log(today);
    console.log(date);
    // diffTime/60000 time difference in minute unit
    if (diffTime < 60) {
      if (diffTime < 1) {
        stringTime = "เมื่อวิที่นาทีที่แล้ว"
      }
      else if (diffTime < 60) {
        stringTime = String(diffTime) + " นาทีที่แล้ว"
      }
    } 
    else if (diffTime >= 60 && diffTime < 1140) {
        stringTime = String(Math.floor(diffTime/60)) + " ชั่วโมงที่แล้ว"
        console.log(diffTime/60/24);
    }
    else if (diffTime >= 1140 && diffTime < 10080) {
        stringTime = String(Math.floor(diffTime/60/24)) + " วันที่แล้ว"
        console.log(diffTime/60/24);
    }
    else if (diffTime >= 10080 && diffTime < 40320) {
        stringTime = String(Math.floor(diffTime/60/24/7)) + " สัปดาห์ที่แล้ว"
        console.log(diffTime/60/24/7);
    }
    else if (diffTime >= 10080 && diffTime < 483840) {
        stringTime = String(Math.floor(diffTime/60/24/7/4)) + " เดือนที่แล้ว"
        console.log(diffTime/60/24/7/4);
    }
    else if (diffTime >= 483840 ) {
        stringTime = String(Math.floor(diffTime/60/24/7/4/12)) + " ปีที่แล้ว"
        console.log(diffTime/60/24/7/4/12);
    }
    
    return stringTime;
  }

}
