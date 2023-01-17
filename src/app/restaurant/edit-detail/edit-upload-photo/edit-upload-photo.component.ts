import { RestaurantPhotoModel } from 'src/models/register.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-upload-photo',
  templateUrl: './edit-upload-photo.component.html',
  styleUrls: ['./edit-upload-photo.component.scss']
})
export class EditUploadPhotoComponent implements OnInit {

  @Output() isFormValid = new EventEmitter<boolean>();
  @Output() uploadPhotoFormValue = new EventEmitter<RestaurantPhotoModel>();

  uploadPhotoForm: FormGroup;
  currentStage: number = 0;
  restaurantImageList: Array<string> = new Array<string>();
  imageFileList: Array<File> = new Array<File>();

  constructor(private fb: FormBuilder, private cf: ChangeDetectorRef) {
    this.uploadPhotoForm = this.fb.group({
      photo: new FormControl([], [
        Validators.required
      ]),
      restaurantStatus: new FormControl('',[
        Validators.maxLength(320)
      ])
    })
  }

  ngOnInit(): void {
  }

  @Input()
  set stage(value: number) {
    this.currentStage = value;

    if (value === 4) {
      this.uploadPhotoForm.disable();
    } else {
      this.uploadPhotoForm.enable();
    }
  }

  get stage() {
    return this.currentStage;
  }

  onSelectFile(event: any) {
    let file = event.target.files && event.target.files.length;
    if (file) {
      for (const singlefile of event.target.files) {
        this.imageFileList.push(singlefile);
        let reader = new FileReader();
        reader.readAsDataURL(singlefile);
        this.cf.detectChanges();

        reader.onload = (event) => {
          const url = (<FileReader>event.target).result as string;
          this.restaurantImageList.push(url);
          this.cf.detectChanges();
        };
      }
    }
  }

  drop(event: CdkDragDrop<any>) {
    moveItemInArray(this.restaurantImageList, event.previousContainer.data.index, event.container.data.index);
    moveItemInArray(this.imageFileList, event.previousContainer.data.index, event.container.data.index);
  }

  removeImage(index: number) {
    if (index > -1) {
      this.restaurantImageList.splice(index, 1);
      this.imageFileList.splice(index, 1);
    }
  }

  getRestaurantInfoValue() {
    let restaurantInfo = new RestaurantPhotoModel();
    restaurantInfo.imageFiles = this.imageFileList;
    restaurantInfo.restaurantStatus = this.uploadPhotoForm.controls['restaurantStatus']?.value;
    return restaurantInfo;
  }

  checkFormIsValid() {
    this.uploadPhotoForm.markAllAsTouched();
    this.uploadPhotoForm.enable();

    if (this.uploadPhotoForm.valid) {
      let restaurantInfo = this.getRestaurantInfoValue();
      this.uploadPhotoForm.disable();
      this.uploadPhotoFormValue.emit(restaurantInfo);
      this.isFormValid.emit(true);
    }
  }

}