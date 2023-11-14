/*
 * File: RotorDemo.js
 * ------------------
 * This file creates a web-based demo that shows a side-view rotor and
 * its unrolled equivalent on the same slide.
 */

"use strict";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PERMUTATION = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
const BG_COLOR = "#272822";
const FG_COLOR = "#A6E22E";
const CONTACT_COLOR = "#888888";
const WHEEL_LABEL_FONT = "36px 'Helvetica Neue','Sans-Serif'";
const STRIP_LABEL_FONT = "24px 'Helvetica Neue','Sans-Serif'";

const SF = 1.35;
const GWINDOW_WIDTH = 1100 * SF;
const GWINDOW_HEIGHT = 600 * SF;
const WHEEL_X = 330 * SF;
const WHEEL_Y = 300 * SF;
const WHEEL_WIDTH = 888 * SF;
const WHEEL_HEIGHT = 896 * SF;
const WHEEL_LABEL_DELTA = 19 * SF;
const WHEEL_SF = 0.55;
const STRIP_X = 800 * SF;
const STRIP_Y = 40 * SF;
const STRIP_WIDTH = 80 * SF;
const STRIP_LEFT_DX = -3 * SF;
const STRIP_RIGHT_DX = 3 * SF;
const CONTACT_WIDTH = 7 * SF;
const CONTACT_HEIGHT = 10 * SF;
const CONTACT_MARGIN = 6 * SF;
const CONTACT_SEP = CONTACT_HEIGHT;
const INACTIVE_LINEWIDTH = 1 * SF;
const ACTIVE_LINEWIDTH = 2.5 * SF;
const TIME_STEP = 40;
const TIME_DIVISIONS = 16;

const COLORS = [ "red", "blue" ];
const N_COLORS = COLORS.length;

function RotorDemo() {
    let title = "RotorDemo";
    let element = document.getElementById(title);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    let gw = GWindow(title, GWINDOW_WIDTH, GWINDOW_HEIGHT);
    gw.setAutoRepaintFlag(false);
    let bg = GRect(GWINDOW_WIDTH, GWINDOW_HEIGHT);
    bg.setFilled(true);
    bg.setColor(BG_COLOR);
    let canvas = document.getElementById(title).firstChild;
    canvas.style.border = "none";
    let slide = canvas;
    while (slide !== null && slide.className !== "Slide") {
        slide = slide.parentNode;
    }
    initButton("Reset", resetAction);
    initButton("StepIn", stepAction);
    let x0 = STRIP_X;
    let y0 = STRIP_Y + CONTACT_MARGIN;
    let steps = 0;
    let timer = null;
    let wheel = null;
    let offset = 0;
    let leftContacts = null;
    let rightContacts = null;
    let wires = null;
    reset();

    function reset() {
        gw.clear();
        gw.add(bg);
        initWheel();
        initStrip();
        gw.repaint();
    }

    function initWheel() {
        wheel = GCompound();
        let image = GImage("images/js_pieces/RotorCircularView.png");
        image.scale(WHEEL_SF * SF);
        wheel.add(image, -WHEEL_SF * WHEEL_WIDTH / 2,
                         -WHEEL_SF * WHEEL_HEIGHT / 2);
        gw.add(wheel, WHEEL_X, WHEEL_Y);
        let r = WHEEL_SF * WHEEL_HEIGHT / 2 + WHEEL_LABEL_DELTA;
        for (let i = 0; i < 26; i++) {
            let frame = GCompound();
            let label = GLabel("" + i);
            label.setFont(WHEEL_LABEL_FONT);
            label.setColor(FG_COLOR)
            frame.add(label, -label.getWidth() / 2, label.getAscent() / 2 - 1);
            let theta = GMath.toRadians(90 + i * 360 / 26);
            gw.add(frame, WHEEL_X + r * Math.cos(theta),
                          WHEEL_Y - r * Math.sin(theta));
        }
    }

    function initStrip() {
        let height = 26 * CONTACT_HEIGHT + 25 * CONTACT_SEP +
                     2 * CONTACT_MARGIN;
        let strip = GRect(x0, STRIP_Y, STRIP_WIDTH, height);
        strip.setFilled(true);
        strip.setFillColor("White");
        gw.add(strip);
        leftContacts = [ ];
        rightContacts = [ ];
        wires = [ ];
        offset = 0;
        for (let i = 0; i < 26; i++) {
            let color = (i < N_COLORS) ? COLORS[i] : CONTACT_COLOR;
            let target = PERMUTATION.charCodeAt(i) - "A".charCodeAt(0);
            let ysrc = y0 + i * (CONTACT_HEIGHT + CONTACT_SEP);
            let ydst = y0 + target * (CONTACT_HEIGHT + CONTACT_SEP);
            gw.add(createContact(x0 - CONTACT_WIDTH, ydst, CONTACT_COLOR));
            gw.add(createContact(x0 + STRIP_WIDTH, ysrc, CONTACT_COLOR));
            let c1 = createContact(x0, ydst, color);
            let c2 = createContact(x0 + STRIP_WIDTH - CONTACT_WIDTH, ysrc,
                                   color);
            gw.add(c1);
            gw.add(c2);
            leftContacts[target] = c1;
            rightContacts[i] = c2;
            let x1 = x0 + STRIP_WIDTH - CONTACT_WIDTH;
            let y1 = ysrc + CONTACT_HEIGHT / 2;
            let x2 = x0 + CONTACT_WIDTH;
            let y2 = ydst + CONTACT_HEIGHT / 2;
            let wire = GLine(x1, y1, x2, y2);
            wire.setColor(color);
            if (i < N_COLORS) {
                wire.setLineWidth(ACTIVE_LINEWIDTH);
            } else {
                wire.setLineWidth(INACTIVE_LINEWIDTH);
            }
            wires[i] = wire;
            gw.add(wire);
            let label = GLabel("" + i);
            label.setFont(STRIP_LABEL_FONT);
            label.setColor(FG_COLOR)
            let lx = x0 - CONTACT_WIDTH + STRIP_LEFT_DX - label.getWidth();
            let ly = ysrc + CONTACT_HEIGHT / 2 + label.getAscent() / 2 - 1;
            gw.add(label, lx, ly);
            label = GLabel("" + i);
            label.setFont(STRIP_LABEL_FONT);
            label.setColor(FG_COLOR)
            lx = x0 + STRIP_WIDTH + CONTACT_WIDTH + STRIP_RIGHT_DX;
            gw.add(label, lx, ly);
        }
        let frame = GRect(x0, STRIP_Y, STRIP_WIDTH, height);
        gw.add(frame);            
    }

    function createContact(x, y, color) {
        let contact = GRect(x, y, CONTACT_WIDTH, CONTACT_HEIGHT);
        contact.setFilled(true);
        contact.setColor(color);
        return contact;
    }

    function initButton(name, action) {
        let button = document.getElementById(title + name + "Button");
        button.addEventListener("mouseenter", mouseenterAction);
        button.addEventListener("mouseleave", mouseleaveAction);
        button.addEventListener("mousedown", mousedownAction);
        button.addEventListener("mouseup", mouseupAction);
        button.addEventListener("click", action);

        function mouseenterAction(e) {
            button.src = "images/js_pieces/" + name + "Rollover.png";
            e.stopPropagation();
        }

        function mouseleaveAction(e) {
            button.src = "images/js_pieces/" + name + "Control.png";
            e.stopPropagation();
        }

        function mousedownAction(e) {
            button.src = "images/js_pieces/" + name + "Pressed.png";
            e.stopPropagation();
        }

        function mouseupAction(e) {
            button.src = "images/js_pieces/" + name + "Rollover.png";
            e.stopPropagation();
        }

    }

    function resetAction(e) {
        reset();
        e.stopPropagation();
    }

    function stepAction(e) {
        steps = TIME_DIVISIONS;
        timer = setInterval(step, TIME_STEP);
        e.stopPropagation();
    }

    function step() {
        if (steps <= 0) {
            clearInterval(timer);
        } else {
            steps--;
            stepWheel();
            stepStrip();
            gw.repaint();
        }
    }

    function stepWheel() {
        wheel.rotate(-360 / (26 * TIME_DIVISIONS));
    }

/*
 * Implementation notes: stepStrip
 * -------------------------------
 * My first approach to implementing this function failed because I
 * tried to move the line step by step.  This strategy accumulated
 * roundoff errors that quickly became problematic.  The new model
 * keeps an offset and uses setLocation to reposition the contacts
 * and line endpoints to the correct values.
 */

    function stepStrip() {
        let flip = Math.floor(TIME_DIVISIONS / 2);
        let dy = (CONTACT_HEIGHT + CONTACT_SEP) / TIME_DIVISIONS;
        let wdy = CONTACT_HEIGHT / 2;
        if (steps === flip) {
            offset = (offset + 1) % 26;
        }
        for (let i = 0; i < 26; i++) {
            let target = PERMUTATION.charCodeAt(i) - "A".charCodeAt(0);
            rightContacts[i].setLocation(rightContacts[i].getX(),
                                         getYForIndex(i));
            leftContacts[target].setLocation(leftContacts[target].getX(),
                                             getYForIndex(target));
            wires[i].setLocation(x0 + STRIP_WIDTH - CONTACT_WIDTH,
                                 getYForIndex(i) + wdy);
            wires[i].setEndPoint(x0 + CONTACT_WIDTH,
                                 getYForIndex(target) + wdy);
        }

        function getYForIndex(index) {
            index = (index + 26 - offset) % 26;
            let y = y0 + index * (CONTACT_HEIGHT + CONTACT_SEP);
            y -= (TIME_DIVISIONS - steps) * dy;
            if (steps <= flip) y += (CONTACT_HEIGHT + CONTACT_SEP);
            return y;
        }
    }

}
