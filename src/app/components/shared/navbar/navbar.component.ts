import { Component, OnInit, Input, Inject, EventEmitter, OnChanges, SimpleChanges  } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'angular-webstorage-service';
import { UserService } from 'src/app/services/i2t/user.service';
import { ResourceLoader } from '@angular/compiler';
import { PlatformLocation } from '@angular/common';
import { Router, Route, ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Event } from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
//const userName = ''
export class NavbarComponent implements OnInit {
  //@Input() name: EventEmitter<any> | null = null;
  token: string;
  usuario: any;

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService,
  private _userService: UserService,
  private router: Router,
              private route: ActivatedRoute,
              private location: PlatformLocation) { 
                router.events.subscribe( (event: Event) => {
                  
                  if (event instanceof NavigationStart) {;
                    
                    
                  }
                  if (event instanceof NavigationEnd){;
                    if (this.router.url.includes('/login') == true){
                      localStorage.removeItem('currentUser')
                      localStorage.removeItem('TOKEN')
                    } else {
                      this.usuario = localStorage.getItem('currentUser')
                    }
                  }
                })
  }
  
  user(name: string) {
    this.usuario = name
    console.log(this.usuario)
    this.usuario = localStorage.getItem('currentUser')
    this.token = localStorage.getItem('TOKEN')
    }
  ngOnInit() {
     
  }

}
