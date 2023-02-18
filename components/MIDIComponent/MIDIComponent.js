// This is our custom web component, which implements MIDI port access
class CustomMIDI extends HTMLElement {

    // A utility function for creating a new html element with given id and class
    static newElement(tag, id, clsName) {
      const elem = document.createElement(tag);
      elem.className = clsName;
      elem.id = id;
      return elem;
    }

    constructor() {
      // Always call super first in constructor
      super();
      
      // get access to the DOM tree for this element
      const shadow = this.attachShadow({mode: 'open'});
      
      // Apply customMidi external stylesheet to the shadow dom
      const linkElem = document.createElement('link');
      linkElem.setAttribute('rel', 'stylesheet');
      linkElem.setAttribute('href', 'components/MIDIComponent/MIDIComponent.css');

      // Attach the created elements to the shadow dom
      shadow.appendChild(linkElem);

      // create a top level full width strip to hold the component
      this.mainStrip = CustomMIDI.newElement('div', 'customMidiMainStrip', 'custom-midi main-strip');
      shadow.appendChild(this.mainStrip);

      // Create a top level panel, that need not be full width
      this.mainPanel = CustomMIDI.newElement('div', 'customMidiMainPanel', 'custom-midi main-panel horizontal-panel');
      this.mainStrip.appendChild(this.mainPanel);

      this.mainLabel = CustomMIDI.newElement('div', 'customMidiMainLabel', 'main-label');
      this.mainLabel.innerHTML = "MIDI Ports";
      this.mainPanel.appendChild(this.mainLabel);

      // Populate an input and output port table, with toggle buttons to connect/disconnect
      this.inputPortTable = CustomMIDI.newElement('div', 'customMidiInputPortTable', 'port-table vertical-panel');
      this.mainPanel.appendChild(this.inputPortTable);
      this.inputPortTableHeader = CustomMIDI.newElement('div', 'customMidiInputPortTableHeader', 'port-table-header');
      this.inputPortTableHeader.innerHTML = 'MIDI Inputs';
      this.inputPortTable.appendChild(this.inputPortTableHeader);

      this.outputPortTable = CustomMIDI.newElement('div', 'customMidiOutputPortTable', 'port-table vertical-panel');
      this.mainPanel.appendChild(this.outputPortTable);
      this.outputPortTableHeader = CustomMIDI.newElement('div', 'customMidiOutputPortTableHeader', 'port-table-header');
      this.outputPortTableHeader.innerHTML = 'MIDI Outputs';
      this.outputPortTable.appendChild(this.outputPortTableHeader);
    }
  
    populatePortTables() {
      if (this.midi) {
        if (this.midi.inputs) {
          this.midi.inputs.forEach((inputPort) => {
            // a panel to hold the name of the port, and a toggle button for connecting
            const inputPortPanel = CustomMIDI.newElement('div', `inputPortPanel_${inputPort.id}`, 'port-panel horizontal-panel'); 
            this.inputPortTable.appendChild(inputPortPanel);
            // the name of the midi port
            const inputPortName = CustomMIDI.newElement('div', `customMidiInputPortName_${inputPort.id}`, 'port-name');
            inputPortName.innerHTML = `${inputPort.manufacturer} ${inputPort.name}`;
            inputPortPanel.appendChild(inputPortName);
            // toggle button for connecting
            const inputPortToggle = CustomMIDI.newElement('button', `inputPortToggle_${inputPort.id}`, 'port-toggle toggled-off');
            inputPortToggle.innerHTML = "Connect";
            inputPortPanel.appendChild(inputPortToggle);
            if (inputPort.connection == 'open') {
              inputPortToggle.classList.remove('toggled-off');
              inputPortToggle.classList.add('toggled-on');
              inputPortToggle.innerHTML = "Diconnect";
            }
            inputPortToggle.addEventListener('click', async (event) => {
              if (inputPortToggle.classList.contains('toggled-on')) {
                await inputPort.close();
                inputPortToggle.classList.remove('toggled-on');
                inputPortToggle.classList.add('toggled-off');
                inputPortToggle.innerHTML = 'Connect';
              } else {
                await inputPort.open();
                inputPortToggle.classList.remove('toggled-off');
                inputPortToggle.classList.add('toggled-on');
                inputPortToggle.innerHTML = 'Disconnect';
              }          
            });
          });
        }
      
        if (this.midi.outputs) {
          this.midi.outputs.forEach((outputPort) => {
            // a panel to hold the name of the port, and a toggle button for connecting
            const outputPortPanel = CustomMIDI.newElement('div', `outputPortPanel_${outputPort.id}`, 'port-panel horizontal-panel'); 
            this.outputPortTable.appendChild(outputPortPanel);
            // the name of the midi port
            const outputPortName = CustomMIDI.newElement('div', `customMidiOutputPortName_${outputPort.id}`, 'port-name');
            //outputPortName.innerHTML = ` id:${outputPort.id} manufacturer: ${outputPort.manufacturer} name: ${outputPort.name} version:${outputPort.version}`;
            outputPortName.innerHTML = `${outputPort.manufacturer} ${outputPort.name}`;
            outputPortPanel.appendChild(outputPortName);
            // toggle button for connecting
            const outputPortToggle = CustomMIDI.newElement('button', `outputPortToggle_${outputPort.id}`, 'port-toggle toggled-off');
            outputPortToggle.innerHTML = "Connect";
            outputPortPanel.appendChild(outputPortToggle);
            if (outputPort.connection == 'open') {
              outputPortToggle.classList.remove('toggled-off');
              outputPortToggle.classList.add('toggled-on');
              outputPortToggle.innerHTML = "Disconnect";
            }
            outputPortToggle.addEventListener('click', async (event) => {
              if (outputPortToggle.classList.contains('toggled-on')) {
                await outputPort.close();
                outputPortToggle.classList.remove('toggled-on');
                outputPortToggle.classList.remove('toggled-off');
                outputPortToggle.innerHTML = 'Connect';
              } else {
                await outputPort.open();
                outputPortToggle.classList.remove('toggled-off');
                outputPortToggle.classList.add('toggled-on');
                outputPortToggle.innerHTML = 'Disconnect';
              }          
            });
          });
        }
      }
    }

    connectedCallback() {
      console.log('MIDI custom element added to page.');
      //populatePortTables(this);
      this.init();
    }
  
    disconnectedCallback() {
      console.log('MIDI custom element removed from page.');
    }
  
    adoptedCallback() {
      console.log('MIDI custom element moved to new page.');
    }

    async init() {
      this.midi = await navigator.requestMIDIAccess();
      this.populatePortTables();
    }
  
}
  
customElements.define('custom-midi', CustomMIDI);
