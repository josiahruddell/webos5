if (typeof (JUI) != 'undefined') {
    // default configuration types for desktop core objects
    JUI.setDefaultElementConfig = function () {
        JUI.config = {
            YouTube: { },
            File: { w: 1312, h: 584, type: 'file', templateNode: '#file' },
            Message: { templateNode: '#message', type: 'message', w: 623, h: 159, x: 300, y: 50, orientX: 'right', fx: 'slideToggle', duration: 150 },
            MenuStrip: { templateNode: '#strip', type: 'strip', w: 674, h: 158, x: 110, y: 1, orientX: 'right', leash: true },
            NoteWriter: { templateNode: '#notewriter', type: 'notewriter', w: 719, h: 772, x: 10, y: -10, orientX: 'left' },
            Sketch: { templateNode: '#sketch', type: 'sketch', w: 830, h: 771, x: 100, y: -10, orientX: 'left' },
            Icon: { templateNode: '#icon-one', w: 200, h: 100 },
            Button: { templateNode: '#button', w: 200, h: 100 }
            
        };
    };
}