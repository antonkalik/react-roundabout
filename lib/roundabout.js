'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Roundabout = function (_React$Component) {
  _inherits(Roundabout, _React$Component);

  function Roundabout() {
    _classCallCheck(this, Roundabout);

    var _this = _possibleConstructorReturn(this, (Roundabout.__proto__ || Object.getPrototypeOf(Roundabout)).call(this));

    _this.state = {
      dragStart: 0,
      dragStartTime: new Date(),
      index: 0,
      lastIndex: 0,
      transition: false
    };
    return _this;
  }

  _createClass(Roundabout, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var selected = this.props.selected;


      this.setState({
        index: selected,
        lastIndex: selected
      });
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var selected = this.props.selected;


      if (selected !== nextProps.selected) {
        this.goToSlide(nextProps.selected);
      }
    }
  }, {
    key: 'getDragX',
    value: function getDragX(event, isTouch) {
      return isTouch ? event.touches[0].pageX : event.pageX;
    }
  }, {
    key: 'handleDragStart',
    value: function handleDragStart(event, isTouch) {
      var x = this.getDragX(event, isTouch);

      this.setState({
        dragStart: x,
        dragStartTime: new Date(),
        transition: false,
        slideWidth: this.refs.slider.offsetWidth
      });
    }
  }, {
    key: 'handleDragMove',
    value: function handleDragMove(event, isTouch) {
      var _state = this.state,
          dragStart = _state.dragStart,
          lastIndex = _state.lastIndex,
          slideWidth = _state.slideWidth;

      var x = this.getDragX(event, isTouch);
      var offset = dragStart - x;
      var percentageOffset = offset / slideWidth;
      var newIndex = lastIndex + percentageOffset;
      var SCROLL_OFFSET_TO_STOP_SCROLL = 30;

      // Stop scrolling if you slide more than 30 pixels
      if (Math.abs(offset) > SCROLL_OFFSET_TO_STOP_SCROLL) {
        event.stopPropagation();
        event.preventDefault();
      }

      this.setState({
        index: newIndex
      });
    }
  }, {
    key: 'handleDragEnd',
    value: function handleDragEnd() {
      var children = this.props.children;
      var _state2 = this.state,
          dragStartTime = _state2.dragStartTime,
          index = _state2.index,
          lastIndex = _state2.lastIndex;


      var timeElapsed = new Date().getTime() - dragStartTime.getTime();
      var offset = lastIndex - index;
      var velocity = Math.round(offset / timeElapsed * 10000);

      var newIndex = Math.round(index);

      if (Math.abs(velocity) > 5) {
        newIndex = velocity < 0 ? lastIndex + 1 : lastIndex - 1;
      }

      if (newIndex < 0) {
        newIndex = 0;
      } else if (newIndex >= children.length) {
        newIndex = children.length - 1;
      }

      this.setState({
        dragStart: 0,
        index: newIndex,
        lastIndex: newIndex,
        transition: true
      });
    }
  }, {
    key: 'goToSlide',
    value: function goToSlide(index, event) {
      var _props = this.props,
          children = _props.children,
          loop = _props.loop;


      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (index < 0) {
        index = loop ? children.length - 1 : 0;
      } else if (index >= children.length) {
        index = loop ? 0 : children.length - 1;
      }

      this.setState({
        index: index,
        lastIndex: index,
        transition: true
      });
    }
  }, {
    key: 'renderNav',
    value: function renderNav() {
      var _this2 = this;

      var children = this.props.children;
      var lastIndex = this.state.lastIndex;


      var nav = children.map(function (slide, index) {
        var buttonClasses = index === lastIndex ? 'Slider-navButton Slider-navButton--active' : 'Slider-navButton';

        return _react2.default.createElement('button', { key: index, className: buttonClasses, onClick: function onClick(event) {
            return _this2.goToSlide(index, event);
          } });
      });

      return _react2.default.createElement(
        'div',
        { className: 'Slider-nav' },
        nav
      );
    }
  }, {
    key: 'renderArrows',
    value: function renderArrows() {
      var _this3 = this;

      var _props2 = this.props,
          children = _props2.children,
          loop = _props2.loop,
          showNav = _props2.showNav;
      var lastIndex = this.state.lastIndex;

      var arrowsClasses = showNav ? 'Slider-arrows' : 'Slider-arrows Slider-arrows--noNav';

      return _react2.default.createElement(
        'div',
        { className: arrowsClasses },
        loop || lastIndex > 0 ? _react2.default.createElement('button', {
          className: 'Slider-arrow Slider-arrow--left',
          onClick: function onClick(event) {
            return _this3.goToSlide(lastIndex - 1, event);
          } }) : null,
        loop || lastIndex < children.length - 1 ? _react2.default.createElement('button', {
          className: 'Slider-arrow Slider-arrow--right',
          onClick: function onClick(event) {
            return _this3.goToSlide(lastIndex + 1, event);
          } }) : null
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this4 = this;

      var _props3 = this.props,
          children = _props3.children,
          showArrows = _props3.showArrows,
          showNav = _props3.showNav;
      var _state3 = this.state,
          index = _state3.index,
          transition = _state3.transition;


      var slidesStyles = {
        width: 100 * children.length + '%',
        transform: 'translateX(' + -1 * index * (100 / children.length) + '%)'
      };
      var slidesClasses = transition ? 'Slider-slides Slider-slides--transition' : 'Slider-slides';

      return _react2.default.createElement(
        'div',
        { className: 'Slider', ref: 'slider' },
        showArrows && this.renderArrows(),
        showNav && this.renderNav(),
        _react2.default.createElement(
          'div',
          {
            className: 'Slider-inner',
            onTouchStart: function onTouchStart(event) {
              return _this4.handleDragStart(event, true);
            },
            onTouchMove: function onTouchMove(event) {
              return _this4.handleDragMove(event, true);
            },
            onTouchEnd: function onTouchEnd() {
              return _this4.handleDragEnd(true);
            } },
          _react2.default.createElement(
            'div',
            {
              className: slidesClasses,
              style: slidesStyles },
            children
          )
        )
      );
    }
  }]);

  return Roundabout;
}(_react2.default.Component);

exports.default = Roundabout;


Roundabout.defaultProps = {
  loop: false,
  selected: 0,
  showArrows: true,
  showNav: true
};

Roundabout.propTypes = {
  loop: _propTypes2.default.bool,
  selected: _propTypes2.default.number,
  showArrows: _propTypes2.default.bool,
  showNav: _propTypes2.default.bool,
  children: _propTypes2.default.any
};
