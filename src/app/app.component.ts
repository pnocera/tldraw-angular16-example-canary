import {
  Component,
  HostListener,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Editor, Tldraw } from '@tldraw/tldraw';

import type { ComponentProps } from 'react';
import { Utils } from './utils/urls';

import { TlappService } from './services/tlapp.service';
import { uiOverrides } from './config';
import { StateShapeDef } from './components/customshape/customshape';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy, AfterViewInit {
  Tldraw = Tldraw;
  props!: ComponentProps<typeof Tldraw>;

  darkmode = false;

  @ViewChild('topdiv') topdiv: ElementRef<HTMLDivElement> | undefined;

  tldrawheight = {
    height: '100%',
  };

  constructor(private appsvc: TlappService) {
    const assetsurl = Utils.getAssetUrlsByMetaUrl({
      baseUrl: window.location.href,
    });

    this.props = {
      assetUrls: assetsurl,
      onMount: this.handleMount.bind(this),
      overrides: [uiOverrides],
      shapes: [StateShapeDef],
    };
  }
  ngAfterViewInit(): void {
    this.onWindowResized();
  }
  ngOnDestroy(): void {
    this.appsvc.Dispose();
  }

  setDarkMode() {
    this.darkmode = !this.darkmode;
    this.appsvc.SetDarkMode(this.darkmode);
  }

  handleMount(app: Editor) {
    this.appsvc.setApp(app);
  }

  @HostListener('window:resize', [])
  public onWindowResized() {
    if (this.topdiv && this.topdiv.nativeElement) {
      const div: HTMLDivElement = this.topdiv.nativeElement;
      if (!!div) {
        const rect = div.getBoundingClientRect();
        const availableheight = Math.round(window.innerHeight - rect.bottom);
        this.tldrawheight.height = `${availableheight}px`;
      }
    }
  }

  Save() {
    this.appsvc.save();
  }

  Load() {
    this.appsvc.load();
  }
}
