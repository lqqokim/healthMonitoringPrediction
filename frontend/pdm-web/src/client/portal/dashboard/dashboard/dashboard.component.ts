import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Rx';
import { Subscription } from 'rxjs/Subscription';

import {
    StateManager,
    CurrentAction,
    SidebarAction,
    DashboardAction,
    DashboardModel,
    DashboardModelService,
    RouterModel,
    ContextMenuAction,
    ScrollEventService,
    WidgetModel,
    PageModel
} from '../../../common';

@Component({
    moduleId: module.id,
    selector: 'div.a3p-dashboard',
    template: ` 
        <div id="dashboard-scroll-area" class="a3-dashboard-container" #dashboardScrollArea>
            <div class="gridster" [dashboard]="dashboard"></div>
            <div class="a3-dashboard-wrapper">
                <div class="a3-pagination-wrapper">
                    <div class="a3-dashboard-pagination">
                        <ul>
                            <li *ngFor="let page of pages">
                                <a href="#" 
                                   (click)="$event.preventDefault(); movePage(page)" 
                                   [className]="toggleClass(page)">
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `,
    host: {
        'style': 'height: 100%'
    }
})
export class DashboardComponent implements OnInit {

    dashboard: DashboardModel;
    dashboardIdFromPath: number;
    pages: any[] = [];
    @ViewChild('dashboardScrollArea') dashboardScrollAreaEl: ElementRef;
    private DEBOUNCE_TIME: number = 300;
    private SCROLL_ANIMATE_TIME: number = 300;
    private SCROLL_QUIET_PERIDO_FOR_PAGE: number = 1600;
    private SCROLL_TIMEOUT: number = 300;
    private PAGE_ROWS_PER_100_PERCENT_HEIGHT: number = 12;
    private _routerSubscription: Subscription;
    private _scrollSubscription: Subscription;
    private _pageScrollSubscription: Subscription;
    private _resizeSubscription: Subscription;
    private _pageSubscription: Subscription;
    private _totalPage: number = 1;
    private _currentPage: number = 1;
    private _pageHeight: number;

    constructor(
        private route: ActivatedRoute,
        private stateManager: StateManager,
        private currentAction: CurrentAction,
        private dashboardAction: DashboardAction,
        private sidebarAction: SidebarAction,
        private contextMenuAction: ContextMenuAction,
        private dashboardModelService: DashboardModelService,
        private scrollEventService: ScrollEventService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this._setState();
    }

    _scrollables() {
        // setTimeout(() => {
        //     $('[scrollable]').bind('mousewheel DOMMouseScroll MozMousePixelScroll',
        //         (event: any) => {
        //             if ((event.currentTarget.scrollHeight - event.currentTarget.clientHeight) > 0) {
        //                 event.stopPropagation();
        //             }
        //         });
        // }, this.SCROLL_TIMEOUT);
    }

    _setState() {
        let subject: any;
        const router$ = this.stateManager.rxRouter();
        this._routerSubscription = router$.subscribe((router: RouterModel) => {
            if (router.event === ActionType.DASHBOARD) {
                this.dashboard = this.stateManager.getDashboard(router.toParams.dashboardId);
                if (this.dashboard) {
                    this.currentAction.setDashboard(this.dashboard.dashboardId);
                    this._groupPage();
                    this._listenResize();
                    // this._listenScrollArea();
                    this._listenScrollForPage();
                    this._setScrollForContextMenu();
                    this._isOpenSidebar();
                    this._scrollables();
                    if (subject) {
                        subject.next({cmd: 'check-page'});
                        subject = undefined;
                    }
                }

                // when call router.goWidgetInDashboard(dashboardId, widgetId)
                if (router.actionType === ActionType.ROUTER_CHANGE_SUCCESS && router.subject) {
                    subject = router.subject;
                    if (this.dashboard) {
                        subject.next({cmd: 'check-page'});
                        subject = undefined;
                    }
                }
            }
        });

        // 1) add, resize, remove widget 경우 page 사이즈를 다시 계산한다.
        // 2) dashboard routing이 되고 특정 위젯으로 이동하고 싶을 경우 위의 'check-page' 를 listen한다.
        const page$ = this.stateManager.rxPage();
        this._pageSubscription = page$.subscribe((page: PageModel) => {
            if (page.actionType === ActionType.CHECK_PAGE) {
                this.dashboard = this.stateManager.getDashboard(page.dashboardId);
                this._groupPage();
                // widget header를 더블클릭시 full-size 또는 original-size 되었을 때 page의 위치를 조정한다.
                if (page.originalActionType === ActionType.UPDATE_WIDGET_SIZE) {
                    this._movePageWithHeight(this._getCurrentHeight());
                }
                if (page.originalActionType === ActionType.MOVE_WIDGET_IN_DASHBOARD) {
                    this._moveWidget(page.widgetId);
                }
            }
        });
    }

    _groupPage() {
        this._pageHeight = this.dashboardScrollAreaEl.nativeElement.clientHeight;
        this.dashboard = this.stateManager.getDashboard(this.dashboard.dashboardId);
        this._calcWidgetInPage();
        this._calcTotalPage();
        this.cd.detectChanges();
    }

    _calcWidgetInPage() {
        this.dashboard.widgets.map((widget: WidgetModel) => {
            widget.page = Math.trunc(((widget.y + widget.height) - 2) / this.PAGE_ROWS_PER_100_PERCENT_HEIGHT) + 1;
        });
    }

    _calcTotalPage() {
        this.pages = _.keys(_.groupBy(this.dashboard.widgets, (widget: WidgetModel) => widget.page));
        this._totalPage = this.pages.length;
    }

    toggleClass(page: any) {
        if (+page === this._currentPage) {
            return 'current';
        } else {
            return '';
        }
    }

    /**
     * resize가 되면 페이지에 대한 계산을 다시 해준다.
     */
    _listenResize() {
        this._unSubscribeResize();
        this._resizeSubscription = Observable
            .fromEvent(window, 'resize')
            .debounceTime(this.DEBOUNCE_TIME)
            .subscribe((event: any) => {
                this._groupPage();
                // 현재 페이지를 다시 조정한다.
                this._movePageWithHeight(this._getCurrentHeight());
            });
    }

    /**
     * scroll이 되면 바로 페이지가 위아래로 움직이도록 한다.
     */
    _listenScrollArea() {
        this._unbindScrollArea();
        let lastAnimation: number = 0;
        const scrollFn = _.throttle((event: any) => {
            const wheelEvent = event.originalEvent;
            const deltaOfInterest = wheelEvent.wheelDelta || -wheelEvent.detail;
            const timeNow = new Date().getTime();

            // Cancel scroll if currently animating or within quiet period
            if (timeNow - lastAnimation < this.SCROLL_QUIET_PERIDO_FOR_PAGE) {
                return;
            }

            // TODO: wijmo grid에서 터치스크롤(magic mouse, touch pad)시 가로 스크롤을 하면 scrollFn을 실행하는 경우가 있음
            // 가로 스크롤을 하면서 세로 스크롤 같이할때 page scroll 막음
            if (wheelEvent.wheelDeltaX != 0) {
                return;
            }

            if (deltaOfInterest < 0 && (this._currentPage < this._totalPage)) {
                // moveDown
                this._currentPage += 1;
                this._movePageWithHeight(this._getCurrentHeight());
            } else if (deltaOfInterest > 0 && (this._currentPage > 1)) {
                // moveUp
                this._currentPage += -1;
                this._movePageWithHeight(this._getCurrentHeight());
            }

            lastAnimation = timeNow;
        }, this.SCROLL_TIMEOUT);

        $(this.dashboardScrollAreaEl.nativeElement).bind('mousewheel DOMMouseScroll MozMousePixelScroll', scrollFn);

        // $(this.dashboardScrollAreaEl.nativeElement).bind('mousewheel DOMMouseScroll MozMousePixelScroll',
        //     (event: any) => {
        //         console.log('_listenScrollArea');
        //         // event.preventDefault();
        //         const deltaOfInterest = event.originalEvent.wheelDelta || -event.originalEvent.detail;
        //         const timeNow = new Date().getTime();
        //         // Cancel scroll if currently animating or within quiet period
        //         if (timeNow - lastAnimation < this.SCROLL_QUIET_PERIDO_FOR_PAGE) {
        //             // event.preventDefault();
        //             return;
        //         }
        //
        //         if (deltaOfInterest < 0 && (this._currentPage < this._totalPage)) {
        //             // moveDown
        //             this._currentPage += 1;
        //             this._movePageWithHeight(this._getCurrentHeight());
        //         } else if (deltaOfInterest > 0 && (this._currentPage > 1)) {
        //             // moveUp
        //             this._currentPage += -1;
        //             this._movePageWithHeight(this._getCurrentHeight());
        //         }
        //         lastAnimation = timeNow;
        //     });
    }

    _listenScrollForPage() {
        this._unSubscribeScrollForPage();
        this._pageScrollSubscription = Observable
            .fromEvent(this.dashboardScrollAreaEl.nativeElement, 'scroll')
            .subscribe((event: any) => {
                // event.preventDefault();
                let page = Math.trunc(event.target.scrollTop / this._pageHeight) + 1;
                const remain = (event.target.scrollTop % this._pageHeight) / this._pageHeight;
                if (remain > 0 && remain < 1) {
                    page += 1;
                }
                this._currentPage = page;
                this.dashboardAction.setCurrentPage(this.dashboard.dashboardId, this._currentPage);
            });
    }

    _movePageWithHeight(scrollHeight: number) {
        // fixing gap for padding of dashboard top
        if (scrollHeight > 0) { scrollHeight -= (2 * this._currentPage); }

        $('#dashboard-scroll-area').animate({
            scrollTop: scrollHeight
        }, this.SCROLL_ANIMATE_TIME);
    }

    movePage(page: number) {
        this._movePageWithHeight(this._getCurrentHeight(page));
    }

    _moveWidget(widgetId: number) {
        const widget = _.findWhere(this.dashboard.widgets, { widgetId });
        if (widget) {
            setTimeout(() => {
                this.movePage(widget.page);
            }, 10);
        }
    }

    _getCurrentHeight(page?: number) {
        if (page) {
            return this._pageHeight * (page - 1);
        } else {
            return this._pageHeight * (this._currentPage - 1);
        }
    }

    /**
     * 1) Context Menu가 활성 상태일 경우 자동으로 close한다.
     * 2) 페이지 단위로 움직이도록 한다.
     */
    _setScrollForContextMenu() {
        this._unSubscribeScroll();
        this._scrollSubscription = this.scrollEventService.listenScrollEvent(this.dashboardScrollAreaEl.nativeElement);
    }

    _isOpenSidebar() {
        // if dashboard has no widgets, open sidebar
        if (this.dashboard && (!this.dashboard.widgets || this.dashboard.widgets.length === 0)) {
            setTimeout(() => {
                this.sidebarAction.openSmall(ActionType.GNB_WIDGET_LIST);
            }, 50);
        }
    }

    _unbindScrollArea() {
        $(this.dashboardScrollAreaEl.nativeElement).unbind('mousewheel DOMMouseScroll MozMousePixelScroll');
        $('[scrollable]').unbind('mousewheel DOMMouseScroll MozMousePixelScroll');
    }

    _unSubscribeScroll() {
        if (this._scrollSubscription) {
            this._scrollSubscription.unsubscribe();
            this._scrollSubscription = undefined;
        }
    }

    _unSubscribeScrollForPage() {
        if (this._pageScrollSubscription) {
            this._pageScrollSubscription.unsubscribe();
            this._pageScrollSubscription = undefined;
        }
    }

    _unSubscribeResize() {
        if (this._resizeSubscription) {
            this._resizeSubscription.unsubscribe();
            this._resizeSubscription = undefined;
        }
    }

    _unSubscribePage() {
        if (this._pageSubscription) {
            this._pageSubscription.unsubscribe();
            this._pageSubscription = undefined;
        }
    }

    ngOnDestroy() {
        if (this._routerSubscription) {
            this._routerSubscription.unsubscribe();
        }
        this._unbindScrollArea();

        this._unSubscribeScroll();
        this._unSubscribeScrollForPage();
        this._unSubscribePage();
        this._unSubscribeResize();
    }
}
