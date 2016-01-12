class Main
    constructor: ->
        @$win = $(window)
        @$contents = $(".contents")
        @is_milkcocoa = true

        window.requestAnimationFrame =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame

        @milkcocoa = new window.MilkCocoa "iceia90idbv.mlkcca.com"
        @dataStore = @milkcocoa.dataStore "sample"

        @cur_rotate =
            x: 0
            y: 0
            z: 0

        @exec()

    exec: ->
        ####################################
        # EVENT LISTENER
        ####################################

        if $.browser.desktop
            if @is_milkcocoa
                @dataStore.on "send", (e) =>
                    @cur_rotate[e.value.vec] = e.value.accele

            @$win.on "resize", =>
                @camera.aspect = @$win.width() / @$win.height()
                @camera.updateProjectionMatrix()
                @renderer.setSize @$win.width(), @$win.height()

            @dataStore.send
                message: "hoge"
        else
            if @is_milkcocoa
                _vec = ["x", "y", "z"]
                window.addEventListener "devicemotion", $.throttle 50, (e) =>
                    for i in [0..._vec.length]
                        @dataStore.send
                            message: "motion"
                            vec: _vec[i]
                            accele: e.accelerationIncludingGravity[_vec[i]]

        ####################################
        # INIT
        ####################################

        if $.browser.desktop
            @camera = new THREE.PerspectiveCamera 60, @$win.width() / @$win.height(), 1, 4000
            @scene = new THREE.Scene()

            # camera
            @camera.position.z = 10

            # controls
            @controls = new THREE.TrackballControls @camera
            @controls.rotateSpeed = 5.0
            @controls.noZoom = true

            # light
            @scene.add new THREE.AmbientLight 0xcccccc
            _light = []
            _light[0] = new THREE.DirectionalLight 0xffffff, 0.8
            _light[0].position.set 0, 0, 1
            _light[1] = new THREE.DirectionalLight 0xffffff, 0.8
            _light[1].position.set 0, 0, -1
            @scene.add _light[0]
            @scene.add _light[1]

            # group
            @group = new THREE.Object3D()

            # render
            @renderer = new THREE.WebGLRenderer alpha: true
            @renderer.setSize @$win.width(), @$win.height()
            @$contents.append @renderer.domElement

            _loader = new THREE.JSONLoader()

            _loader.load "json/iphone.json", (geometry) =>
                @iphone = new THREE.Mesh(geometry,
                    new THREE.MeshPhongMaterial(
                        color: 0x000000
                        side: THREE.FrontSide
                        shininess: 6
                        specular: 0x999999
                        metal: true
                    )
                )

                _scale = 50
                @iphone.scale.x = _scale
                @iphone.scale.y = _scale
                @iphone.scale.z = _scale
                @group.add @iphone
                @render()

            @scene.add @group

    render: ->
        @controls.update() unless @is_milkcocoa

        # x axis
        if @cur_rotate.z < 0
            @group.rotation.x =
                (Math.PI * (9 * -@cur_rotate.y)) / 180
        else
            _vec = if @cur_rotate.y < 0 then 1 else -1
            @group.rotation.x =
                _vec * (Math.PI * (9 * (20 - Math.abs(@cur_rotate.y)))) / 180

        # y axis
        if @cur_rotate.y < 0
            @group.rotation.y =
                (Math.PI * (9 * -@cur_rotate.x)) / 180
        else
            _vec = if @cur_rotate.x < 0 then 1 else -1
            @group.rotation.y =
                _vec * (Math.PI * (9 * (20 - Math.abs(@cur_rotate.x)))) / 180

        # z axis
        if @cur_rotate.z < 0
            @group.rotation.z =
                (Math.PI * (9 * -@cur_rotate.x)) / 180
        else
            _vec = if @cur_rotate.x < 0 then 1 else -1
            @group.rotation.z =
                _vec * (Math.PI * (9 * (20 - Math.abs(@cur_rotate.x)))) / 180

        @renderer.render @scene, @camera
        window.requestAnimationFrame => @render()

new Main()
