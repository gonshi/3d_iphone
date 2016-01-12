var Main;

Main = (function() {
  function Main() {
    this.$win = $(window);
    this.$contents = $(".contents");
    this.is_milkcocoa = true;
    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    this.milkcocoa = new window.MilkCocoa("iceia90idbv.mlkcca.com");
    this.dataStore = this.milkcocoa.dataStore("sample");
    this.cur_rotate = {
      x: 0,
      y: 0,
      z: 0
    };
    this.exec();
  }

  Main.prototype.exec = function() {
    var _light, _loader, _vec;
    if ($.browser.desktop) {
      if (this.is_milkcocoa) {
        this.dataStore.on("send", (function(_this) {
          return function(e) {
            return _this.cur_rotate[e.value.vec] = e.value.accele;
          };
        })(this));
      }
      this.$win.on("resize", (function(_this) {
        return function() {
          _this.camera.aspect = _this.$win.width() / _this.$win.height();
          _this.camera.updateProjectionMatrix();
          return _this.renderer.setSize(_this.$win.width(), _this.$win.height());
        };
      })(this));
      this.dataStore.send({
        message: "hoge"
      });
    } else {
      if (this.is_milkcocoa) {
        _vec = ["x", "y", "z"];
        window.addEventListener("devicemotion", $.throttle(50, (function(_this) {
          return function(e) {
            var i, j, ref, results;
            results = [];
            for (i = j = 0, ref = _vec.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
              results.push(_this.dataStore.send({
                message: "motion",
                vec: _vec[i],
                accele: e.accelerationIncludingGravity[_vec[i]]
              }));
            }
            return results;
          };
        })(this)));
      }
    }
    if ($.browser.desktop) {
      this.camera = new THREE.PerspectiveCamera(60, this.$win.width() / this.$win.height(), 1, 4000);
      this.scene = new THREE.Scene();
      this.camera.position.z = 10;
      this.controls = new THREE.TrackballControls(this.camera);
      this.controls.rotateSpeed = 5.0;
      this.controls.noZoom = true;
      this.scene.add(new THREE.AmbientLight(0xcccccc));
      _light = [];
      _light[0] = new THREE.DirectionalLight(0xffffff, 0.8);
      _light[0].position.set(0, 0, 1);
      _light[1] = new THREE.DirectionalLight(0xffffff, 0.8);
      _light[1].position.set(0, 0, -1);
      this.scene.add(_light[0]);
      this.scene.add(_light[1]);
      this.group = new THREE.Object3D();
      this.renderer = new THREE.WebGLRenderer({
        alpha: true
      });
      this.renderer.setSize(this.$win.width(), this.$win.height());
      this.$contents.append(this.renderer.domElement);
      _loader = new THREE.JSONLoader();
      _loader.load("json/iphone.json", (function(_this) {
        return function(geometry) {
          var _scale;
          _this.iphone = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
            color: 0x000000,
            side: THREE.FrontSide,
            shininess: 6,
            specular: 0x999999,
            metal: true
          }));
          _scale = 50;
          _this.iphone.scale.x = _scale;
          _this.iphone.scale.y = _scale;
          _this.iphone.scale.z = _scale;
          _this.group.add(_this.iphone);
          return _this.render();
        };
      })(this));
      return this.scene.add(this.group);
    }
  };

  Main.prototype.render = function() {
    var _vec;
    if (!this.is_milkcocoa) {
      this.controls.update();
    }
    if (this.cur_rotate.z < 0) {
      this.group.rotation.x = (Math.PI * (9 * -this.cur_rotate.y)) / 180;
    } else {
      _vec = this.cur_rotate.y < 0 ? 1 : -1;
      this.group.rotation.x = _vec * (Math.PI * (9 * (20 - Math.abs(this.cur_rotate.y)))) / 180;
    }
    if (this.cur_rotate.y < 0) {
      this.group.rotation.y = (Math.PI * (9 * -this.cur_rotate.x)) / 180;
    } else {
      _vec = this.cur_rotate.x < 0 ? 1 : -1;
      this.group.rotation.y = _vec * (Math.PI * (9 * (20 - Math.abs(this.cur_rotate.x)))) / 180;
    }
    if (this.cur_rotate.z < 0) {
      this.group.rotation.z = (Math.PI * (9 * -this.cur_rotate.x)) / 180;
    } else {
      _vec = this.cur_rotate.x < 0 ? 1 : -1;
      this.group.rotation.z = _vec * (Math.PI * (9 * (20 - Math.abs(this.cur_rotate.x)))) / 180;
    }
    this.renderer.render(this.scene, this.camera);
    return window.requestAnimationFrame((function(_this) {
      return function() {
        return _this.render();
      };
    })(this));
  };

  return Main;

})();

new Main();
