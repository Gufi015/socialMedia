import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabBar, IonTabs } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  @ViewChild('tabs') tabs: IonTabs;

  constructor() { }

  ngOnInit() {
    this.tabs.select('feed');
  }

}
