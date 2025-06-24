import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

   email: string = '';
  password: string = '';
  isLoggedIn: boolean = false;

 constructor(private authService: AuthenticationService, private router: Router) {}

  ngOnInit() {
     this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  login() {
    this.authService.login(this.email, this.password).subscribe({
      // next is the success callback
      next: (response) => {
        // Store the JWT token in localStorage within the browser
        localStorage.setItem('jwt_token', response.token);
        this.isLoggedIn = true;
      },
      error: (error) => {
        console.error('Login failed', error);
      
      },
    });
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    // Redirect to the login page or home page after logout
    this.router.navigate(['/home']);
  }

  getCurrentTab(): string {
    const url = window.location.pathname;
    const segments = url.split('/');
    const tabIndex = segments.indexOf('tabs');
    if (tabIndex !== -1 && segments.length > tabIndex + 1) {
      return segments[tabIndex + 1];
    }
    return '';
  }

}
