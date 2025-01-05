export default () => ({
  visible: false,
  current: '',
  data: {},
  hide() {
    this.visible = false;
  },
  show(urlKey) {
    if (this.visible && this.current === urlKey) {
      this.hide();

      return;
    }

    this.visible = true;
    this.data = Alpine.store('parse').urls[urlKey];
    this.current = urlKey;
  },
  get(path) {
    let keys = path.split('.')
    let output = this.data;

    for(let key of keys) {
      output = output[key] ?? '';
    }

    return output;
  }
})
