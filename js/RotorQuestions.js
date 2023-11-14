/*
 * File: RotorQuestions.js
 * -----------------------
 * This file creates a web-based demo that shows a side-view rotor and
 * its unrolled equivalent on the same slide.
 */

"use strict";


function RotorQuestions() {
    if (!RotorQuestions.initialized) {
        RotorQuestions.initialized = true;
        CodeTrace.registerFragmentEvent("RotorQuestion1", rotorQuestion1);
        CodeTrace.registerFragmentEvent("RotorQuestion2", rotorQuestion2);
        CodeTrace.registerFragmentEvent("RotorQuestion3", rotorQuestion3);
    }
    let title = "RotorQuestions";
    let element = document.getElementById(title);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
    let gw = GWindow(title, RotorQuestions.GWINDOW_WIDTH, RotorQuestions.GWINDOW_HEIGHT);
    gw.setAutoRepaintFlag(false);
    let bg = GRect(RotorQuestions.GWINDOW_WIDTH, RotorQuestions.GWINDOW_HEIGHT);
    bg.setFilled(true);
    bg.setColor(RotorQuestions.BG_COLOR);
    let canvas = document.getElementById(title).firstChild;
    canvas.style.border = "none";
    let slide = canvas;
    while (slide !== null && slide.className !== "Slide") {
        slide = slide.parentNode;
    }
    let x0 = RotorQuestions.STRIP_X;
    let y0 = RotorQuestions.STRIP_Y + RotorQuestions.CONTACT_MARGIN;
    let steps = 0;
    let timer = null;
    let offset = 0;
    let highlight = -1;
    let leftTerminals = null;
    let rightTerminals = null;
    let leftContacts = null;
    let rightContacts = null;
    let wires = null;
    let offset_label = null;
    reset();

    function reset() {
        gw.clear();
        gw.add(bg);
        initStrip();
        gw.repaint();
    }

    function initStrip() {
        let height = 26 * RotorQuestions.CONTACT_HEIGHT + 25 * RotorQuestions.CONTACT_SEP +
                     2 * RotorQuestions.CONTACT_MARGIN;
        let strip = GRect(x0, RotorQuestions.STRIP_Y, RotorQuestions.STRIP_WIDTH, height);
        strip.setFilled(true);
        strip.setFillColor("White");
        gw.add(strip);
        leftTerminals = [ ];
        rightTerminals = [ ];
        leftContacts = [ ];
        rightContacts = [ ];
        wires = [ ];
        offset = 0;
        for (let i = 0; i < 26; i++) {
            let color = RotorQuestions.CONTACT_COLOR;
            let target = RotorQuestions.PERMUTATION.charCodeAt(i) - "A".charCodeAt(0);
            let ysrc = y0 + i * (RotorQuestions.CONTACT_HEIGHT + RotorQuestions.CONTACT_SEP);
            let ydst = y0 + target * (RotorQuestions.CONTACT_HEIGHT + RotorQuestions.CONTACT_SEP);
            let c1 = createContact(x0 - RotorQuestions.CONTACT_WIDTH, ydst, color);
            let c2 = createContact(x0 + RotorQuestions.STRIP_WIDTH, ysrc, color);
            gw.add(c1);
            gw.add(c2);
            leftTerminals[target] = c1;
            rightTerminals[i] = c2;
            c1 = createContact(x0, ydst, color);
            c2 = createContact(x0 + RotorQuestions.STRIP_WIDTH - RotorQuestions.CONTACT_WIDTH, ysrc,
                                   color);
            gw.add(c1);
            gw.add(c2);
            leftContacts[target] = c1;
            rightContacts[i] = c2;
            let x1 = x0 + RotorQuestions.STRIP_WIDTH - RotorQuestions.CONTACT_WIDTH;
            let y1 = ysrc + RotorQuestions.CONTACT_HEIGHT / 2;
            let x2 = x0 + RotorQuestions.CONTACT_WIDTH;
            let y2 = ydst + RotorQuestions.CONTACT_HEIGHT / 2;
            let wire = GLine(x1, y1, x2, y2);
            wire.setColor(color);
            wire.setLineWidth(RotorQuestions.INACTIVE_LINEWIDTH);
            wires[i] = wire;
            gw.add(wire);
            let label = GLabel("" + i);
            label.setFont(RotorQuestions.STRIP_LABEL_FONT);
            label.setColor(RotorQuestions.FG_COLOR);
            let lx = x0 - RotorQuestions.CONTACT_WIDTH + RotorQuestions.STRIP_LEFT_DX - label.getWidth();
            let ly = ysrc + RotorQuestions.CONTACT_HEIGHT / 2 + label.getAscent() / 2 - 1;
            gw.add(label, lx, ly);
            label = GLabel("" + i);
            label.setFont(RotorQuestions.STRIP_LABEL_FONT);
            label.setColor(RotorQuestions.FG_COLOR);
            lx = x0 + RotorQuestions.STRIP_WIDTH + RotorQuestions.CONTACT_WIDTH + RotorQuestions.STRIP_RIGHT_DX;
            gw.add(label, lx, ly);
        }
        let frame = GRect(x0, RotorQuestions.STRIP_Y, RotorQuestions.STRIP_WIDTH, height);
        //gw.add(frame);

        offset_label = GLabel("Offset: " + offset);
        offset_label.setFont(RotorQuestions.STRIP_LABEL_FONT);
        offset_label.setColor("white");
        let lx = x0 + RotorQuestions.STRIP_WIDTH / 2 - offset_label.getWidth() / 2;
        let ly = RotorQuestions.STRIP_Y - RotorQuestions.CONTACT_MARGIN
        gw.add(offset_label, lx, ly);
    }

    function createContact(x, y, color) {
        let contact = GRect(x, y, RotorQuestions.CONTACT_WIDTH, RotorQuestions.CONTACT_HEIGHT);
        contact.setFilled(true);
        contact.setColor(color);
        return contact;
    }

    function rotorQuestion1() {
        highlightContact(1, true);
        gw.repaint();
    }

    function rotorQuestion2() {
        highlightContact(1, false);
        steps = RotorQuestions.TIME_DIVISIONS;
        highlight = 9;
        timer = setInterval(step, RotorQuestions.TIME_STEP);
        gw.repaint();
    }

    function rotorQuestion3() {
        highlightContact(9, false);
        steps = 3 * RotorQuestions.TIME_DIVISIONS;
        highlight = 2;
        timer = setInterval(step, RotorQuestions.TIME_STEP);
        gw.repaint();
    }
        
    function resetAction(e) {
        reset();
        e.stopPropagation();
    }

    function stepAction(e) {
        steps = RotorQuestions.TIME_DIVISIONS;
        timer = setInterval(step, RotorQuestions.TIME_STEP);
        e.stopPropagation();
    }

    function step() {
        if (steps <= 0) {
            if (highlight >= 0) {
                highlightContact(highlight, true);
                gw.repaint();
            }
            clearInterval(timer);
        } else {
            steps--;
            stepStrip();
            gw.repaint();
        }
    }

/*
 * Sets the highlight of the wire starting at rightIndex to state.
 */

    function highlightContact(rightIndex, state) {
        let rx = rightIndex + offset 
        let lx = RotorQuestions.PERMUTATION.charCodeAt(rx) - "A".charCodeAt(0);
        let color = (state) ? "Red" : RotorQuestions.CONTACT_COLOR;
        let lineWidth = (state) ? RotorQuestions.ACTIVE_LINEWIDTH : RotorQuestions.INACTIVE_LINEWIDTH;
        rightTerminals[rightIndex].setColor(color)
        leftTerminals[(lx + 26 - offset) % 26].setColor(color);
        rightContacts[rx].setColor(color)
        leftContacts[lx].setColor(color);
        wires[rx].setColor(color);
        wires[rx].setLineWidth(lineWidth);
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
        let flip = Math.floor(RotorQuestions.TIME_DIVISIONS / 2);
        let dy = (RotorQuestions.CONTACT_HEIGHT + RotorQuestions.CONTACT_SEP) / RotorQuestions.TIME_DIVISIONS;
        let wdy = RotorQuestions.CONTACT_HEIGHT / 2;
        if (steps % RotorQuestions.TIME_DIVISIONS === flip) {
            offset = (offset + 1) % 26;
        }
        for (let i = 0; i < 26; i++) {
            let target = RotorQuestions.PERMUTATION.charCodeAt(i) - "A".charCodeAt(0);
            rightContacts[i].setLocation(rightContacts[i].getX(),
                                         getYForIndex(i));
            leftContacts[target].setLocation(leftContacts[target].getX(),
                                             getYForIndex(target));
            wires[i].setLocation(x0 + RotorQuestions.STRIP_WIDTH - RotorQuestions.CONTACT_WIDTH,
                                 getYForIndex(i) + wdy);
            wires[i].setEndPoint(x0 + RotorQuestions.CONTACT_WIDTH,
                                 getYForIndex(target) + wdy);
        }
        offset_label.setLabel("Offset: " + offset);

        function getYForIndex(index) {
            index = (index + 26 - offset) % 26;
            let y = y0 + index * (RotorQuestions.CONTACT_HEIGHT + RotorQuestions.CONTACT_SEP);
            y -= (RotorQuestions.TIME_DIVISIONS - steps) * dy;
            if (steps <= flip) y += (RotorQuestions.CONTACT_HEIGHT + RotorQuestions.CONTACT_SEP);
            return y;
        }
    }

}

RotorQuestions.ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
RotorQuestions.PERMUTATION = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
RotorQuestions.BG_COLOR = "#272822";
RotorQuestions.FG_COLOR = "#A6E22E";
RotorQuestions.CONTACT_COLOR = "#888888";
RotorQuestions.WHEEL_LABEL_FONT = "36px 'Helvetica Neue','Sans-Serif'";
RotorQuestions.STRIP_LABEL_FONT = "24px 'Helvetica Neue','Sans-Serif'";

RotorQuestions.SF = 1.45;
RotorQuestions.GWINDOW_WIDTH = 180 * RotorQuestions.SF;
RotorQuestions.GWINDOW_HEIGHT = 600 * RotorQuestions.SF;
RotorQuestions.STRIP_X = 50 * RotorQuestions.SF;
RotorQuestions.STRIP_Y = 40 * RotorQuestions.SF;
RotorQuestions.STRIP_WIDTH = 80 * RotorQuestions.SF;
RotorQuestions.STRIP_LEFT_DX = -3 * RotorQuestions.SF;
RotorQuestions.STRIP_RIGHT_DX = 3 * RotorQuestions.SF;
RotorQuestions.CONTACT_WIDTH = 7 * RotorQuestions.SF;
RotorQuestions.CONTACT_HEIGHT = 10 * RotorQuestions.SF;
RotorQuestions.CONTACT_MARGIN = 6 * RotorQuestions.SF;
RotorQuestions.CONTACT_SEP = RotorQuestions.CONTACT_HEIGHT;
RotorQuestions.INACTIVE_LINEWIDTH = 1 * RotorQuestions.SF;
RotorQuestions.ACTIVE_LINEWIDTH = 2.5 * RotorQuestions.SF;
RotorQuestions.TIME_STEP = 40;
RotorQuestions.TIME_DIVISIONS = 16;
RotorQuestions.initialized = false;
