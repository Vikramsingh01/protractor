import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Config } from '../../configuration/config';
@Component({
  selector: 'tr-footer',
  templateUrl: './footer.component.html',
  styles: []
})
export class FooterComponent implements OnInit {
  private envName: string;
  private releaseDate: string;
  private version: string;
  private appName: string;
  private production: boolean;

  constructor() { }

  ngOnInit() {
    let config = Config.getInstance();
    this.envName = config['env-name'];
    this.releaseDate = config['release-date'];
    this.version = config['version'];
    this.appName = config['app-name'];
    this.production = config['production'];

  }

}
