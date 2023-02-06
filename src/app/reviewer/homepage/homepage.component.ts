import { ResponseModel } from '../../../models/response.model';
import { LocalStorageKey } from '../../../constant/local-storage-key.constant';
import { LocalStorageService } from '../../service/local-storage.service';
import { GetRestaurantNearMeRequestModel, SetFavoriteRestaurantRequestModel } from '../../../models/reviewer-homepage.model';
import { ReviewerService } from '../reviewer.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { RestaurantInfoItemModel, RestaurantInfoListModel } from '../../../models/restaurant-info.model';
import { ModalDessertComponent } from '../modal-dessert/modal-dessert.component';
import { ModalFoodComponent } from '../modal-food/modal-food.component';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class ReviewerHomepageComponent implements OnInit {
  @ViewChild('successModalFoodComponent') successModalFood: ModalFoodComponent;
  @ViewChild('successModalDessertComponent') successModalDessert: ModalDessertComponent;

  restaurantInfoList: Array<RestaurantInfoItemModel>;
  restaurantNearMeInfo: RestaurantInfoListModel;
  savoryFoodCategoryLabel: string = 'ทั้งหมด';
  dessertCategoryLabel: string = 'ทั้งหมด';
  selectedSavoryFoodCategory: number = 0;
  selectedDessertCategory: number = 0;
  awsS3Url = environment.awsS3Url;
  totalRestaurant: number = 0;
  restaurantCumulativeCount: number = 0;
  isError: boolean;
  isLoading: boolean = true;
  skip: number = 0;
  lat: number;
  lng: number;

  constructor(
    private reviewerService: ReviewerService,
    private localStorageService: LocalStorageService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getUserCurrentLocation();
  }

  getUserCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.getRestaurantNearMeList();
      },
      (err) => {
        // User not allowed to get current position
        // set coordinates at Bangkok, Thailand
        this.lat = 13.736717;
        this.lng = 100.523186;
        this.getRestaurantNearMeList();
      },
      {timeout:10000}
    );
  }

  getRestaurantNearMeList() {
    let request = new GetRestaurantNearMeRequestModel();
    request.userId = this.localStorageService.get<string>(LocalStorageKey.userId) ?? '';
    request.latitude = this.lat;
    request.longitude = this.lng;
    request.skip = this.skip;
    request.take = 10;

    this.reviewerService.getRestaurantNearMeList(request)
      .subscribe((response: ResponseModel<RestaurantInfoListModel>) => {
      if (response?.status === 200) {
        this.restaurantNearMeInfo = response.data;
        this.restaurantInfoList = response.data.restaurantInfo;
        this.totalRestaurant = response.data.totalRestaurant;
        this.restaurantCumulativeCount = response.data.restaurantCumulativeCount;
        this.isLoading = false;
      } else {
        this.isError = true;
        this.isLoading = false;
      }
    })
  }

  openModalFood() {
    this.successModalFood.openSuccessModal();
  }

  openModalDessert() {
    this.successModalDessert.openSuccessModal();
  }

  showtoasSuccess(text: string) {
    this.toastr.success(text, '', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }

  showtoasError(text: string) {
    this.toastr.error(text, '', {
      timeOut: 3000,
      progressBar: true,
      progressAnimation: 'increasing',
    });
  }

  toggleFavoriteRestaurant(restaurantId: string, restaurantName: string, isFavorite: boolean, index: number) {
    this.restaurantInfoList[index].isFavorite = isFavorite;
    let requestModel = new SetFavoriteRestaurantRequestModel();
    requestModel.userId = this.localStorageService.get<string>(LocalStorageKey.userId) ?? '';
    requestModel.restaurantId = restaurantId;
    requestModel.isFavorite = isFavorite;

    this.reviewerService.setFavoriteRestaurant(requestModel)
      .subscribe((response: ResponseModel<boolean>) => {
      if (response?.status === 200) {
        this.showtoasSuccess(`${isFavorite? 'Favorite':'Disfavor'} '${restaurantName}' Successful`);
      } else {
        this.restaurantInfoList[index].isFavorite = !isFavorite;
        this.showtoasError(`Favorite ${restaurantName} Unsuccessful`);
      }
    })
  }

  setFoodCategory(e: any) {
    if (e.isSavory) {
      this.selectedSavoryFoodCategory = e.id;
      this.savoryFoodCategoryLabel = e.label;
    } else {
      this.selectedDessertCategory = e.id;
      this.dessertCategoryLabel = e.label;
    }
  }
}
