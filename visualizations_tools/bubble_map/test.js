! function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? e(exports, require("d3-array"), require("d3-axis"), require("d3-dispatch"), require("d3-drag"), require("d3-ease"), require("d3-scale"), require("d3-selection"), require("d3-transition")) : "function" == typeof define && define.amd ? define(["exports", "d3-array", "d3-axis", "d3-dispatch", "d3-drag", "d3-ease", "d3-scale", "d3-selection", "d3-transition"], e) : e((t = t || self).d3 = t.d3 || {}, t.d3, t.d3, t.d3, t.d3, t.d3, t.d3, t.d3)
}(this, function(t, e, r, n, a, l, i, s) {
    "use strict";
    var c = 200,
        u = 8,
        o = 1,
        d = 2,
        f = 3,
        m = 4;

    function g(t) {
        return "translate(" + t + ",0)"
    }

    function p(t) {
        return "translate(0," + t + ")"
    }

    function h(t, h) {
        h = void 0 !== h ? h : null;
        var v = [0],
            k = [0],
            x = [0, 10],
            y = 100,
            A = 100,
            b = !0,
            w = "M-5.5,-5.5v10l6,5.5l6,-5.5v-10z",
            q = null,
            M = null,
            z = null,
            F = null,
            L = null,
            V = null,
            D = null,
            O = n.dispatch("onchange", "start", "end", "drag"),
            T = null,
            j = null,
            B = null,
            Q = t === o || t === m ? -1 : 1,
            R = t === m || t === d ? "y" : "x",
            _ = t === m || t === d ? "x" : "y",
            H = t === o || t === f ? g : p,
            P = t === o || t === f ? p : g,
            C = null;
        switch (t) {
            case o:
                C = r.axisTop;
                break;
            case d:
                C = r.axisRight;
                break;
            case f:
                C = r.axisBottom;
                break;
            case m:
                C = r.axisLeft
        }
        var E = null,
            G = null;

        function I(r) {
            T = r.selection ? r.selection() : r, h = h ? h.range([e.min(h.range()), e.min(h.range()) + (t === o || t === f ? y : A)]) : (h = x[0] instanceof Date ? i.scaleTime() : i.scale.linear()).domain(x).range([0, t === o || t === f ? y : A]).clamp(!0), j = i.scale.linear().range(h.range()).domain(h.range()).clamp(!0), v = v.map(function(t) {
                return i.scale.linear().range(x).domain(x).clamp(!0)(t)
            }), F = F || h.tickFormat(), V = V || F || h.tickFormat(), T.selectAll(".axis").data([null]).enter().append("g").attr("transform", P(7 * Q)).attr("class", "axis");
            var n = T.selectAll(".slider").data([null]),
                l = n.enter().append("g").attr("class", "slider").attr("cursor", t === o || t === f ? "ew-resize" : "ns-resize").call(a.drag().on("start", function() {
                    s.select(this).classed("active", !0);
                    var r = j(t === f || t === o ? s.event.x : s.event.y);
                    B = e.scan(v.map(function(t) {
                        return Math.abs(t - K(h.invert(r)))
                    }));
                    var a = v.map(function(t, e) {
                        return e === B ? K(h.invert(r)) : t
                    });
                    S(a), O.call("start", n, 1 === a.length ? a[0] : a), N(a, !0)
                }).on("drag", function() {
                    var e = j(t === f || t === o ? s.event.x : s.event.y),
                        r = K(h.invert(e)),
                        a = v.map(function(t, e) {
                            return 2 === v.length ? e === B ? 0 === B ? Math.min(r, K(v[1])) : Math.max(r, K(v[0])) : t : e === B ? r : t
                        });
                    S(a), O.call("drag", n, 1 === a.length ? a[0] : a), N(a, !0)
                }).on("end", function() {
                    s.select(this).classed("active", !1);
                    var e = j(t === f || t === o ? s.event.x : s.event.y),
                        r = v.map(function(t, r) {
                            return r === B ? K(h.invert(e)) : t
                        });
                    S(r), O.call("end", n, 1 === r.length ? r[0] : r), N(r, !0), B = null
                }));
            l.append("line").attr("class", "track").attr(R + "1", h.range()[0] - u).attr("stroke", "#bbb").attr("stroke-width", 6).attr("stroke-linecap", "round"), l.append("line").attr("class", "track-inset").attr(R + "1", h.range()[0] - u).attr("stroke", "#eee").attr("stroke-width", 4).attr("stroke-linecap", "round"), D && l.append("line").attr("class", "track-fill").attr(R + "1", 1 === v.length ? h.range()[0] - u : h(v[0])).attr("stroke", D).attr("stroke-width", 4).attr("stroke-linecap", "round"), l.append("line").attr("class", "track-overlay").attr(R + "1", h.range()[0] - u).attr("stroke", "transparent").attr("stroke-width", 40).attr("stroke-linecap", "round").merge(n.select(".track-overlay"));
            var c = l.selectAll(".parameter-value").data(v).enter().append("g").attr("class", "parameter-value").attr("transform", function(t) {
                return H(h(t))
            }).attr("font-family", "sans-serif").attr("text-anchor", t === d ? "start" : t === m ? "end" : "middle");
            c.append("path").attr("transform", "rotate(" + 90 * (t + 1) + ")").attr("d", w).attr("fill", "white").attr("stroke", "#777"), b && 1 === v.length && c.append("text").attr("font-size", 10).attr(_, 27 * Q).attr("dy", t === o ? "0em" : t === f ? ".71em" : ".32em").text(F(v[0])), r.select(".track").attr(R + "2", h.range()[1] + u), r.select(".track-inset").attr(R + "2", h.range()[1] + u), D && r.select(".track-fill").attr(R + "2", 1 === v.length ? h(v[0]) : h(v[1])), r.select(".track-overlay").attr(R + "2", h.range()[1] + u), r.select(".axis").call(C(h).tickFormat(F).ticks(L).tickValues(M)), T.select(".axis").select(".domain").remove(), r.select(".axis").attr("transform", P(7 * Q)), r.selectAll(".axis text").attr("fill", "#aaa").attr(_, 20 * Q).attr("dy", t === o ? "0em" : t === f ? ".71em" : ".32em").attr("text-anchor", t === d ? "start" : t === m ? "end" : "middle"), r.selectAll(".axis line").attr("stroke", "#aaa"), r.selectAll(".parameter-value").attr("transform", function(t) {
                return H(h(t))
            }), J(), G = T.select(".parameter-value text"), E = T.select(".track-fill")
        }

        function J() {
            if (T && b && 1 === v.length) {
                var t = [];
                T.selectAll(".axis .tick").each(function(e) {
                    t.push(Math.abs(e - v[0]))
                });
                var r = e.scan(t);
                T.selectAll(".axis .tick text").attr("opacity", function(t, e) {
                    return e === r ? 0 : 1
                })
            }
        }

        function K(t) {
            if (q) {
                var r = (t - x[0]) % q,
                    n = t - r;
                return 2 * r > q && (n += q), t instanceof Date ? new Date(n) : n
            }
            if (z) {
                var a = e.scan(z.map(function(e) {
                    return Math.abs(t - e)
                }));
                return z[a]
            }
            return t
        }

        function N(t, e) {
            (v[0] !== t[0] || v.length > 1 && v[1] !== t[1]) && (v = t, e && O.call("onchange", I, 1 === t.length ? t[0] : t), J())
        }

        function S(t, e) {
            T && ((e = void 0 !== e && e) ? (T.selectAll(".parameter-value").data(t).transition().ease(l.easeQuadOut).duration(c).attr("transform", function(t) {
                return H(h(t))
            }), D && E.transition().ease(l.easeQuadOut).duration(c).attr(R + "1", 1 === v.length ? h.range()[0] - u : h(t[0])).attr(R + "2", 1 === v.length ? h(t[0]) : h(t[1]))) : (T.selectAll(".parameter-value").data(t).attr("transform", function(t) {
                return H(h(t))
            }), D && E.attr(R + "1", 1 === v.length ? h.range()[0] - u : h(t[0])).attr(R + "2", 1 === v.length ? h(t[0]) : h(t[1]))), b && G.text(V(t[0])))
        }
        return h && (x = [e.min(h.domain()), e.max(h.domain())], t === o || t === f ? y = e.max(h.range()) - e.min(h.range()) : A = e.max(h.range()) - e.min(h.range()), h = h.clamp(!0)), I.min = function(t) {
            return arguments.length ? (x[0] = t, I) : x[0]
        }, I.max = function(t) {
            return arguments.length ? (x[1] = t, I) : x[1]
        }, I.domain = function(t) {
            return arguments.length ? (x = t, I) : x
        }, I.width = function(t) {
            return arguments.length ? (y = t, I) : y
        }, I.height = function(t) {
            return arguments.length ? (A = t, I) : A
        }, I.tickFormat = function(t) {
            return arguments.length ? (F = t, I) : F
        }, I.displayFormat = function(t) {
            return arguments.length ? (V = t, I) : V
        }, I.ticks = function(t) {
            return arguments.length ? (L = t, I) : L
        }, I.value = function(t) {
            if (!arguments.length) return 1 === v.length ? v[0] : v;
            var e = Array.isArray(t) ? t : [t];
            e.sort((t, e) => t - e);
            var r = e.map(h).map(j).map(h.invert).map(K);
            return S(r, !0), N(r, !0), I
        }, I.silentValue = function(t) {
            if (!arguments.length) return 1 === v.length ? v[0] : v;
            var e = Array.isArray(t) ? t : [t];
            e.sort((t, e) => t - e);
            var r = e.map(h).map(j).map(h.invert).map(K);
            return S(r, !1), N(r, !1), I
        }, I.default = function(t) {
            if (!arguments.length) return 1 === k.length ? k[0] : k;
            var e = Array.isArray(t) ? t : [t];
            return e.sort((t, e) => t - e), k = e, v = e, I
        }, I.step = function(t) {
            return arguments.length ? (q = t, I) : q
        }, I.tickValues = function(t) {
            return arguments.length ? (M = t, I) : M
        }, I.marks = function(t) {
            return arguments.length ? (z = t, I) : z
        }, I.handle = function(t) {
            return arguments.length ? (w = t, I) : w
        }, I.displayValue = function(t) {
            return arguments.length ? (b = t, I) : b
        }, I.fill = function(t) {
            return arguments.length ? (D = t, I) : D
        }, I.on = function() {
            var t = O.on.apply(O, arguments);
            return t === O ? I : t
        }, I
    }
    t.sliderHorizontal = function(t) {
        return h(f, t)
    }, t.sliderVertical = function(t) {
        return h(m, t)
    }, t.sliderTop = function(t) {
        return h(o, t)
    }, t.sliderRight = function(t) {
        return h(d, t)
    }, t.sliderBottom = function(t) {
        return h(f, t)
    }, t.sliderLeft = function(t) {
        return h(m, t)
    }, Object.defineProperty(t, "__esModule", {
        value: !0
    })
});