
    Polymer('paper-shadow', {

      publish: {
        /**
         * If set, the shadow is applied to this node.
         *
         * @attribute target
         * @type Element
         * @default null
         */
        target: {value: null, reflect: true},

        /**
         * The z-depth of this shadow, from 0-5.
         *
         * @attribute z
         * @type number
         * @default 1
         */
        z: {value: 1, reflect: true},

        /**
         * If true, the shadow animates between z-depth changes.
         *
         * @attribute animated
         * @type boolean
         * @default false
         */
        animated: {value: false, reflect: true},

        /**
         * Workaround: getComputedStyle is wrong sometimes so `paper-shadow`
         * may overwrite the `position` CSS property. Set this property to
         * true to prevent this.
         *
         * @attribute hasPosition
         * @type boolean
         * @default false
         */
        hasPosition: {value: false}
      },

      // NOTE: include template so that styles are loaded, but remove
      // so that we can decide dynamically what part to include
      registerCallback: function(polymerElement) {
        var template = polymerElement.querySelector('template');
        this._style = template.content.querySelector('style');
        this._style.removeAttribute('no-shim');
      },

      fetchTemplate: function() {
        return null;
      },

      attached: function() {
        this.installScopeStyle(this._style);

        // If no target is bound at attach, default the target to the parent
        // element or shadow host.
        if (!this.target) {
          if (!this.parentElement && this.parentNode.host) {
            this.target = this.parentNode.host;
          } else if (this.parentElement && (window.ShadowDOMPolyfill ? this.parentElement !== wrap(document.body) : this.parentElement !== document.body)) {
            this.target = this.parentElement;
          }
        }
      },

      targetChanged: function(old) {
        if (old) {
          this.removeShadow(old);
        }
        if (this.target) {
          this.addShadow(this.target);
        }
      },

      zChanged: function(old) {
        if (this.target && this.target._paperShadow) {
          var shadow = this.target._paperShadow;
          ['top', 'bottom'].forEach(function(s) {
            shadow[s].classList.remove('paper-shadow-' + s + '-z-' + old);
            shadow[s].classList.add('paper-shadow-' + s + '-z-' + this.z);
          }.bind(this));
        }
      },

      animatedChanged: function() {
        if (this.target && this.target._paperShadow) {
          var shadow = this.target._paperShadow;
          ['top', 'bottom'].forEach(function(s) {
            if (this.animated) {
              shadow[s].classList.add('paper-shadow-animated');
            } else {
              shadow[s].classList.remove('paper-shadow-animated');
            }
          }.bind(this));
        }
      },

      addShadow: function(node) {
        if (node._paperShadow) {
          return;
        }

        var computed = getComputedStyle(node);
        if (!this.hasPosition && computed.position === 'static') {
          node.style.position = 'relative';
        }
        node.style.overflow = 'visible';

        // Both the top and bottom shadows are children of the target, so
        // it does not affect the classes and CSS properties of the target.
        ['top', 'bottom'].forEach(function(s) {
          var inner = (node._paperShadow && node._paperShadow[s]) || document.createElement('div');
          inner.classList.add('paper-shadow');
          inner.classList.add('paper-shadow-' + s + '-z-' + this.z);
          if (this.animated) {
            inner.classList.add('paper-shadow-animated');
          }

          if (node.shadowRoot) {
            node.shadowRoot.insertBefore(inner, node.shadowRoot.firstChild);
          } else {
            node.insertBefore(inner, node.firstChild);
          }

          node._paperShadow = node._paperShadow || {};
          node._paperShadow[s] = inner;
        }.bind(this));

      },

      removeShadow: function(node) {
        if (!node._paperShadow) {
          return;
        }

        ['top', 'bottom'].forEach(function(s) {
          node._paperShadow[s].remove();
        });
        node._paperShadow = null;

        node.style.position = null;
      }

    });
  ;

  Polymer('sc-image', {
    src: '',

    width: '200',

    height: 'auto',

    orientation: 'auto', // auto, landscape, portrait

    aspect: '4:3', // 4:3, 16:9, 16:10

    overflow: 'center',

    z: 1,

    ready: function() {

      this.resize();

      this.addEventListener('mouseover', function() {
        this.z = 2;
      });
      this.addEventListener('mouseout', function() {
        this.z = 1;
      });
      this.addEventListener('mousedown', function() {
        this.z = 5;
      });
      this.addEventListener('mouseup', function() {
        this.z = 2;
      });
    },

    resize: function() {
      if (this.width === 'auto' && this.height === 'auto') {

        // both width and height are 'auto'
        // ... add <img> tag
        this.$.image.innerHTML = '<img src="' + this.src + '" />';
        this.$.image.style.backgroundImage = '';

      } else if (this.width === 'auto' || this.height === 'auto') {

        // either width or height (or none of both) are 'auto'
        // format according to aspect and orientation settings
        var width = parseInt(this.width),
          height = parseInt(this.height),
          ratio = (m = this.aspect.match(/(\d+):(\d+)/)) ? m[1] / m[2] : parseFloat(this.aspect);
        switch (this.orientation) {
          case 'portrait':
            if (this.width === 'auto') width = height * ratio;
            if (this.height === 'auto') height = width * ratio;
            break;
          case 'landscape':
          case 'auto':
          default:
            if (this.width === 'auto') width = height / ratio;
            if (this.height === 'auto') height = width / ratio;
        }
        this.style.width = width + 'px';
        this.style.height = height + 'px';

      }
    }

  });
  