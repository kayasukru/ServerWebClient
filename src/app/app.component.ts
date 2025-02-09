import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FlexiGridModule, FlexiGridService, StateModel } from 'flexi-grid';
import { TrCurrencyPipe } from 'tr-currency';

@Component({
  selector: 'app-root',
  imports: [
    FlexiGridModule,
    CommonModule,
    TrCurrencyPipe
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  //data tanımlaması
  users = signal<UserModel[]>([]);
  total = signal<number>(0);
  state = signal<StateModel>(new StateModel());

  dataBinding = signal<boolean>(true);

  loading = signal<boolean>(false);

  //pagination tanımlamalrı
  pageable = signal<boolean>(true);
  pageSize = signal<number>(10);
  pageSizeList = signal<number[]>([3,5,10,15,20,50,100,200,500,1000]);
  numbers = signal<number[]>([1,2,3,4,5,10,15,20,25,30,35,40,45,50,100,150,200]);

  //sortable (default values)
  sortable = signal<boolean>(true);
  idSortable = signal<boolean>(true);
  firstNameSortable = signal<boolean>(true);
  lastNameSortable = signal<boolean>(true);
  dateOfBirthSortable = signal<boolean>(true);
  salarySortable = signal<boolean>(true);

  //theme modu
  themeClass = signal<string>("light");

  constructor(
    private http: HttpClient,
    private flexi: FlexiGridService
  )
  {
    this.getAll();
  }

  getAll(){
    this.loading.set(true);
    let apiUrl = "http://localhost:86/api/Users/GetAll?$count=true";
    //let apiUrl = "https://localhost:7016/api/Users/GetAll?$count=true";

    let newApiUrl = this.flexi.getODataEndpoint(this.state());

    apiUrl += "&" + newApiUrl;

    //this.http.get<UserModel[]>(apiUrl).subscribe( res=> {
    this.http.get<{total: number, data: UserModel[]}>(apiUrl).subscribe( res=> {
      this.users.set(res.data);
      this.total.set(res.total);
      this.loading.set(false);
    });
  }


  onDataStageChange(event: StateModel) {
    this.state.set(event);
    this.getAll();
  }
    

  remove(arg0: any) {
    throw new Error('Method not implemented.');
  }

  edit(arg0: any) {
    throw new Error('Method not implemented.');
  }
    
  onKeyUp($event: KeyboardEvent) {
    throw new Error('Method not implemented.');
  }

  changeThemeClass(){
    if(this.themeClass() === "light"){
      this.themeClass.set("dark");
    }else{
      this.themeClass.set("light");
    }
  }

  
}

//user class
export class UserModel{
  id: string = "";
  firstName: string = "";
  lastName: string = "";
  dateOfBirth: string = ""; //istenirse date formatında da yakalanabilir. js'de date formarı sorun çıkarabiliyor.
  salary: number = 0
}
