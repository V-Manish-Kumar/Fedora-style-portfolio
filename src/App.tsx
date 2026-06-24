import { Desktop } from './desktop/Desktop';
import { BootScreen } from './desktop/BootScreen';
import { useSystemStore } from './store/useSystemStore';
import { ImmersiveManager } from './desktop/ImmersiveManager';

function App() {
  const bootState = useSystemStore((state) => state.bootState);
  const nightLight = useSystemStore((state) => state.nightLight);

  return (
    <>
      <ImmersiveManager />
      {bootState !== 'desktop' && <BootScreen />}
      {bootState === 'desktop' && <Desktop />}
      {nightLight && (
        <div className="pointer-events-none fixed inset-0 bg-orange-400/[0.08] mix-blend-multiply z-[99999]" />
      )}
    </>
  );
}

export default App;
