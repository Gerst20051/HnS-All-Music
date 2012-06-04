/* 
 Copyright (c) 2011 Brandon Aaron (http://brandonaaron.net)
 Licensed under the MIT License (LICENSE.txt).

 Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 Thanks to: Seamus Leahy for adding deltaX and deltaY

 Version: 3.0.6

 Requires: 1.2.2+
*/
(function (b) {
	function g(g) {
		var k = g || window.event,
			n = [].slice.call(arguments, 1),
			q = 0,
			s = 0,
			x = 0,
			g = b.event.fix(k);
		g.type = "mousewheel";
		k.wheelDelta && (q = k.wheelDelta / 120);
		k.detail && (q = -k.detail / 3);
		x = q;
		void 0 !== k.axis && k.axis === k.HORIZONTAL_AXIS && (x = 0, s = -1 * q);
		void 0 !== k.wheelDeltaY && (x = k.wheelDeltaY / 120);
		void 0 !== k.wheelDeltaX && (s = -1 * k.wheelDeltaX / 120);
		n.unshift(g, q, s, x);
		return (b.event.dispatch || b.event.handle).apply(this, n)
	}
	var q = ["DOMMouseScroll", "mousewheel"];
	if (b.event.fixHooks) for (var s = q.length; s;) b.event.fixHooks[q[--s]] = b.event.mouseHooks;
	b.event.special.mousewheel = {
		setup: function () {
			if (this.addEventListener) for (var b = q.length; b;) this.addEventListener(q[--b], g, !1);
			else this.onmousewheel = g
		},
		teardown: function () {
			if (this.removeEventListener) for (var b = q.length; b;) this.removeEventListener(q[--b], g, !1);
			else this.onmousewheel = null
		}
	};
	b.fn.extend({
		mousewheel: function (b) {
			return b ? this.bind("mousewheel", b) : this.trigger("mousewheel")
		},
		unmousewheel: function (b) {
			return this.unbind("mousewheel", b)
		}
	})
})(jQuery);

/*
 jScrollPane - v2.0.0beta11 - 2011-07-04
 http://jscrollpane.kelvinluck.com/

 Copyright (c) 2010 Kelvin Luck
 Dual licensed under the MIT and GPL licenses.
*/
(function (b, g, q) {
	b.fn.jScrollPane = function (g) {
		function p(g, n) {
			function p(f) {
				var j, n, o, u, x, A = !1,
					D = !1;
				C = f;
				if (P === q) u = g.scrollTop(), x = g.scrollLeft(), g.css({
					overflow: "hidden",
					padding: 0
				}), J = g.innerWidth() + Ca, G = g.innerHeight(), g.width(J), P = b('<div class="jspPane" />').css("padding", ab).append(g.children()), L = b('<div class="jspContainer" />').css({
					width: J + "px",
					height: G + "px"
				}).append(P).appendTo(g);
				else {
					g.css("width", "");
					A = C.stickToBottom && fa();
					D = C.stickToRight && U();
					if (o = g.innerWidth() + Ca != J || g.outerHeight() != G) J = g.innerWidth() + Ca, G = g.innerHeight(), L.css({
						width: J + "px",
						height: G + "px"
					});
					if (!o && bb == X && P.outerHeight() == ba) {
						g.width(J);
						return
					}
					bb = X;
					P.css("width", "");
					g.width(J);
					L.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()
				}
				P.css("overflow", "auto");
				X = f.contentWidth ? f.contentWidth : P[0].scrollWidth;
				ba = P[0].scrollHeight;
				P.css("overflow", "");
				Oa = X / J;
				Pa = ba / G;
				ua = 1 < Pa;
				sa = 1 < Oa;
				if (!sa && !ua) g.removeClass("jspScrollable"), P.css({
					top: 0,
					width: L.width() - Ca
				}), L.unbind(cb), P.find(":input,a").unbind("focus.jsp"), g.attr("tabindex", "-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp"), K(), ka();
				else {
					g.addClass("jspScrollable");
					if (f = C.maintainPosition && (aa || da)) j = T(), n = v();
					s();
					t();
					e();
					f && (Q(D ? X - J : j, !1), H(A ? ba - G : n, !1));
					W();
					d();
					ja();
					C.enableKeyboardNavigation && ia();
					C.clickOnTrack && N();
					pa();
					C.hijackInternalLinks && ea()
				}
				C.autoReinitialise && !Sa ? Sa = setInterval(function () {
					p(C)
				}, C.autoReinitialiseDelay) : !C.autoReinitialise && Sa && clearInterval(Sa);
				u && g.scrollTop(0) && H(u, !1);
				x && g.scrollLeft(0) && Q(x, !1);
				g.trigger("jsp-initialised", [sa || ua])
			}
			function s() {
				ua && (L.append(b('<div class="jspVerticalBar" />').append(b('<div class="jspCap jspCapTop" />'), b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragTop" />'), b('<div class="jspDragBottom" />'))), b('<div class="jspCap jspCapBottom" />'))), Xa = L.find(">.jspVerticalBar"), xa = Xa.find(">.jspTrack"), ma = xa.find(">.jspDrag"), C.showArrows && (La = b('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp", j(0, -1)).bind("click.jsp", R), Ka = b('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp", j(0, 1)).bind("click.jsp", R), C.arrowScrollOnHover && (La.bind("mouseover.jsp", j(0, -1, La)), Ka.bind("mouseover.jsp", j(0, 1, Ka))), f(xa, C.verticalArrowPositions, La, Ka)), Ba = G, L.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function () {
					Ba = Ba - b(this).outerHeight()
				}), ma.hover(function () {
					ma.addClass("jspHover")
				}, function () {
					ma.removeClass("jspHover")
				}).bind("mousedown.jsp", function (d) {
					b("html").bind("dragstart.jsp selectstart.jsp", R);
					ma.addClass("jspActive");
					var e = d.pageY - ma.position().top;
					b("html").bind("mousemove.jsp", function (b) {
						D(b.pageY - e, false)
					}).bind("mouseup.jsp mouseleave.jsp", F);
					return false
				}), x())
			}
			function x() {
				xa.height(Ba + "px");
				aa = 0;
				$a = C.verticalGutter + xa.outerWidth();
				P.width(J - $a - Ca);
				try {
					0 === Xa.position().left && P.css("margin-left", $a + "px")
				} catch (b) {}
			}
			function t() {
				sa && (L.append(b('<div class="jspHorizontalBar" />').append(b('<div class="jspCap jspCapLeft" />'), b('<div class="jspTrack" />').append(b('<div class="jspDrag" />').append(b('<div class="jspDragLeft" />'), b('<div class="jspDragRight" />'))), b('<div class="jspCap jspCapRight" />'))), Ya = L.find(">.jspHorizontalBar"), oa = Ya.find(">.jspTrack"), na = oa.find(">.jspDrag"), C.showArrows && (Qa = b('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp", j(-1, 0)).bind("click.jsp", R), Ra = b('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp", j(1, 0)).bind("click.jsp", R), C.arrowScrollOnHover && (Qa.bind("mouseover.jsp", j(-1, 0, Qa)), Ra.bind("mouseover.jsp", j(1, 0, Ra))), f(oa, C.horizontalArrowPositions, Qa, Ra)), na.hover(function () {
					na.addClass("jspHover")
				}, function () {
					na.removeClass("jspHover")
				}).bind("mousedown.jsp", function (d) {
					b("html").bind("dragstart.jsp selectstart.jsp", R);
					na.addClass("jspActive");
					var e = d.pageX - na.position().left;
					b("html").bind("mousemove.jsp", function (b) {
						A(b.pageX - e, false)
					}).bind("mouseup.jsp mouseleave.jsp", F);
					return false
				}), ra = L.innerWidth(), o())
			}
			function o() {
				L.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function () {
					ra -= b(this).outerWidth()
				});
				oa.width(ra + "px");
				da = 0
			}
			function e() {
				if (sa && ua) {
					var d = oa.outerHeight(),
						e = xa.outerWidth();
					Ba -= d;
					b(Ya).find(">.jspCap:visible,>.jspArrow").each(function () {
						ra += b(this).outerWidth()
					});
					ra -= e;
					G -= e;
					J -= d;
					oa.parent().append(b('<div class="jspCorner" />').css("width", d + "px"));
					x();
					o()
				}
				sa && P.width(L.outerWidth() - Ca + "px");
				ba = P.outerHeight();
				Pa = ba / G;
				sa && (va = Math.ceil(1 / Oa * ra), va > C.horizontalDragMaxWidth ? va = C.horizontalDragMaxWidth : va < C.horizontalDragMinWidth && (va = C.horizontalDragMinWidth), na.width(va + "px"), qa = ra - va, Z(da));
				ua && (ya = Math.ceil(1 / Pa * Ba), ya > C.verticalDragMaxHeight ? ya = C.verticalDragMaxHeight : ya < C.verticalDragMinHeight && (ya = C.verticalDragMinHeight), ma.height(ya + "px"), ta = Ba - ya, E(aa))
			}
			function f(b, d, e, f) {
				var g = "before",
					j = "after";
				"os" == d && (d = /Mac/.test(navigator.platform) ? "after" : "split");
				d == g ? j = d : d == j && (g = d, d = e, e = f, f = d);
				b[g](e)[j](f)
			}
			function j(b, d, e) {
				return function () {
					u(b, d, this, e);
					this.blur();
					return !1
				}
			}
			function u(d, e, f, g) {
				var f = b(f).addClass("jspActive"),
					j, k, n = !0,
					o = function () {
						0 !== d && S.scrollByX(d * C.arrowButtonSpeed);
						0 !== e && S.scrollByY(e * C.arrowButtonSpeed);
						k = setTimeout(o, n ? C.initialDelay : C.arrowRepeatFreq);
						n = !1
					};
				o();
				j = g ? "mouseout.jsp" : "mouseup.jsp";
				g = g || b("html");
				g.bind(j, function () {
					f.removeClass("jspActive");
					k && clearTimeout(k);
					k = null;
					g.unbind(j)
				})
			}
			function N() {
				K();
				ua && xa.bind("mousedown.jsp", function (d) {
					if (d.originalTarget === q || d.originalTarget == d.currentTarget) {
						var e = b(this),
							f = e.offset(),
							g = d.pageY - f.top - aa,
							j, k = !0,
							n = function () {
								var b = e.offset(),
									b = d.pageY - b.top - ya / 2,
									f = G * C.scrollPagePercent,
									p = ta * f / (ba - G);
								if (0 > g) aa - p > b ? S.scrollByY(-f) : D(b);
								else if (0 < g) aa + p < b ? S.scrollByY(f) : D(b);
								else {
									o();
									return
								}
								j = setTimeout(n, k ? C.initialDelay : C.trackClickRepeatFreq);
								k = !1
							},
							o = function () {
								j && clearTimeout(j);
								j = null;
								b(document).unbind("mouseup.jsp", o)
							};
						n();
						b(document).bind("mouseup.jsp", o);
						return !1
					}
				});
				sa && oa.bind("mousedown.jsp", function (d) {
					if (d.originalTarget === q || d.originalTarget == d.currentTarget) {
						var e = b(this),
							f = e.offset(),
							g = d.pageX - f.left - da,
							j, k = !0,
							n = function () {
								var b = e.offset(),
									b = d.pageX - b.left - va / 2,
									f = J * C.scrollPagePercent,
									p = qa * f / (X - J);
								if (0 > g) da - p > b ? S.scrollByX(-f) : A(b);
								else if (0 < g) da + p < b ? S.scrollByX(f) : A(b);
								else {
									o();
									return
								}
								j = setTimeout(n, k ? C.initialDelay : C.trackClickRepeatFreq);
								k = !1
							},
							o = function () {
								j && clearTimeout(j);
								j = null;
								b(document).unbind("mouseup.jsp", o)
							};
						n();
						b(document).bind("mouseup.jsp", o);
						return !1
					}
				})
			}
			function K() {
				oa && oa.unbind("mousedown.jsp");
				xa && xa.unbind("mousedown.jsp")
			}
			function F() {
				b("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp");
				ma && ma.removeClass("jspActive");
				na && na.removeClass("jspActive")
			}
			function D(b, d) {
				ua && ((0 > b ? b = 0 : b > ta && (b = ta), d === q && (d = C.animateScroll), d) ? S.animate(ma, "top", b, E) : (ma.css("top", b), E(b)))
			}
			function E(b) {
				b === q && (b = ma.position().top);
				L.scrollTop(0);
				aa = b;
				var d = 0 === aa,
					e = aa == ta,
					b = -(b / ta) * (ba - G);
				if (ga != d || ha != e) ga = d, ha = e, g.trigger("jsp-arrow-change", [ga, ha, Ja, Ta]);
				C.showArrows && (La[d ? "addClass" : "removeClass"]("jspDisabled"), Ka[e ? "addClass" : "removeClass"]("jspDisabled"));
				P.css("top", b);
				g.trigger("jsp-scroll-y", [-b, d, e]).trigger("scroll")
			}
			function A(b, d) {
				sa && ((0 > b ? b = 0 : b > qa && (b = qa), d === q && (d = C.animateScroll), d) ? S.animate(na, "left", b, Z) : (na.css("left", b), Z(b)))
			}
			function Z(b) {
				b === q && (b = na.position().left);
				L.scrollTop(0);
				da = b;
				var d = 0 === da,
					e = da == qa,
					b = -(b / qa) * (X - J);
				if (Ja != d || Ta != e) Ja = d, Ta = e, g.trigger("jsp-arrow-change", [ga, ha, Ja, Ta]);
				C.showArrows && (Qa[d ? "addClass" : "removeClass"]("jspDisabled"), Ra[e ? "addClass" : "removeClass"]("jspDisabled"));
				P.css("left", b);
				g.trigger("jsp-scroll-x", [-b, d, e]).trigger("scroll")
			}
			function H(b, d) {
				D(b / (ba - G) * ta, d)
			}
			function Q(b, d) {
				A(b / (X - J) * qa, d)
			}
			function ca(d, e, f) {
				var g, j, k = 0,
					n = 0,
					o, p, q;
				try {
					g = b(d)
				} catch (s) {
					return
				}
				j = g.outerHeight();
				d = g.outerWidth();
				L.scrollTop(0);
				for (L.scrollLeft(0); !g.is(".jspPane");) if (k += g.position().top, n += g.position().left, g = g.offsetParent(), /^body|html$/i.test(g[0].nodeName)) return;
				g = v();
				o = g + G;
				k < g || e ? p = k - C.verticalGutter : k + j > o && (p = k - G + j + C.verticalGutter);
				p && H(p, f);
				k = T();
				p = k + J;
				n < k || e ? q = n - C.horizontalGutter : n + d > p && (q = n - J + d + C.horizontalGutter);
				q && Q(q, f)
			}
			function T() {
				return -P.position().left
			}
			function v() {
				return -P.position().top
			}
			function fa() {
				var b = ba - G;
				return 20 < b && 10 > b - v()
			}
			function U() {
				var b = X - J;
				return 20 < b && 10 > b - T()
			}
			function d() {
				L.unbind(cb).bind(cb, function (b, d, e, f) {
					b = da;
					d = aa;
					S.scrollBy(e * C.mouseWheelSpeed, -f * C.mouseWheelSpeed, !1);
					return b == da && d == aa
				})
			}
			function R() {
				return !1
			}
			function W() {
				P.find(":input,a").unbind("focus.jsp").bind("focus.jsp", function (b) {
					ca(b.target, !1)
				})
			}
			function ia() {
				function d() {
					var b = da,
						g = aa;
					switch (e) {
					case 40:
						S.scrollByY(C.keyboardSpeed, !1);
						break;
					case 38:
						S.scrollByY(-C.keyboardSpeed, !1);
						break;
					case 34:
					case 32:
						S.scrollByY(G * C.scrollPagePercent, !1);
						break;
					case 33:
						S.scrollByY(-G * C.scrollPagePercent, !1);
						break;
					case 39:
						S.scrollByX(C.keyboardSpeed, !1);
						break;
					case 37:
						S.scrollByX(-C.keyboardSpeed, !1)
					}
					return f = b != da || g != aa
				}
				var e, f, j = [];
				sa && j.push(Ya[0]);
				ua && j.push(Xa[0]);
				P.focus(function () {
					g.focus()
				});
				g.attr("tabindex", 0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp", function (g) {
					if (!(g.target !== this && (!j.length || !b(g.target).closest(j).length))) {
						var k = da,
							n = aa;
						switch (g.keyCode) {
						case 40:
						case 38:
						case 34:
						case 32:
						case 33:
						case 39:
						case 37:
							e = g.keyCode;
							d();
							break;
						case 35:
							H(ba - G);
							e = null;
							break;
						case 36:
							H(0), e = null
						}
						f = g.keyCode == e && k != da || n != aa;
						return !f
					}
				}).bind("keypress.jsp", function (b) {
					b.keyCode == e && d();
					return !f
				});
				C.hideFocus ? (g.css("outline", "none"), "hideFocus" in L[0] && g.attr("hideFocus", !0)) : (g.css("outline", ""), "hideFocus" in L[0] && g.attr("hideFocus", !1))
			}
			function pa() {
				if (location.hash && 1 < location.hash.length) {
					var d, e, f = escape(location.hash);
					try {
						d = b(f)
					} catch (g) {
						return
					}
					d.length && P.find(f) && (0 === L.scrollTop() ? e = setInterval(function () {
						0 < L.scrollTop() && (ca(f, !0), b(document).scrollTop(L.position().top), clearInterval(e))
					}, 50) : (ca(f, !0), b(document).scrollTop(L.position().top)))
				}
			}
			function ka() {
				b("a.jspHijack").unbind("click.jsp-hijack").removeClass("jspHijack")
			}
			function ea() {
				ka();
				b("a[href^=#]").addClass("jspHijack").bind("click.jsp-hijack", function () {
					var b = this.href.split("#");
					if (1 < b.length && (b = b[1], 0 < b.length && 0 < P.find("#" + b).length)) return ca("#" + b, !0), !1
				})
			}
			function ja() {
				var b, d, e, f, g, j = !1;
				L.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp", function (k) {
					k = k.originalEvent.touches[0];
					b = T();
					d = v();
					e = k.pageX;
					f = k.pageY;
					g = !1;
					j = !0
				}).bind("touchmove.jsp", function (k) {
					if (j) {
						var k = k.originalEvent.touches[0],
							n = da,
							o = aa;
						S.scrollTo(b + e - k.pageX, d + f - k.pageY);
						g = g || 5 < Math.abs(e - k.pageX) || 5 < Math.abs(f - k.pageY);
						return n == da && o == aa
					}
				}).bind("touchend.jsp", function () {
					j = !1
				}).bind("click.jsp-touchclick", function () {
					if (g) return g = !1
				})
			}
			var C, S = this,
				P, J, G, L, X, ba, Oa, Pa, ua, sa, ma, ta, aa, na, qa, da, Xa, xa, $a, Ba, ya, La, Ka, Ya, oa, ra, va, Qa, Ra, Sa, ab, Ca, bb, ga = !0,
				Ja = !0,
				ha = !1,
				Ta = !1,
				Ma = g.clone(!1, !1).empty(),
				cb = b.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp";
			ab = g.css("paddingTop") + " " + g.css("paddingRight") + " " + g.css("paddingBottom") + " " + g.css("paddingLeft");
			Ca = (parseInt(g.css("paddingLeft"), 10) || 0) + (parseInt(g.css("paddingRight"), 10) || 0);
			b.extend(S, {
				reinitialise: function (d) {
					d = b.extend({}, C, d);
					p(d)
				},
				scrollToElement: function (b, d, e) {
					ca(b, d, e)
				},
				scrollTo: function (b, d, e) {
					Q(b, e);
					H(d, e)
				},
				scrollToX: function (b, d) {
					Q(b, d)
				},
				scrollToY: function (b, d) {
					H(b, d)
				},
				scrollToPercentX: function (b, d) {
					Q(b * (X - J), d)
				},
				scrollToPercentY: function (b, d) {
					H(b * (ba - G), d)
				},
				scrollBy: function (b, d, e) {
					S.scrollByX(b, e);
					S.scrollByY(d, e)
				},
				scrollByX: function (b, d) {
					var e = (T() + Math[0 > b ? "floor" : "ceil"](b)) / (X - J);
					A(e * qa, d)
				},
				scrollByY: function (b, d) {
					var e = (v() + Math[0 > b ? "floor" : "ceil"](b)) / (ba - G);
					D(e * ta, d)
				},
				positionDragX: function (b, d) {
					A(b, d)
				},
				positionDragY: function (b, d) {
					D(b, d)
				},
				animate: function (b, d, e, f) {
					var g = {};
					g[d] = e;
					b.animate(g, {
						duration: C.animateDuration,
						easing: C.animateEase,
						queue: !1,
						step: f
					})
				},
				getContentPositionX: function () {
					return T()
				},
				getContentPositionY: function () {
					return v()
				},
				getContentWidth: function () {
					return X
				},
				getContentHeight: function () {
					return ba
				},
				getPercentScrolledX: function () {
					return T() / (X - J)
				},
				getPercentScrolledY: function () {
					return v() / (ba - G)
				},
				getIsScrollableH: function () {
					return sa
				},
				getIsScrollableV: function () {
					return ua
				},
				getContentPane: function () {
					return P
				},
				scrollToBottom: function (b) {
					D(ta, b)
				},
				hijackInternalLinks: function () {
					ea()
				},
				destroy: function () {
					var b = v(),
						d = T();
					g.removeClass("jspScrollable").unbind(".jsp");
					g.replaceWith(Ma.append(P.children()));
					Ma.scrollTop(b);
					Ma.scrollLeft(d)
				}
			});
			p(n)
		}
		g = b.extend({}, b.fn.jScrollPane.defaults, g);
		b.each(["mouseWheelSpeed", "arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function () {
			g[this] = g[this] || g.speed
		});
		return this.each(function () {
			var k = b(this),
				n = k.data("jsp");
			n ? n.reinitialise(g) : (n = new p(k, g), k.data("jsp", n))
		})
	};
	b.fn.jScrollPane.defaults = {
		showArrows: !1,
		maintainPosition: !0,
		stickToBottom: !1,
		stickToRight: !1,
		clickOnTrack: !0,
		autoReinitialise: !1,
		autoReinitialiseDelay: 500,
		verticalDragMinHeight: 0,
		verticalDragMaxHeight: 99999,
		horizontalDragMinWidth: 0,
		horizontalDragMaxWidth: 99999,
		contentWidth: q,
		animateScroll: !1,
		animateDuration: 300,
		animateEase: "linear",
		hijackInternalLinks: !1,
		verticalGutter: 4,
		horizontalGutter: 4,
		mouseWheelSpeed: 0,
		arrowButtonSpeed: 0,
		arrowRepeatFreq: 50,
		arrowScrollOnHover: !1,
		trackClickSpeed: 0,
		trackClickRepeatFreq: 70,
		verticalArrowPositions: "split",
		horizontalArrowPositions: "split",
		enableKeyboardNavigation: !0,
		hideFocus: !1,
		keyboardSpeed: 0,
		initialDelay: 300,
		speed: 30,
		scrollPagePercent: 0.8
	}
})(jQuery, this);

var SPR, durationTimer, clickedTrack, utilFrame, hideSpinnerTimeout, playButtonClickedAtLeastOnce = !1,
	trackStartedPlayingAtLeastOnce = !1,
	iHaveSpotifyClickedAtLeastOnce = !1,
	installTutorial, MacOS = "MacOS",
	WindowsOS = "WindowsOS",
	OSName = WindowsOS; - 1 != navigator.appVersion.indexOf("Mac") && (OSName = MacOS);

function initIntructionSlider() {
	var b = MacOS;
	OSName == MacOS && (b = WindowsOS);
	$(".items." + b).remove();
	$("#instructionBrowse").scrollable({
		circular: !0,
		mousewheel: !1
	}).navigator().autoscroll({
		interval: 3E3
	});
	$("#instructionBrowse").scrollable().stop()
}

function hideInstallFlow() {
	setSpotified(!0);
	closeOverlay();
	installTutorial && installTutorial.close()
}

function showNotificationBar(b) {
	$("#notifBar #message")[0].innerHTML = b;
	$("#notifBar").animate({
		top: 0
	}, "fast")
}

function hideNotificationBar() {
	$("#notifBar").animate({
		top: -80
	}, "fast")
}

function triggerWebPlayer() {
	utilFrame.src = "player.php?uri=" + SPR.getCurrentURI()
}

function triggerPlayPause(b, g, q) {
	g && g.preventDefault();
	hideNotificationBar();
	if (q && SPR.getCurrentTrack() && 0 === $("." + SPR.getCurrentTrack().track_resource.uri.split(":")[2]).length) return !1;
	playButtonClickedAtLeastOnce || (playButtonClickedAtLeastOnce = !0, l(1));
	clickedTrack = b;
	hideSpinnerTimeout && (clearTimeout(hideSpinnerTimeout), hideSpinnerTimeout = null);
	setTimeout(function () {
		if (clickedTrack) {
			hideSpinners();
			clickedTrack.attr("class", clickedTrack.attr("class") + " loading");
			setTimeout(function () {
				clickedTrack && clickedTrack.removeClass("loading")
			}, 6E4)
		}
	}, 300);
	SPR.playPauseTrack(b.attr("data-track"), b.attr("rel"), context);
	return !1
}

function changePlayModeForTrack(b) {
	var g = b.track,
		q = b.status;
	clickedTrack = null;
	trackId = getTrackId(g);
	seekerInterval && (clearInterval(seekerInterval), seekerInterval = null);
	durationTimer && (clearInterval(durationTimer), durationTimer = null);
	$(".music-playing").removeClass("music-playing").addClass("music-paused");
	g = $(".track-" + trackId);
	if (0 < g.length && (q && ($(".player").removeClass("music-paused").addClass("music-playing"), updateStatusBar(g)), $(".active").removeClass("active"), g.attr("class", q ? "track-" + trackId + " music-playing active item " + contextType : "track-" + trackId + " music-paused active item " + contextType), g.each(function (b, g) {
		$(g)
	}), q)) {
		$("#engageView").removeClass("music-paused").addClass("music-playing");
		!trackStartedPlayingAtLeastOnce && playButtonClickedAtLeastOnce && (trackStartedPlayingAtLeastOnce = !0, l(2));
		var s = $(".player .meta .progress-bar-container .buffer").width(),
			q = Number(g.attr("data-duration-ms")),
			g = Math.floor(q / s);
		$(".music-playing .seeker").width(Math.floor(s / q * 1E3 * b.playing_position));
		seekerInterval = setInterval(function () {
			var b = $(".music-playing .seeker").width();
			b < s && $(".music-playing .seeker").width(b + 1)
		}, g);
		var p = 1E3 * b.playing_position;
		$(".player .meta .progress-bar-container .time-spent")[0].innerHTML = readableTime(p);
		durationTimer = setInterval(function () {
			p = p + 1E3;
			$(".player .meta .progress-bar-container .time-spent")[0].innerHTML = readableTime(p)
		}, 1E3)
	}
}

function onClientOpening() {
	isSpotified() ? openClient() : setTimeout(function () {
		showOverlay(0)
	}, 500)
}

function onClientConnected() {
	hideInstallFlow()
}

function onClientError(b) {
	showNotificationBar(b.message);
	"4303" == b.type && $(".track-" + b.uri.split(":")[2]).addClass("unavailable")
}

function setupSpotifyRemote() {
	SPR = SpotifyRemote(tokenData);
	SPR.setReferrer(frameReferrer);
	SPR.addPlayModeChangedListener(changePlayModeForTrack);
	SPR.addOnClientOpeningListener(onClientOpening);
	SPR.addOnClientConnectedListener(onClientConnected);
	SPR.addOnClientErrorListener(onClientError)
}

function openContextInSpotify() {
	isSpotified() ? "track" != contextType && SPR.openSpotifyURI(dataContext, 500) : showOverlay(0)
}

function readableTime(b) {
	var g = b / 1E3 / 60,
		b = Math.floor(g),
		g = Math.round(60 * (g - b));
	60 == g && (b++, g = 0);
	return 10 > g ? b + ":0" + g : b + ":" + g
}

function openClient() {
	setTimeout(function () {
		SPR.isClientRunning() || showOverlay(1)
	}, 1E4);
	SPR.openSpotifyURI("spotify:", 1E4)
}

window.attachEvent ? window.attachEvent("onmessage", xdmMsg) : window.addEventListener("message", xdmMsg, !1);

function xdmMsg(b) {
	isSpotified() || setSpotified("yes" == b.data)
}

function getTrackId(b) {
	if (!b) return "";
	if ("ad" != b.track_type) {
		if (0 < $(".track-" + b.track_resource.uri.split(":")[2]).length) return b.track_resource.uri.split(":")[2];
		if (0 < $(".track-" + b.artist_resource.uri.split(":")[2]).length) return b.artist_resource.uri.split(":")[2];
		if (0 < $(".track-" + b.album_resource.uri.split(":")[2]).length) return b.album_resource.uri.split(":")[2]
	}
	return ""
}

function showInstallGuide() {
	var b = "?ref=" + encodeURIComponent(frameReferrer) + "&t=" + testLeg,
		g = (screen.width - 973) / 2,
		q = (screen.height - 400) / 2;
	if (OSName == MacOS || OSName == WindowsOS) installTutorial = window.open("https://" + location.host + "/download/tutorial/" + b, "InstallGuide", "status=0,toolbar=0,location=0,menubar=0,directories=0,resizable=0,scrollbars=0,height=400,width=973,left=" + g + ",top=" + q)
}

function triggerSpotifyDownload() {
	var b = "?ref=" + encodeURIComponent(frameReferrer) + "&t=" + testLeg;
	utilFrame.src = "/download" + b;
	showInstallGuide()
}

function hideSpinners() {
	$(".loading").length && $(".loading").removeClass("loading")
}

$(document).ready(function () {
	initIntructionSlider();
	setupSpotifyRemote();
	renderWidget();
	utilFrame = document.createElement("iframe");
	utilFrame.id = "spotifyUtilFrame";
	$(utilFrame).css("display", "none");
	document.body.appendChild(utilFrame);
	"track" != contextType && $("#mainContainer").jScrollPane()
});

$(".player .album-art-container").click(function (b) {
	triggerPlayPause($(".track-" + $(this).parent().attr("rel")), b)
});

$(".item").click(function (b) {
	triggerPlayPause($(this), b)
});

$("#engageView .middle").click(function (b) {
	triggerPlayPause($(".track-" + $(this).parent().parent().parent().attr("rel")), b)
});

$(".ihavespotify").click(function (b) {
	b.preventDefault();
	hideInstallFlow();
	openClient();
	iHaveSpotifyClickedAtLeastOnce || (iHaveSpotifyClickedAtLeastOnce = !0, l(7));
	return !1
});

$(".download-spotify").click(function (b) {
	b.preventDefault();
	triggerSpotifyDownload();
	return !1
});

$("#notifBar .notifCloseButton").click(function () {
	hideNotificationBar()
});

$("#widgetContainer").hover(function () {
	$(".player .meta .titles").animate({
		width: $(".player").width() - PLAYER_HEIGHT - 8 - $(".right-bar-buttons").width() - 8
	}, 100)
}, function () {
	$(".player .meta .titles").animate({
		width: $(".player").width() - PLAYER_HEIGHT - 8 - 8 - 19
	}, 100)
});

$(".player, .status-header, #mainContainer, #engageView, .overlay-item-2").mousedown(function (b) {
	b.preventDefault()
});

$(".overlay-close-button").click(function () {
	hideSpinners();
	closeOverlay()
});