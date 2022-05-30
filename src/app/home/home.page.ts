import { ChangeDetectorRef, Component } from '@angular/core';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  recording = false;
  myText = 'Ciao';

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    SpeechRecognition.requestPermission();
  }

  async startRecognition() {
    const { available } = await SpeechRecognition.available();

    if (available) {
      this.recording = true;
      SpeechRecognition.start({
        popup: true,
        partialResults: true,
        language: 'it-IT'
        // maxResult
      });

      SpeechRecognition.addListener('partialResults', (data: any) => {
        if (data.matches && data.matches.length > 0) {
          this.myText = data.matches[0];
          this.changeDetectorRef.detectChanges();
        }

        // Android has different result type
        if (data.value && data.value.length > 0) {
          this.myText = data.value[0];
          this.changeDetectorRef.detectChanges();
        }
      });
    }
  }

  async stopRecognition() {
    this.recording = false;
    await SpeechRecognition.stop();
  }

  speakText() {
    TextToSpeech.speak({
      text: this.myText,
      lang: 'it-IT'
    })
  }

}
