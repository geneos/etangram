import { Component } from '@angular/core';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Router, Route, ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, Event } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
idProv: any;
portal: boolean = false;
urlRuta: any;
  constructor(public ngxSmartModalService: NgxSmartModalService,
             // private http: Http,
              private router: Router,
              private route: ActivatedRoute){
    router.events.subscribe( (event: Event) => {
      if (event instanceof NavigationStart) {;
        //if (this.router.url)
      }

      if (event instanceof NavigationEnd) {
          // Hide loading indicator
          this.route.params.subscribe( parametros=>{
            this.idProv = parametros['id'];
             if (this.router.url.includes('/datos-proveedores/') == true){
               this.portal = true; 
            } else {
              this.portal = false;
             }
          });
      }

      if (event instanceof NavigationError) {
          // Hide loading indicator
          // Present error to user
          console.log(event.error);
      }
  });
  }
  title = 'etangram';
  
}
