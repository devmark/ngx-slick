import {
    Component, Input, Output, EventEmitter, NgZone, forwardRef, AfterViewInit,
    OnDestroy, Directive, ElementRef, Host
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

declare const jQuery: any;

/**
 * Slick component
 */
@Component({
    selector: 'ngx-slick',
    exportAs: 'slick-modal',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SlickComponent),
            multi: true
        }
    ],
    template: '<ng-content></ng-content>',
})
export class SlickComponent implements AfterViewInit, OnDestroy {

    @Input() config: any;
    @Output() afterChange: EventEmitter<any> = new EventEmitter();
    @Output() beforeChange: EventEmitter<any> = new EventEmitter();
    @Output() breakpoint: EventEmitter<any> = new EventEmitter();
    @Output() destroy: EventEmitter<any> = new EventEmitter();
    @Output() init: EventEmitter<any> = new EventEmitter();
    public slides: any = [];
    public $instance: any;
    private initialized: Boolean = false;

    /**
     * Constructor
     */
    constructor(private el: ElementRef, private zone: NgZone) {

    }

    /**
     * On component destroy
     */
    ngOnDestroy() {
        this.unslick();
    }

    /**
     * On component view init
     */
    ngAfterViewInit() {
    }

    /**
     * init slick
     */
    initSlick() {
        const self = this;

        this.zone.runOutsideAngular(() => {
            jQuery(this.el.nativeElement)[0].innerHTML = '';
            this.$instance = jQuery(this.el.nativeElement);
            this.$instance.on('init', (event, slick) => {
                this.zone.run(() => {
                    this.init.emit({event, slick});
                });
            });

            this.$instance.slick(this.config);
            this.initialized = true;

            this.$instance.on('afterChange', (event, slick, currentSlide) => {
                self.zone.run(() => {
                    self.afterChange.emit({event, slick, currentSlide});
                });
            });

            this.$instance.on('beforeChange', (event, slick, currentSlide, nextSlide) => {
                self.zone.run(() => {
                    self.beforeChange.emit({event, slick, currentSlide, nextSlide});
                });
            });

            this.$instance.on('breakpoint', (event, slick, breakpoint) => {
                self.zone.run(() => {
                    self.breakpoint.emit({event, slick, breakpoint});
                });
            });

            this.$instance.on('destroy', (event, slick) => {
                self.zone.run(() => {
                    self.destroy.emit({event, slick});
                });
            });
        });
    }

    addSlide(slickItem: SlickItemDirective) {
        if (!this.initialized) {
            this.initSlick();
        }
        this.slides.push(slickItem);

        this.zone.run(() => {
            this.$instance.slick('slickAdd', slickItem.el.nativeElement);
        });
    }

    removeSlide(slickItem: SlickItemDirective) {
        const idx = this.slides.indexOf(slickItem);

        this.zone.run(() => {
            this.$instance.slick('slickRemove', idx);
        });

        this.slides = this.slides.filter(s => s !== slickItem);
    }

    /**
     * Slick Method
     */
    public slickGoTo(index: number) {
        this.zone.run(() => {
            this.$instance.slick('slickGoTo', index);
        });
    }

    public slickNext() {
        this.zone.run(() => {
            this.$instance.slick('slickNext');
        });
    }


    public slickPrev() {
        this.zone.run(() => {
            this.$instance.slick('slickPrev');
        });
    }

    public slickPause() {
        this.zone.run(() => {
            this.$instance.slick('slickPause');
        });
    }

    public slickPlay() {
        this.zone.run(() => {
            this.$instance.slick('slickPlay');
        });
    }

    public unslick() {
        this.zone.run(() => {
        	if (this.$instance) {
	            this.$instance.slick('unslick');        		
        	}
        });
    }

}

@Directive({
    selector: '[ngxSlickItem]',
})
export class SlickItemDirective implements AfterViewInit, OnDestroy {
    constructor(public el: ElementRef, @Host() private carousel: SlickComponent) {
    }

    ngAfterViewInit() {
        this.carousel.addSlide(this);
    }

    ngOnDestroy() {
        this.carousel.removeSlide(this);
    }
}
