fetch("/components/nav-bar.html")
        .then(res => res.text())
        .then(data => {
          document.getElementById("nav-bar").innerHTML = data;
        });

fetch("/components/footer.html")
        .then(res => res.text())
        .then(data => {
          document.getElementById("footer").innerHTML = data;
        });