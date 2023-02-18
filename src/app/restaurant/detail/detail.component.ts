import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalGalleryComponent } from '../modal-gallery/modal-gallery.component';
import { GetReviewInfoRequest, ReviewInfoModel } from 'src/models/review-info.model';
import { RestaurantService } from '../restaurant.service';
import { LocalStorageService } from 'src/app/service/local-storage.service';
import { LocalStorageKey } from 'src/constant/local-storage-key.constant';
import { ResponseModel } from 'src/models/response.model';
import { Restaurant, RestaurantDetailModel, SocialContactModel } from 'src/models/restaurant-info.model';
import { RestaurantType } from 'src/constant/restaurant-type.constant';
import { PaymentMethod } from 'src/constant/payment-method.constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  @ViewChild('modalGalleryComponent') modalGallery: ModalGalleryComponent;
  @Input() isLoading: boolean = true;

  Info: Restaurant;
  Reviews: Array<ReviewInfoModel>
  SocialContact: Array<SocialContactModel>;
  TotalReview: number;
  Rating: number;
  Star: Array<string>;
  RestaurantType: Array<string>;
  awsS3Url = environment.awsS3Url;
  lat: number;
  lng: number;
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
  }

  openModalGallery() {
    this.modalGallery.openSuccessModal();
  }

  getRestaurantDetail() {
    let request = new GetReviewInfoRequest();
    request.userId = this.userId;
    request.restaurantId = this.restaurantId;
    this.restaurantService.getRestaurantDetail(request).subscribe(
      (response: ResponseModel<RestaurantDetailModel>) => {
        if (response && response?.status === 200) {
          this.Info = response.data.restaurantInfo;
          this.Reviews = response.data.reviews;
          this.SocialContact = response.data.socialContact;
          this.TotalReview = this.Reviews.length
          let ratingCount = 0;
          this.Reviews.forEach(x => { 
            ratingCount += x.rating
          });
          this.Rating = ratingCount/this.Reviews.length
          this.getStarArray()
          this.isLoading = false;
        }
    })
  }

  getStarArray() {
    switch (this.Rating) {
      case 5:
        this.Star = ["star", "star", "star", "star", "star"]
        break;
      case 4.5:
        this.Star = ["star", "star", "star", "star", "star_half"]
        break;
      case 4:
        this.Star = ["star", "star", "star", "star", "star_empty"]
        break;
      case 3.5:
        this.Star = ["star", "star", "star", "star_half", "star_empty"]
        break;
      case 3:
        this.Star = ["star", "star", "star", "star_empty", "star_empty"]
        break;
      case 2.5:
        this.Star = ["star", "star", "star_half", "star_empty", "star_empty"]
        break;
      case 2:
        this.Star = ["star", "star", "star_empty", "star_empty", "star_empty"]
        break;
      case 1:
        this.Star = ["star", "star_empty", "star_empty", "star_empty", "star_empty"]
        break;
      case 0:
        this.Star = ["star_empty", "star_empty", "star_empty", "star_empty", "star_empty"]
        break;
    }
  }

  getRestaurantType(type: number) {
    switch (type) {
      case 1:
        return [RestaurantType.find((i:any) => i.id === 1)?.name]
      case 2:
        return [RestaurantType.find((i:any) => i.id === 1)?.name]
      default:
        return [RestaurantType.find((i:any) => i.id === 1)?.name , RestaurantType.find((i:any) => i.id === 2)?.name]
    }
  }

  getPaymentMethod(method: number) {
    switch (method) {
      case 1:
        return PaymentMethod.find((i:any) => i.id === 1)?.name;
      case 2:
        return PaymentMethod.find((i:any) => i.id === 2)?.name;
      case 3:
        return PaymentMethod.find((i:any) => i.id === 3)?.name;
      default:
        return PaymentMethod.find((i:any) => i.id === 4)?.name;
    }
  }

  getSocialContactValue(type: number) {
    switch (type) {
      case 1:
        return this.SocialContact.find((i:SocialContactModel) => i.socialType === 1)?.contactValue;
      case 2:
        return this.SocialContact.find((i:any) => i.socialType === 2)?.contactValue;
      case 3: 
        return this.SocialContact.find((i:any) => i.socialType === 3)?.contactValue;
      default:
        return this.SocialContact.find((i:any) => i.socialType === 4)?.contactValue;
    }
  }

}
