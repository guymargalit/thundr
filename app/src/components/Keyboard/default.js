// connectMIDI() {
//   WebMidi.enable(err => {
//     if (!err) {
//       if (WebMidi.inputs.length > 0) {
//         let controller = WebMidi.inputs[0];
//         controller.addListener('controlchange', 'all', e => {
//           if (!this.props.is_playing) {
//             if (e.value > 0) {
//               this.setState({ sustain: true });
//               this.sustainOn();
//             } else {
//               this.setState({ sustain: false });
//               this.sustainOff();
//             }
//           }
//         });
//         controller.addListener('noteon', 'all', e => {
//           if (!this.props.is_playing) {
//             this.addNote({
//               id: e.note.number,
//               color: {
//                 hue: e.note.number % 12,
//                 saturation: 1 - 0.1 * (e.note.octave + 1),
//                 brightness: Math.min(Math.max(e.velocity, 0.3), 1),
//                 kelvin: 3500,
//               },
//               duration: e.timestamp,
//               sustain: this.state.sustain,
//             });
//           }
//         });

//         controller.addListener('noteoff', 'all', e => {
//           if (!this.props.is_playing) {
//             this.removeNote(e.note.number);
//           }
//         });
//       }
//     }
//   });
// }

// addNote = note => {
//   let packets = this.state.packets;
//   for (let i = 0; i < packets.length; i++) {
//     if (packets[i].note_id === null) {
//       packets[i].note_id = note.id;
//       packets[i].color = note.color;
//       packets[i].sustain = note.sustain;
//       ipcRenderer.send('lifx-note', {
//         id: packets[i].light_id,
//         color: note.color,
//       });
//       break;
//     }
//   }
//   this.setState({
//     notes: [...this.state.notes, note],
//     packets,
//   });
// };

// removeNote = note => {
//   let packets = this.state.packets;
//   for (let i = 0; i < packets.length; i++) {
//     if (packets[i].note_id === note) {
//       packets[i].note_id = null;
//       if (packets[i].sustain === false) {
//         packets[i].color = {
//           hue: 0,
//           saturation: 0,
//           brightness: 0,
//           kelvin: 3500,
//         };
//         ipcRenderer.send('lifx-note', {
//           id: packets[i].light_id,
//           color: {
//             hue: 0,
//             saturation: 0,
//             brightness: 0,
//             kelvin: 3500,
//           },
//         });
//       }
//       break;
//     }
//   }
//   this.setState({ notes: this.state.notes.filter(item => item.id !== note), packets });
// };

// sustainOn = () => {
//   let packets = this.state.packets;
//   for (let i = 0; i < packets.length; i++) {
//     packets[i].sustain = true;
//   }
//   this.setState({ packets });
// };

// sustainOff = () => {
//   let packets = this.state.packets;
//   for (let i = 0; i < packets.length; i++) {
//     packets[i].note_id = null;
//     packets[i].color = {
//       hue: 0,
//       saturation: 0,
//       brightness: 0,
//       kelvin: 3500,
//     };
//     ipcRenderer.send('lifx-note', {
//       id: packets[i].light_id,
//       color: {
//         hue: 0,
//         saturation: 0,
//         brightness: 0,
//         kelvin: 3500,
//       },
//     });
//   }
//   this.setState({ packets });
// };
