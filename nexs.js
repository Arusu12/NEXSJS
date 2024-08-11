import { Animate } from "./modules/animationManager.js";
import { apiManager } from "./modules/apiManager.js";
import { BlockManager } from "./modules/blockManager.js";
import { EasyBlocks } from "./modules/easyBlocks.js";
import { NEXS_Helper } from "./modules/helper.js";
import { LayoutManager } from "./modules/layoutManager.js";
import { Loader } from "./modules/loader.js";
import { PageManager } from "./modules/pageManager.js";
import { SectionManager } from "./modules/sectionManager.js";
import { userManager } from "./modules/userManager.js";
import { Listener } from "./modules/eventListener.js"

class NEXSJS {
  constructor() {
    this.initialized = true;
    this.currentLayout = '';
    this.sectionToRender = '';
    this.body = '';

    this.animations = new Animate(this);
    this.loader = new Loader(this);
    this.user = new userManager(this);
    this.api = new apiManager(this);

    this.pages = new PageManager(this);
    this.layouts = new LayoutManager(this);
    this.sections = new SectionManager(this);
    this.blocks = new BlockManager(this);

    this.listener = new Listener(this)
    this.block = new EasyBlocks(this);
    this.helper = new NEXS_Helper(this);
  }

  init(theme = { bgColor: '#333', bgImageUrl: '', opacity: 0.8 }, layout) {
    this.loader.css();
    this.loader.theme(theme);
    this.loader.prepare(layout);
  }
}

export default NEXSJS;