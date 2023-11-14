---
title: "Section 11: The Enigma Project"
author: Jed Rembold and Eric Roberts
date: "Week of November 13th"
slideNumber: true
theme: monokai
highlightjs-theme: monokai
width: 1920
height: 1080
transition: fade
css:
  - css/codetrace.css
  - css/roberts.css
js:
  - RotorDemo
---


## Problem 1
- In our experience, one of the most difficult parts of the Enigma assignment is understanding how the rotors implement the translation
  - Difficult because of translating the 3D rotors into 2D diagrams
  - Difficult because the rotors turn
- The next slide animates the process of advancing the rotor in both the circular view of the rotor (from the side) and the unrolled view of the rotor as a strip.
  - As the rotor advances, you will see connections in the unrolled view vanish off the top and reappear at the bottom



## Visualizing Enigma's Rotors {data-state="RotorDemo"}
<div id="RotorDemo">
<canvas contenteditable="true" width="1485" height="810" style="border: none; overflow: hidden; outline-width: 0px; width: 1485px; height: 810px;"></canvas>
</div>
<td style="text-align:center;">
    <table class="CTControlStrip">
        <tbody style="border:none;">
            <tr>
                <td>
                    <img id="RotorDemoStepInButton" class="CTButton" src="images/js_pieces/StepInControl.png" alt="StepInButton" width="70px">
                </td>
                <td>
                    <img id="RotorDemoResetButton" class="CTButton" src="images/js_pieces/ResetControl.png" alt="ResetButton" width="70px">
                </td>
            </tr>
        </tbody>
    </table>
</td>

