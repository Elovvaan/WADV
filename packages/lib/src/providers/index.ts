import { MockDirectorProvider, MockImageProvider, MockStoryProvider, MockTranscriptionProvider, MockVideoProvider, MockVoiceProvider } from './mock-providers';

export const providerRegistry = {
  story: new MockStoryProvider(),
  director: new MockDirectorProvider(),
  image: new MockImageProvider(),
  video: new MockVideoProvider(),
  voice: new MockVoiceProvider(),
  transcription: new MockTranscriptionProvider(),
};
