import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Editor, createShapeId } from '@tldraw/editor';
import { LocalStorageService } from 'ngx-webstorage';
import { HelloDialogComponent } from '../components/hellodialog/hellodialog.component';
import { HistoryEntry } from '@tldraw/store';

@Injectable({
  providedIn: 'root',
})
export class TlappService {
  private app!: Editor;

  constructor(
    private localSt: LocalStorageService,
    private dialog: MatDialog
  ) {}

  setApp(app: Editor) {
    this.app = app;
    this.app.on('change', this.HandleChangeEvent, this);
    (<any>app)['appsvc'] = this;
    this.load();
  }

  public Dispose() {
    this.app?.off('change', this.HandleChangeEvent, this);
    this.app?.dispose();
  }

  public SetDarkMode(darkmode: boolean) {
    this.app?.setDarkMode(darkmode);
  }

  public addState(shape: any) {
    const startshape = this.app?.getShapeById(shape.id);
    if (!startshape) return;
    const newshape = JSON.parse(JSON.stringify(startshape));
    newshape.id = createShapeId();
    newshape.y = startshape.y + 150;

    let arrow = {
      id: createShapeId(),
      type: 'arrow',
      x: startshape.x + 150,
      y: startshape.y + 40,
      props: {
        dash: 'solid',
        size: 'm',
        fill: 'none',
        color: 'orange',
        labelColor: 'black',
        bend: 0,
        arrowheadStart: 'dot',
        arrowheadEnd: 'arrow',
        text: '',
        font: 'draw',
        start: {
          type: 'binding',
          boundShapeId: shape.id,
          isExact: false,
          normalizedAnchor: { x: 0.5, y: 0.5 }, // center!
        },
        end: {
          type: 'binding',
          isExact: false,
          normalizedAnchor: { x: 0.5, y: 0.5 }, // center!
          boundShapeId: newshape.id,
        },
      },
    };

    this.app?.batch(() => {
      this.app?.createShapes([newshape, arrow]);
      this.app?.select(newshape.id);
    });
  }

  public hasBoundStartArrow(shape: any) {
    if (!shape) return false;
    const arrows = this.app?.getArrowsBoundTo(shape.id);
    if (!arrows) return false;
    const arrow = arrows.find((x: any) => x.handleId === 'start');
    return arrow !== undefined;
  }

  save() {
    const data = this.app.store.getSnapshot();
    console.log(data);
    this.localSt.store('tldraw', data);
  }

  load() {
    const data = this.localSt.retrieve('tldraw');
    if (this.app && data) {
      this.app.store.loadSnapshot(data);
      this.setDefaults();
    }
  }

  setDefaults() {
    this.app.setGridMode(true);
    this.app.setDarkMode(false);
    this.app.setSnapMode(true);

    this.app.updateInstanceState({
      isDebugMode: false,
    });
  }

  setShapeText(shape: any, text: string) {
    this.app.updateShapes([
      {
        id: shape.id,
        type: shape.type,
        props: {
          text: text,
        },
      },
    ]);
  }

  getShapeById(id: any) {
    const shape = this.app?.getShapeById(id);
    return JSON.parse(JSON.stringify(shape));
  }

  public shapeChanged: EventEmitter<string> = new EventEmitter<string>();

  infodialog(shape: any) {
    console.log('infodialog', shape);
    const dialogRef = this.dialog.open(HelloDialogComponent, {
      data: {
        title: 'Hi ' + shape.props.text + ', your id is ' + shape.id,
        name: shape.props.text,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.setShapeText(shape, result);
        this.shapeChanged.emit(shape.id);
      }
    });
  }

  private HandleChangeEvent(change: HistoryEntry<any>) {
    if (change.source === 'user') {
      // Added
      for (const record of Object.values(change.changes.added)) {
        if (record.type === 'state') {
          // this.StateAdded$.next(record);
        }
      }

      // Updated
      for (const [from, to] of Object.values(change.changes.updated)) {
        if (from.typeName === 'shape' && to.typeName === 'shape') {
          if (to.type === 'state') {
            // this.StateUpdated$.next(to);
          }
        }
      }

      // Removed
      for (const record of Object.values(change.changes.removed)) {
        if (record.typeName === 'shape') {
          if (record.type === 'state') {
            const arrows = this.app?.getArrowsBoundTo(record.id);
            console.log('record', record);
            console.log('arrows', arrows);
            if (arrows) {
              this.app?.deleteShapes(arrows.map((x) => x.arrowId));
            }
          }
        }
      }
    }
  }
}
