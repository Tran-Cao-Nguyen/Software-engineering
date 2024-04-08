import { Component, OnInit,Input  } from '@angular/core';


@Component({
  selector: 'app-loai-van-ban',
  templateUrl: './loai-van-ban.component.html',
})
export class LoaiVanBanComponent {
  @Input() filled: boolean = false;
  constructor() { }
  ngOnInit(): void {
  }
  iconClass = "bi bi-arrow-down rotate";
  InputLoaiVanBan: string = "";
  isDisableClick: boolean = false;
  isViewOptionLoaiVanBan: boolean = false;
  LoaiVanBanSuggests: string[] = ["Báo cáo", "Biên bản", "Bản ghi nhớ",
    "Bản thỏa thuận", "Chỉ thị", "Chương trình", "Công điện", "Dự án", "Đề án", "Giấy giới thiệu", "Giấy mời", "Giấy nghỉ phép", "Giấy ủy quyền", "Hợp đồng", 
    "Hướng dẫn", "Kế hoạch", "Nghị quyết (cá biệt)", "Phiếu báo", "Phiếu chuyển", "Phiếu gửi", "Phương án", "Quy chế", "Quy định", "Quyết định (cá biệt)", "Thông báo", "Thông cáo", "Tờ trình" 
  
  ];
  LoaiVanBanSuggestsAfter: string[] = this.LoaiVanBanSuggests
  removeDiacritics(str){
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  updateSuggest(): void {
    if (this.InputLoaiVanBan == "") {
      this.unviewSuggest();
    } else {
      this.viewSuggest();
    }
    this.LoaiVanBanSuggestsAfter = this.LoaiVanBanSuggests.filter(LoaiVanBan => this.removeDiacritics(LoaiVanBan.toLowerCase()).includes(this.removeDiacritics(this.InputLoaiVanBan.toLowerCase())));

    if (this.LoaiVanBanSuggestsAfter.length == 0) {
      this.LoaiVanBanSuggestsAfter = ["Không có kết quả"]
      this.isDisableClick = true;
    } else {
      this.isDisableClick = false;
    }
    
  }
  viewSuggest(): void {
    this.isViewOptionLoaiVanBan = true;
    this.iconClass = "bi bi-arrow-down";
  }
  unviewSuggest(): void {
    this.isViewOptionLoaiVanBan = false;
    this.iconClass = "bi bi-arrow-down rotate";
  }
  clickToOption(LoaiVanBanSuggest: string): void {
    this.InputLoaiVanBan = LoaiVanBanSuggest;
    this.unviewSuggest();
  }
  switchViewSuggest(): void {
    this.isViewOptionLoaiVanBan = !this.isViewOptionLoaiVanBan;
    if (this.isViewOptionLoaiVanBan) {
      this.viewSuggest()
    }else{
      this.unviewSuggest()
    }
  }
}