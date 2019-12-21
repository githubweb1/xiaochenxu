var t = getApp(),
  e = t.requirejs("core");
Page({
  data: {
    storeid: 0,
    markers: [],
    store: {},
  },
  onLoad: function(t) {
    var merch = t.merchuserid

    if (t.id) {
      this.setData({
        storeid: t.id
      }), this.getInfo()
    } else if (merch) {
      this.setData({
        merch: t.merchuserid
      })
      this.merchInfo()
    }
  },
  merchInfo: function() {
    var t = this;
    console.log(this.data.merch)
    e.get("merch/map", {
      merchid: this.data.merch
    }, function(e) {
      t.setData({
        store: e.result.store,
        markers: [{
          id: 1,
          latitude: Number(e.result.store.lat),
          longitude: Number(e.result.store.lng),
          width: 39,
          height: 25,
          iconPath: "http://xcxvip.iiio.top/addons/wx_shop./plugin/app/static/images/red.png",
        }],
        show: !0
      })
    })
  },
  getInfo: function() {
    var t = this;
    e.get("store/map", {
      id: this.data.storeid
    }, function(e) {
      t.setData({
        store: e.store,
        markers: [{
          id: 1,
          latitude: Number(e.store.lat),
          longitude: Number(e.store.lng)
        }],
        show: !0
      })
    })
  },
  phone: function(t) {
    e.phone(t)
  }
})