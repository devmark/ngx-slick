/**
 * This is only for local test
 */
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {Component} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {SlickModule} from 'ngx-slick';

@Component({
    selector: 'app',
    template: `
        <ngx-slick class="carousel" #slickModal="slick-modal" [config]="slideConfig" (init)="slickInit($event)" (afterChange)="afterChange($event)">
            <div ngxSlickItem *ngFor="let slide of slides" class="slide">
                <img src="{{ slide.img }}" alt="" width="100%">
            </div>
        </ngx-slick>

        <button (click)="addSlide()">Add</button>
        <button (click)="removeSlide()">Remove</button>
        <button (click)="slickModal.slickGoTo(2)">slickGoto 2</button>
        <button (click)="slickModal.unslick()">unslick</button>
    `
})
class AppComponent {
    slides = [
        {img: 'http://placehold.it/350x150/000000'},
        {img: 'http://placehold.it/350x150/111111'},
        {img: 'http://placehold.it/350x150/333333'},
        {img: 'http://placehold.it/350x150/666666'}
    ];
    slideConfig = {
        dots: true,
        speed: 300,
        slidesToShow: 2,
        slidesToScroll: 2
    };

    addSlide() {
        this.slides.push({img: 'http://placehold.it/350x150/777777'});
    }

    removeSlide() {
        this.slides.length = this.slides.length - 1;
    }

    slickInit(e) {
        console.log('slick initialized');
    }
    afterChange(e) {
        console.log('afterChange');
    }
}

@NgModule({
    bootstrap: [AppComponent],
    declarations: [AppComponent],
    imports: [BrowserModule, SlickModule]
})
class AppModule {
}

platformBrowserDynamic().bootstrapModule(AppModule);
