//import "./chessboard"
import {
  IRenderMime
} from '@jupyterlab/rendermime-interfaces';

import {
  Widget
} from '@phosphor/widgets';

//import * as Chessboard from "oakmac-chessboard";
//import "oakmac-chessboard";
import FENBoard from 'fen-chess-board';

import "../style/index.css";

//import "../style/index.css";

// cf https://www.iana.org/assignments/media-types/text/vnd.graphviz
const TYPES: {[key: string]: {name: string, extensions: string[], engine: any}} = {
  'application/vnd.chesslog': {
    name: 'chesslog',
    extensions: ['.chesslog'],
    engine: 'chesslog'
  }
};

// interface Window {
//   Chessboard(containerElOrString:any, config?:any): any;
// }

//var window:Window;

/**
 * A widget for rendering data, for usage with rendermime.
 */
export
class RenderedData extends Widget implements IRenderMime.IRenderer {
  /**
   * Create a new widget for rendering chesslog files
   */
  constructor(options: IRenderMime.IRendererOptions) {
    super();
    this._mimeType = options.mimeType;
    this._engine = TYPES[this._mimeType].engine;
    this.addClass('jp-chesslog');
    this.div = document.createElement('div');
    this.div.className = "board";
    //(<any>window).Chessboard('board');
    
    //this.div.innerHTML = this.cb;
    console.log("initiate chesslog");
    this.node.appendChild(this.div);
  }

  /**
   * Render into this widget's node.
   */
  renderModel(model: IRenderMime.IMimeModel): Promise<void> {
    let data = model.data[this._mimeType];
    
    //var ruyLopez = 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R';
    //(<any>window).Chessboard('board', ruyLopez);
    console.log(data.toString());
    let lines = data.toString().split("\n");
    for (let n = 0;  n< lines.length; n++){
      let fenBoard = new FENBoard(lines[n].trim());
      let fenArray = fenBoard.board;
      console.log(fenArray);
      var table = document.createElement("table");
      table.setAttribute("border", "1");      

      for (var i = 0; i < fenArray.length; i++) {
        var row = table.insertRow(-1);
        for(var j = 0; j < fenArray[i].length; j++){
          var cell = row.insertCell(-1);
          cell.appendChild(document.createTextNode(fenArray[i][j]));
        }
      }
    let notation = document.createElement('div');
    notation.innerHTML = `Move# ${n+1}:`
    this.div.appendChild(notation);
    this.div.appendChild(document.createElement('br'));
    this.div.appendChild(table);
    this.div.appendChild(document.createElement('br'));
    }

   console.log("render chesslog");
    //this.div.innerHTML = this.cb;
    return Promise.resolve();
  }

  cb: any;
  div: any;
  private _mimeType: string;
  private _engine: any;
}

/**
 * A mime renderer factory for data.
 */
export
const rendererFactory: IRenderMime.IRendererFactory = {
  safe: false,
  mimeTypes: Object.keys(TYPES),
  createRenderer: options => new RenderedData(options)
};

const extensions = Object.keys(TYPES).map(k => {
  const name = TYPES[k].name;
  return {
    name,
    rendererFactory,
    rank: 0,
    dataType: 'string',
    fileTypes: [{
      name,
      extensions: TYPES[k].extensions,
      mimeTypes: [k]
    }],
    documentWidgetFactoryOptions: {
      name,
      primaryFileType: name,
      fileTypes: [name],
      defaultFor: [name],
    }
  } as IRenderMime.IExtension;
});

export default extensions;
