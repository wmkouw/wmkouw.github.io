(() => {
  // ns-hugo-params:<stdin>
  var slides = { highlight_style: "dracula", theme: "black" };

  // <stdin>
  var enabledPlugins = [RevealMarkdown, RevealSearch, RevealNotes, RevealMath.KaTeX, RevealZoom];
  var isObject = (o) => o === Object(o) && !isArray(o) && typeof o !== "function";
  var isArray = (a) => Array.isArray(a);
  var toCamelCase = (s) => s.replace(/([-_][a-z])/gi, (term) => term.toUpperCase().replace("-", "").replace("_", ""));
  var keysToCamelCase = (o) => {
    if (isObject(o)) {
      const n = {};
      Object.keys(o).forEach((k) => {
        n[toCamelCase(k)] = keysToCamelCase(o[k]);
      });
      return n;
    } else if (isArray(o)) {
      return o.map((i) => keysToCamelCase(i));
    }
    return o;
  };
  var pluginOptions = {};
  if (typeof slides.reveal_options !== "undefined") {
    pluginOptions = slides.reveal_options;
  }
  pluginOptions = keysToCamelCase(pluginOptions);
  if (typeof pluginOptions.menu_enabled === "undefined") {
    pluginOptions.menu_enabled = true;
  }
  if (pluginOptions.menu_enabled) {
    enabledPlugins.push(RevealMenu);
  }
  pluginOptions.plugins = enabledPlugins;
  Reveal.initialize(pluginOptions);
  if (typeof slides.diagram === "undefined") {
    slides.diagram = false;
  }
  if (slides.diagram) {
    let mermaidOptions = {};
    if (typeof slides.diagram_options !== "undefined") {
      mermaidOptions = slides.diagram_options;
    }
    mermaidOptions.startOnLoad = false;
    mermaid.initialize(mermaidOptions);
    const renderMermaidDiagrams = function renderMermaidDiagrams2(event) {
      const mermaidDivs = event.currentSlide.querySelectorAll(".mermaid:not(.done)");
      const indices = Reveal.getIndices();
      const pageno = `${indices.h}-${indices.v}`;
      mermaidDivs.forEach((mermaidDiv, i) => {
        const insertSvg = (svgCode) => {
          mermaidDiv.innerHTML = svgCode;
          mermaidDiv.classList.add("done");
        };
        const graphDefinition = mermaidDiv.textContent;
        mermaid.mermaidAPI.render(`mermaid${pageno}-${i}`, graphDefinition, insertSvg);
      });
      Reveal.layout();
    };
    Reveal.on("ready", (event) => renderMermaidDiagrams(event));
    Reveal.on("slidechanged", (event) => renderMermaidDiagrams(event));
  }
})();
