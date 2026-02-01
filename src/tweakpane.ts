import { Pane } from 'tweakpane';

export const pane = new Pane({title: 'Settings', expanded: true});

export const SETTINGS = {

    camera_fov: 30.0,

    object_rotation_speed: 10.0,
    object_size: 0.4,

    light_direction: {x: 1.0, y: 1.0, z: 1.0},

    benchmark_fps: 0.0,
    benchmark_loading_time: 0.0,

    source_github: 'null'
};

export function init() {

    // CAMERA

    const fCamera = pane.addFolder({title: 'Camera', expanded: false});

    fCamera.addBinding(SETTINGS, 'camera_fov', {
        label: 'FOV',
        min: 30.0,
        max: 120.0,
        step: 5.0
    });

    // OBJECT

    const fObject = pane.addFolder({title: 'Object', expanded: false});

    fObject.addBinding(SETTINGS, 'object_rotation_speed', {
        label: 'R. Speed',
        min: 0.0,
        max: 180.0,
        step: 1.0
    });

    fObject.addBinding(SETTINGS, 'object_size', {
        label: 'Size',
        min: 0.1,
        max: 1.0,
        step: 0.1
    });

    // LIGHT

    const fLight = pane.addFolder({title: 'Light', expanded: false});

    fLight.addBinding(SETTINGS, 'light_direction', {
        label: 'Ambient Light',
        x: {min: -1.0, max: 1.0},
        y: {min: -1.0, max: 1.0},
        z: {min: -1.0, max: 1.0},
        interval: 100
    })

    // BENCHMARK

    const fBenchmark = pane.addFolder({title: 'Timers', expanded: true});

    fBenchmark.addBinding(SETTINGS, 'benchmark_fps', {
        label: 'FPS',
        readonly: true,
        view: 'text',
        interval: 500
    });

    fBenchmark.addBinding(SETTINGS, 'benchmark_loading_time', {
        label: 'Loading Time',
        readonly: true,
        format: (value: number): string => {
            return value.toFixed(1) + 'ms';
        }
    });

    // SOURCE

    const fSource = pane.addFolder({title: 'Sources', expanded: false});

    fSource.addButton({title: 'See Repo', label: 'Github'}).on('click', () => {
        window.open(SETTINGS.source_github, '_blank');
    });
};
