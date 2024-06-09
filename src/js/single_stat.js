export default () => ({
  visible: false,
  hide() {
    this.visible = false;
  },
  show(urlKey) {
    if (this.visible) {
      this.hide();

      return;
    }

    this.visible = true;
    console.log(Alpine.store('parse').urls[urlKey]);
  },

})
