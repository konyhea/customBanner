import { Toaster } from "sonner";
import CustomBanner from "./CustomBanner/CustomBanner";

export default function App() {
  return (
    <>
      <CustomBanner />
      <Toaster richColors position="bottom-left" swipeDirections="right" />
    </>
  );
}
