import {
  BaseBoxShapeTool,
  BaseBoxShapeUtil,
  ShapeProps,
  TLBaseShape,
  TLClickEvent,
  defineMigrations,
  defineShape,
} from '@tldraw/editor';
import { T } from '@tldraw/validate';

import parse from 'html-react-parser';

export const StateShapeProps: ShapeProps<IStateShape> = {
  w: T.number,
  h: T.number,
  text: T.string,
  userdata: T.any,
};

export type IStateShapeProps = {
  w: number;
  h: number;
  text: string;
  userdata: any;
};

export type IStateShape = TLBaseShape<'state', IStateShapeProps>;

export class TLStateUtil extends BaseBoxShapeUtil<IStateShape> {
  static override type = 'state' as const;

  override canResize = (_shape: any) => false;
  override canBind = (_shape: any) => true;

  override getDefaultProps(): IStateShapeProps {
    return {
      w: 150,
      h: 80,
      text: 'State',
      userdata: {},
    };
  }

  override onDoubleClick = (shape: any) => {
    console.log('onDoubleClick', shape);
    (<any>this.editor)['appsvc'].infodialog(shape);
    return shape;
  };

  override onBeforeCreate = (shape: any) => {
    shape.props.text = 'New State';
    shape.props.w = 150;
    shape.props.h = 80;
    shape.props.userdata = {};
    return shape;
  };

  override indicator(shape: IStateShape) {
    return parse(`
    <rect width="${shape.props.w}" height="${shape.props.h}"/>
    `) as JSX.Element;
  }

  override component = (shape: any) => {
    return parse(`
    <app-customshape shape="${shape.id}"></app-tlstate>
    `) as JSX.Element;
  };
}

export class StateTool extends BaseBoxShapeTool {
  static override id = 'state';
  static override initial = 'idle';
  override shapeType = TLStateUtil;
  override onDoubleClick: TLClickEvent = (_info) => {
    console.log('onDoubleClick', _info);
    // you can handle events in handlers like this one;
    // check the BaseBoxShapeTool source as an example
  };
}

export const stateShapeMigrations = defineMigrations({
  currentVersion: 1,
  migrators: {
    1: {
      // for example, removing a property from the shape
      up(shape) {
        const migratedUpShape = { ...shape };
        //delete migratedUpShape._somePropertyToRemove
        return migratedUpShape;
      },
      down(shape) {
        const migratedDownShape = { ...shape };
        //migratedDownShape._somePropertyToRemove = 'some value'
        return migratedDownShape;
      },
    },
  },
});

export const StateShapeDef = defineShape('state', {
  // A utility class
  util: TLStateUtil,
  // A tool that is used to create and edit the shape (optional)
  tool: StateTool,
  // A validation schema for the shape's props (optional)
  props: StateShapeProps,
  // Migrations for upgrading shapes (optional)
  migrations: stateShapeMigrations,
});
