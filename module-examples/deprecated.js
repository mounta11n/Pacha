







// --------------------------------------------
// widget for multi-line text
//
const multiNotes = blessed.textarea({
  done: () => {},
  top: 1,
  left: 0,
  width: '100%-4',
  height: '100%-4',
  label: 'Notes',
  tags: true,
  keys: true,
  mouse: true,
  scrollable: true,
  inputOnFocus: true,
  border: {
    type: 'line'
  },
  style: {
    bg: '#555753',
    fg: '#d3d7cf',
    label: {
      bg: '#555753',
      fg: '#f5f5f5',
      bold: true,
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    hover: {
      bg: '#555753',
      fg: '#f5f5f5',
      bold: true,
    },
    focus: {
      bg: '#555753',
      fg: '#f5f5f5',
      bold: true,
    },
    selected: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
  }
)

// TODO still buggy...
multiNotes.on('submit', () => {});
multiNotes.on('cancel', () => {
  multiNotes.cancel();
});
multiNotes.key(['escape'], function(ch, key) {
  multiNotes.cancel();
});


const multiNotesSaveLabel = blessed.box({
  // let multiNotesSaveLabel = blessed.button({
  done: () => {},
  bottom: 2,
  right: 5,
  width: 4,
  height: 1,
  mouse: true,
  keys: true,
  shrink: true,
  content: 'Save',
  // align: 'center',
  // valign: 'middle',
  // border: {
  //   type: 'line'
  // },
  style: {
    bg: '#555753',
    fg: '#4e9a06',
    bold: true,
    // border: {
    //   bg: '#555753',
    //   fg: 'red',
    // },
    hover: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
    // focus: {
    //   border: {
    //     fg: 'blue',
    //   }
    // },
    selected: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
  }
)

multiNotes.on('submit', () => {});

// TODO
multiNotesSaveLabel.on('click', () => {
  saveMultiNotes();
  multiNotes.clearValue();
  screen.render();
  }
)

const placeHolderNotes = blessed.box({
  done: () => {},
  top: 1,
  left: 0,
  width: '100%-4',
  height: '100%-4',
  label: 'Placeholder',
  tags: true,
  keys: true,
  mouse: true,
  scrollable: true,
  inputOnFocus: true,
  border: {
    type: 'line'
  },
  style: {
    bg: '#555753',
    fg: '#d3d7cf',
    label: {
      bg: '#555753',
      fg: '#f5f5f5',
      bold: true,
      hover: {
        bg: '#555753',
        fg: '#8ae234',
        bold: true,
      },
    },
    border: {
      bg: '#555753',
      fg: '#d3d7cf',
    },
    hover: {
      bg: '#555753',
      fg: '#f5f5f5',
      bold: true,
    },
    focus: {
      bg: '#555753',
      fg: '#f5f5f5',
      bold: true,
    },
    selected: {
      bg: '#555753',
      fg: '#8ae234',
      bold: true,
    },
  },
  }
)
//
// --------------------------------------------



// --------------------------------------------
//
const textAreaRightTooltip = blessed.text({
    top: 1,
    right: 0,
    width: 6,
    height: '100%-2',
    // left: '55%',
    // align: 'center',
    // valign: 'middle',
    content: '',
    hoverText: '\n make your own notes and save them. \ntimestamp and the current belonging parameters will be saved as well \n',
    // border: {
    //   type: 'line'
    // },
    style: {
      bg: '#555753',
      fg: '#555753',
      border: {
        bg: '#555753',
        fg: '#d3d7cf',
      },
      focus: {
        bg: '#555753',
        fg: '#555753',
      },
      hover: {
        bg: '#555753',
        fg: '#555753',
        bold: true,
      },
    },
    }
  )
  
  const textAreaBottomTooltip = blessed.text({
    bottom: 0,
    left: 0,
    width: '100%-9',
    height: 4,
    // left: '55%',
    // align: 'center',
    // valign: 'bottom',
    content: '',
    hoverText: '\n make your own notes and save them. \ntimestamp and the current belonging parameters will be saved as well \n',
    // border: {
    //   type: 'line'//debugging
    // },
    style: {
      bg: '#555753',
      fg: '#555753',
      border: {
        bg: '#555753',
        fg: '#d3d7cf',
      },
      focus: {
        bg: '#555753',
        fg: '#555753',
      },
      hover: {
        bg: '#555753',
        fg: '#555753',
        bold: true,
      },
    },
    }
  )
  
  const textAreaBottom2Tooltip = blessed.text({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 2,
    // left: '55%',
    // align: 'center',
    // valign: 'bottom',
    content: '',
    hoverText: '\n make your own notes and save them. \ntimestamp and the current belonging parameters will be saved as well \n',
    // border: {
    //   type: 'line'//debugging
    // },
    style: {
      bg: '#555753',
      fg: '#555753',
      border: {
        bg: '#555753',
        fg: '#d3d7cf',
      },
      focus: {
        bg: '#555753',
        fg: '#555753',
      },
      hover: {
        bg: '#555753',
        fg: '#555753',
        bold: true,
      },
    },
    }
  )
  
  // multiNotesSaveLabel.on('submit', () => {});
  inputBox.on('submit', () => {});
  // multiNotesSaveLabel.on('click', () => {
  //   saveMultiNotes();
  // });
  //
  // --------------------------------------------