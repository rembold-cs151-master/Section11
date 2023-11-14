/*
 * File: InvertKeyTrace.js
 * -----------------------
 * This file traces the InvertKey problem from the Enigma section.
 */

"use strict";

function InvertKeyDemo() {
    new InvertKeyTrace();
}

class InvertKeyTrace extends CodeTrace {

    constructor() {
        super("InvertKeyTrace");
        this.reset();
    }

    setParameters() {
        this.setMaxStackDepth(1);
        this.setFrameHeight(InvertKeyTrace.FRAME_HEIGHT);
        this.setFrameDeltas(InvertKeyTrace.FRAME_DX,
                            InvertKeyTrace.FRAME_DY);
        this.keepLastFrame(true);
    }

    defineFunctions() {
        this.defineFunction("invert_key", new InvertKey());
    }

    reset() {
        let stdout = document.getElementById("InvertKeyConsole");
        stdout.innerHTML = ("<span class='prompt'>&gt;&gt;&gt;</span> " +
                            "invert<span class='u'>_</span>" +
                            "key(<span class='strlit'>" +
                            "\"QWERTYUIOPASDFGHJKLZXCVBNM\"</span>)<br />");
        super.reset();
    }

    run() {
        this.call("invert_key", "QWERTYUIOPASDFGHJKLZXCVBNM");
    }

}

InvertKeyTrace.ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
InvertKeyTrace.FRAME_HEIGHT = 470;
InvertKeyTrace.FRAME_DX = 16;
InvertKeyTrace.FRAME_DY = 62;
InvertKeyTrace.INT_WIDTH = 140;
InvertKeyTrace.CHAR_WIDTH = 140;
InvertKeyTrace.STR_WIDTH = 620;
InvertKeyTrace.VAR_HEIGHT = 50;

class InvertKey extends CTFunction {

    constructor() {
        super(InvertKey.HTML);
    }

    createFrame(ct) {
        let cf = new CTStackFrame(ct, this);
        cf.addVariable("newkey", InvertKeyTrace.STR_WIDTH,
                                 InvertKeyTrace.VAR_HEIGHT);
        cf.getVariable("newkey").setQuoteFlag(true);
        cf.addVariable("key", InvertKeyTrace.STR_WIDTH,
                              InvertKeyTrace.VAR_HEIGHT);
        cf.getVariable("key").setQuoteFlag(true);
        cf.addVariable("ch", InvertKeyTrace.CHAR_WIDTH,
                             InvertKeyTrace.VAR_HEIGHT);
        cf.getVariable("ch").setQuoteFlag(true);
        cf.layoutVariables();
        cf.set("key", ct.pop());
        return cf;
    }

    async run(ct) {
        let cf = ct.getCurrentFrame();
        let key = cf.get("key");
        let newkey = "";
        let ch = "";
        await ct.traceStep("#1", () => cf.set("newkey", newkey=""));
        await ct.traceStep("#2", () => undefined);
        let i = -1;
        let n = InvertKeyTrace.ALPHABET.length;
        while (await ct.traceStep("#2a",
                   function() {
                       if (++i >= n) {
                           return false;
                       } else {
                           cf.set("ch", ch = InvertKeyTrace.ALPHABET[i]);
                           return true;
                       }
                   })) {
            await ct.traceStep("#3", () => undefined);
            await ct.traceStep("#3a", () => undefined);
            let indx = await ct.traceAndTag("#3b", () => key.indexOf(ch));
            let nch = await ct.traceAndTag("#3a", () => InvertKeyTrace.ALPHABET[indx]);
            await ct.traceStep("#3", () => {cf.removeValueTag("#3b"); cf.removeValueTag("#3a"); cf.set("newkey", newkey += nch)});
            //await ct.traceStep("#3",
                //function() {
                    //let nch = ct.traceAndTag("#3a", () => InvertKeyTrace.ALPHABET[key.indexOf(ch)]);
                    //cf.set("newkey", newkey += nch);
                //});
        }
        return await ct.traceStep("#4", () => print("'" + newkey + "'"));
    
        function print(s) {
            let stdout = document.getElementById("InvertKeyConsole");
            stdout.innerHTML += "<span class='output'>" + s + "</span><br />";
            stdout.scrollTop = stdout.scrollHeight;
        }

    }

}

InvertKey.HTML =
    "ALPHABET = <span class='strlit'>\"ABCDEFGHIJKLMNOPQRSTUVWXYZ\"</span>\n" +
    "\n" +
    "<span class='keyword'>def</span> invert<span class='u'>_</span>" +
         "key(key):\n" +
    "    <span class='#1'>newkey = <span class='strlit'>\"\"</span></span>\n" +
    "    <span class='#2'><span class='keyword'>for</span> " +
         "<span class='#2a'>ch <span class='keyword'>in</span> " +
         "ALPHABET</span>:</span>\n" +
    "        <span class='#3'>newkey += " +
         "<span class='#3a'>ALPHABET[<span class='#3b'>key.find(ch)</span>]" +
         "</span></span>\n" +
    "    <span class='#4'><span class='keyword'>return</span> newkey</span>\n";
