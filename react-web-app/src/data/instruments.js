import * as Tone from "tone";

export const toneObject = Tone;
export const toneTransport = toneObject.Transport;

export const synth = new toneObject.PolySynth().toDestination();

export const tonePart = new toneObject.Part((time, note) => {
    guitar.triggerAttackRelease(note, "8n", time);
}, []).start(0);

// the export data in guitar instrument
export const guitar = new toneObject.Sampler({
    urls: {
        "F3": "F3.mp3",
        "G3": "G3.mp3",
        "A3": "A3.mp3",
        "B3": "B3.mp3",
        "C3": "C3.mp3",
        "D3": "D3.mp3",
        "E3": "E3.mp3",
    },
    release: 1,
    baseUrl: "../samples/guitar-acoustic/"
}).toDestination();

// the export data in piano instrument
export const piano = new toneObject.Sampler({
    urls: {
        "F3": "F3.mp3",
        "G3": "G3.mp3",
        "A3": "A3.mp3",
        "B3": "B3.mp3",
        "C3": "C3.mp3",
        "D3": "D3.mp3",
        "E3": "E3.mp3",
    },
    release: 1,
    baseUrl: "../samples/piano/"
}).toDestination();

// the export data in french_horn instrument
export const french_horn = new toneObject.Sampler({
    urls: {
        "F3": "F3.mp3",
        "G3": "G2.mp3",
        "A3": "A3.mp3",
        "B3": "C4.mp3",
        "C3": "D3.mp3",
        "D3": "Ds2.mp3",
        "E3": "D5.mp3",
    },
    release: 1,
    baseUrl: "../samples/french-horn/"
}).toDestination();

// the export data in drums instrument
export const drums = new toneObject.Sampler({
    urls: {
        "F3": "drums7.mp3",
        "G3": "drums6.mp3",
        "A3": "drums5.mp3",
        "B3": "drums4.mp3",
        "C3": "drums3.mp3",
        "D3": "drums2.mp3",
        "E3": "drums1.mp3",
    },
    release: 1,
    baseUrl: "../samples/drums/"
}).toDestination();