class MicDelayProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.outVol = 0.8;
    this.inGain = 1.0;
    this.delayMs = 220;
    this.feedback = 0.35;
    this.wet = 0.45;
    this.gate = 0.02;

    this.maxDelaySec = 5;
    this.buf = new Float32Array(Math.floor(sampleRate * this.maxDelaySec));
    this.w = 0;

    this.port.onmessage = (e) => {
      const p = e.data || {};
      if (typeof p.outVol === "number") this.outVol = clamp(p.outVol, 0, 1);
      if (typeof p.inGain === "number") this.inGain = clamp(p.inGain, 0.5, 6);
      if (typeof p.delayMs === "number") this.delayMs = clamp(p.delayMs, 0, this.maxDelaySec * 1000);
      if (typeof p.feedback === "number") this.feedback = clamp(p.feedback, 0, 0.95);
      if (typeof p.wet === "number") this.wet = clamp(p.wet, 0, 1);
      if (typeof p.gate === "number") this.gate = clamp(p.gate, 0, 0.2);
    };
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];
    if (!input || input.length === 0) return true;

    const inCh = input[0];
    const outCh = output[0];

    const delaySamples = Math.floor((this.delayMs / 1000) * sampleRate);
    const bufLen = this.buf.length;

    let avg = 0;
    for (let i = 0; i < inCh.length; i++) avg += Math.abs(inCh[i]);
    avg /= Math.max(1, inCh.length);
    const gateOpen = avg >= this.gate;

    for (let i = 0; i < inCh.length; i++) {
      const x = (gateOpen ? inCh[i] : 0) * this.inGain;
      const r = (this.w - delaySamples + bufLen) % bufLen;
      const d = this.buf[r];
      const y = x * (1 - this.wet) + d * this.wet;
      const nd = clamp(x + d * this.feedback, -1, 1);

      this.buf[this.w] = nd;
      this.w = (this.w + 1) % bufLen;

      outCh[i] = clamp(y * this.outVol, -1, 1);
    }
    return true;
  }
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
registerProcessor("mic-delay-processor", MicDelayProcessor);
