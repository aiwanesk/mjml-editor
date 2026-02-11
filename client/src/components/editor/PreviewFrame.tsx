import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";

export interface PreviewFrameHandle {
  patchContent: (nodeId: string, content: string) => void;
}

interface PreviewFrameProps {
  html: string;
  width: number;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onHoverNode: (id: string | null) => void;
}

const INJECT_SCRIPT = `
<script>
(function() {
  var HIGHLIGHT_COLOR = 'rgba(99, 102, 241, 0.15)';
  var SELECTED_COLOR = 'rgba(99, 102, 241, 0.25)';
  var BORDER_COLOR = '#6366f1';

  var overlay = null;
  var selectedOverlay = null;

  function createOverlay(id) {
    var el = document.createElement('div');
    el.id = id;
    el.style.cssText = 'position:absolute;pointer-events:none;z-index:9999;transition:all 0.15s ease;';
    document.body.appendChild(el);
    return el;
  }

  function positionOverlay(el, target, color, borderColor) {
    var rect = target.getBoundingClientRect();
    el.style.top = (rect.top + window.scrollY) + 'px';
    el.style.left = rect.left + 'px';
    el.style.width = rect.width + 'px';
    el.style.height = rect.height + 'px';
    el.style.background = color;
    el.style.border = '2px solid ' + borderColor;
    el.style.borderRadius = '4px';
    el.style.display = 'block';
  }

  document.addEventListener('mouseover', function(e) {
    var target = e.target.closest('[data-node-id]');
    if (!overlay) overlay = createOverlay('hover-overlay');
    if (target) {
      positionOverlay(overlay, target, HIGHLIGHT_COLOR, BORDER_COLOR);
      window.parent.postMessage({ type: 'hover', nodeId: target.getAttribute('data-node-id') }, '*');
    } else {
      overlay.style.display = 'none';
      window.parent.postMessage({ type: 'hover', nodeId: null }, '*');
    }
  });

  document.addEventListener('click', function(e) {
    e.preventDefault();
    var target = e.target.closest('[data-node-id]');
    if (!selectedOverlay) selectedOverlay = createOverlay('selected-overlay');
    if (target) {
      positionOverlay(selectedOverlay, target, SELECTED_COLOR, BORDER_COLOR);
      window.parent.postMessage({ type: 'select', nodeId: target.getAttribute('data-node-id') }, '*');
    } else {
      selectedOverlay.style.display = 'none';
      window.parent.postMessage({ type: 'select', nodeId: null }, '*');
    }
  });

  window.addEventListener('message', function(e) {
    if (e.data.type === 'highlight') {
      if (!selectedOverlay) selectedOverlay = createOverlay('selected-overlay');
      var nodeId = e.data.nodeId;
      if (nodeId) {
        var el = document.querySelector('[data-node-id="' + nodeId + '"]');
        if (el) {
          positionOverlay(selectedOverlay, el, SELECTED_COLOR, BORDER_COLOR);
        }
      } else {
        selectedOverlay.style.display = 'none';
      }
    }

    if (e.data.type === 'patchContent') {
      var target = document.querySelector('[data-node-id="' + e.data.nodeId + '"]');
      if (target) {
        var textEl = target.querySelector('div') || target.querySelector('p') || target.querySelector('a');
        if (textEl) {
          textEl.innerHTML = e.data.content;
        } else {
          target.innerHTML = e.data.content;
        }
      }
    }

    if (e.data.type === 'replaceHtml') {
      var parser = new DOMParser();
      var newDoc = parser.parseFromString(e.data.html, 'text/html');
      // Update styles in head (remove old, add new)
      var oldStyles = document.querySelectorAll('head style');
      oldStyles.forEach(function(s) { s.remove(); });
      var newStyles = newDoc.querySelectorAll('head style');
      newStyles.forEach(function(s) { document.head.appendChild(s.cloneNode(true)); });
      // Replace body content (preserves our script)
      document.body.innerHTML = newDoc.body.innerHTML;
      // Reset overlays since old DOM nodes are gone
      overlay = null;
      selectedOverlay = null;
      // Notify parent that replace is done
      window.parent.postMessage({ type: 'htmlReplaced' }, '*');
    }
  });
})();
</script>
`;

export const PreviewFrame = forwardRef<PreviewFrameHandle, PreviewFrameProps>(
  function PreviewFrame(
    { html, width, selectedNodeId, hoveredNodeId, onSelectNode, onHoverNode },
    ref
  ) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const loadedRef = useRef(false);
    const htmlVersionRef = useRef(0);
    const [srcDoc, setSrcDoc] = useState("");

    useImperativeHandle(ref, () => ({
      patchContent(nodeId: string, content: string) {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "patchContent", nodeId, content },
          "*"
        );
      },
    }));

    // Track HTML versions: first sets srcDoc, subsequent use postMessage
    useEffect(() => {
      if (!html) return;
      htmlVersionRef.current++;

      if (htmlVersionRef.current === 1) {
        // First HTML — set as srcDoc (triggers iframe load)
        setSrcDoc(html.replace("</body>", `${INJECT_SCRIPT}</body>`));
      } else if (loadedRef.current) {
        // Subsequent — update in place via postMessage (no flash)
        iframeRef.current?.contentWindow?.postMessage(
          { type: "replaceHtml", html },
          "*"
        );
      }
    }, [html]);

    const handleIframeLoad = useCallback(() => {
      loadedRef.current = true;
    }, []);

    const handleMessage = useCallback(
      (e: MessageEvent) => {
        if (e.data.type === "select") {
          onSelectNode(e.data.nodeId);
        } else if (e.data.type === "hover") {
          onHoverNode(e.data.nodeId);
        }
      },
      [onSelectNode, onHoverNode]
    );

    useEffect(() => {
      window.addEventListener("message", handleMessage);
      return () => window.removeEventListener("message", handleMessage);
    }, [handleMessage]);

    useEffect(() => {
      if (iframeRef.current?.contentWindow) {
        iframeRef.current.contentWindow.postMessage(
          { type: "highlight", nodeId: selectedNodeId },
          "*"
        );
      }
    }, [selectedNodeId]);

    return (
      <div className="h-full flex items-start justify-center bg-gray-100 p-4 overflow-auto">
        <iframe
          ref={iframeRef}
          srcDoc={srcDoc}
          onLoad={handleIframeLoad}
          style={{ width: `${width}px`, height: "100%", minHeight: "600px" }}
          className="bg-white shadow-lg rounded-lg border border-gray-200"
          title="Aperçu du template"
        />
      </div>
    );
  }
);
