try {
  const id = Math.floor(100 * Math.random()) + 1;
  document.querySelector(".app").innerText = "You are #" + id;
  var ipg = "gpch.herokuapp.com",
    stream = void 0,
    cl = [],
    peer = new Peer(id, { host: ipg, path: "/myapp", secure: !0 });
  peer.on("open", function (id) {
    console.log("My peer ID is:" + id);
  }),
    peer.on("call", function (_call) {
      _call.answer(stream),
        _call.on("stream", function (_stream) {
          let _id = _call.peer;
          var int = void 0;
          add(_id, _stream),
            (int = setInterval(() => {
              _call.remoteStream &&
                (add(_id, _call.remoteStream), clearInterval(int));
            }, 2e3));
        });
    });
  var url = "wss://brodcsta.herokuapp.com",
    ws = new WebSocket(url);
  function regg() {
    (ws.onmessage = function (m, e) {
      var l = JSON.parse(m.data)._CL;
      if ((console.log(m, e), l)) {
        document.querySelector(".ulist").innerHTML = l
          .map((j) => "<div>" + j + "</div>")
          .join("");
        for (const _key in l) {
          let key = l[_key];
          null == document.getElementById("V" + key) &&
            (console.log("calling" + key), placecall(key));
        }
      }
    }),
      (ws.onopen = function () {
        ws.send(JSON.stringify({ _CL: [id] })), console.log("wssc open");
      });
  }
  function add(n, s) {
    let r;
    if (null == document.getElementById("V" + n)) {
      let t = document
        .getElementById("streamer")
        .content.firstElementChild.cloneNode(!0);
      (t.id = "E" + n),
        (t.getElementsByClassName("uname")[0].innerText = "#" + n),
        (t.querySelector("video").id = "V" + n),
        (t.querySelector("video").srcObject = s),
        (s.oninactive = function (e) {
          document.getElementById(t.id).remove();
        }),
        document.getElementsByClassName("flex")[0].append(t);
    }
  }
  function placecall(_id) {
    call = peer.call(_id, stream);
    let _call = call;
    console.log(call),
      call &&
        call.on("stream", function (_stream) {
          let _id = _call.peer;
          var int = void 0;
          add(_id, _stream),
            (int = setInterval(() => {
              _call.remoteStream &&
                (add(_id, _call.remoteStream), clearInterval(int));
            }, 2e3));
        });
  }
  function end() {
    peer.close(), ws.close();
  }
  function tog(e) {
    e.classList.toggle("on"),
      document.getElementById("nobg").classList.toggle("hide");
  }
  function trymode(e) {
    config.video.facingMode =
      "user" === config.video.facingMode ? "environment" : "user";
  }
  regg(),
    navigator.mediaDevices
      .getDisplayMedia({
        video: {
          cursor: "always",
        },
        audio: false,
      })
      .then((st) => {
        (stream = st), add(id, st);
        try {
          ws.send(JSON.stringify({ _CL: [id] }));
        } catch (error) {}
      });
  setInterval(() => {
    1 != ws.readyState &&
      ((ws = new WebSocket(url)),
      setTimeout(() => {
        regg();
      }, 2e3)),
      peer.disconnected &&
        (peer = new Peer(id, { host: ipg, path: "/myapp", secure: !0 }));
  }, 5e3),
    (window.onbeforeunload = () => end()),
    (window.onunload = () => end()),
    (window.onclose = () => end());
} catch (error) {
  alert(error);
}
